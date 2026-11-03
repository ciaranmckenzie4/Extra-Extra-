// Extra! Extra! news server. Node 18+.  Run:  npm install && npm start
import express from "express";
import cors from "cors";
import Parser from "rss-parser";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { SOURCES } from "./sources.js";

// ---- Settings you may want to change ----
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";   // set to your site's address in production
const REFRESH_MINUTES = 10;       // how often feeds are re-read
const BREAKING_HOURS = 18;        // newer than this = "breaking"
const KEEP_DAYS = 30;             // older articles are dropped
const SNIPPET_CHARS = 240;        // we show a short teaser only, never full text
const CACHE_FILE = "./cache.json";
// -----------------------------------------

const parser = new Parser({ timeout: 10000, headers: { "User-Agent": "ExtraExtraBot/1.0 (news aggregator; contact: you@example.com)" } });
let articles = [];

const clean = (html) => String(html || "").replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
const teaser = (text) => {
  if (text.length <= SNIPPET_CHARS) return text;
  const cut = text.slice(0, SNIPPET_CHARS);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
};
const idFor = (url) => createHash("sha1").update(url).digest("hex").slice(0, 12);

async function readOne(source) {
  const feed = await parser.parseURL(source.feed);
  return feed.items
    .filter((i) => i.link && i.title)
    .map((i) => ({
      id: idFor(i.link),
      src: source.id,
      e: source.edition,
      t: new Date(i.isoDate || i.pubDate || Date.now()).toISOString(),
      h: clean(i.title),
      u: i.link,                                              // always links to the publisher
      b: teaser(clean(i.contentSnippet || i.content || i.summary)),
    }));
}

async function refresh() {
  const results = await Promise.allSettled(SOURCES.map(readOne));
  const fresh = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") fresh.push(...r.value);
    else console.warn(`[feed failed] ${SOURCES[i].id}: ${r.reason?.message}`);   // one bad feed never breaks the rest
  });
  const cutoff = Date.now() - KEEP_DAYS * 864e5;
  const merged = new Map([...articles, ...fresh].map((a) => [a.id, a]));
  articles = [...merged.values()]
    .filter((a) => Date.parse(a.t) >= cutoff)
    .sort((a, b) => Date.parse(b.t) - Date.parse(a.t))
    .slice(0, 3000);
  await writeFile(CACHE_FILE, JSON.stringify(articles)).catch(() => {});
  console.log(`[refresh] ${articles.length} articles from ${results.filter((r) => r.status === "fulfilled").length}/${SOURCES.length} feeds`);
}

const sourceInfo = Object.fromEntries(SOURCES.map((s) => [s.id, { n: s.name, r: s.rating }]));
const decorate = (a) => ({ ...a, srcInfo: sourceInfo[a.src], breaking: Date.now() - Date.parse(a.t) <= BREAKING_HOURS * 36e5 });

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));

// GET /api/news?before=<ms timestamp>&n=10&editions=us,gb
// Newest first. Pass the timestamp of the last item you have as "before" to get the next, older batch.
app.get("/api/news", (req, res) => {
  const before = Number(req.query.before) || Infinity;
  const n = Math.min(Number(req.query.n) || 10, 500);
  const eds = String(req.query.editions || "").split(",").filter(Boolean);
  const pool = articles.filter((a) => Date.parse(a.t) < before && (!eds.length || eds.includes(a.e)));
  res.json({ items: pool.slice(0, n).map(decorate), more: pool.length > n });
});

app.get("/api/sources", (_req, res) => res.json(sourceInfo));
app.get("/health", (_req, res) => res.json({ ok: true, articles: articles.length }));

try { articles = JSON.parse(await readFile(CACHE_FILE, "utf8")); } catch { /* first run */ }
await refresh();
setInterval(() => refresh().catch(console.error), REFRESH_MINUTES * 60000);
app.listen(PORT, () => console.log(`Extra! Extra! server on http://localhost:${PORT}`));
