// Every outlet Extra! Extra! pulls from. To add one, copy a line and change it.
//   edition: us | gb | ca | sg | au | in   (matches the editions in the app)
//   rating:  L | LL | C | LR | R | null    (Left, Lean Left, Center, Lean Right, Right, not rated)
// Ratings come from AllSides (allsides.com/media-bias). They change over time, so re-check them.
// Feed URLs were written from memory and could not be tested offline. Open each one in a
// browser first, and expect to fix or replace a few.
export const SOURCES = [
  { id: "bbc_us",      name: "BBC News",             edition: "us", rating: "C",  feed: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml" },
  { id: "npr",         name: "NPR",                  edition: "us", rating: "LL", feed: "https://feeds.npr.org/1014/rss.xml" },
  { id: "fox",         name: "Fox News",             edition: "us", rating: "R",  feed: "https://moxie.foxnews.com/google-publisher/politics.xml" },
  { id: "nyt",         name: "The New York Times",   edition: "us", rating: "LL", feed: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml" },
  { id: "guardian_us", name: "The Guardian",         edition: "us", rating: "L",  feed: "https://www.theguardian.com/us-news/us-politics/rss" },
  { id: "wex",         name: "Washington Examiner",  edition: "us", rating: "LR", feed: "https://www.washingtonexaminer.com/feed" },
  { id: "bbc_uk",      name: "BBC News",             edition: "gb", rating: "C",  feed: "https://feeds.bbci.co.uk/news/politics/rss.xml" },
  { id: "guardian_uk", name: "The Guardian",         edition: "gb", rating: "L",  feed: "https://www.theguardian.com/politics/rss" },
  { id: "cbc",         name: "CBC News",             edition: "ca", rating: null, feed: "https://www.cbc.ca/webfeed/rss/rss-politics" },
  { id: "st",          name: "The Straits Times",    edition: "sg", rating: null, feed: "https://www.straitstimes.com/news/politics/rss.xml" },
  { id: "abc_au",      name: "ABC News (Australia)", edition: "au", rating: null, feed: "https://www.abc.net.au/news/feed/45910/rss.xml" },
  { id: "hindu",       name: "The Hindu",            edition: "in", rating: null, feed: "https://www.thehindu.com/news/national/feeder/default.rss" },
];
