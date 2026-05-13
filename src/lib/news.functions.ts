import { createServerFn } from "@tanstack/react-start";
import { XMLParser } from "fast-xml-parser";
import { categorize, type CategorySlug } from "./categories";

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceUrl: string;
  publishedAt: string; // ISO
  summary: string;
  categories: CategorySlug[];
  image?: string;
};

const FEEDS: { source: string; url: string; sourceUrl: string }[] = [
  { source: "Automation.com", url: "https://www.automation.com/en-us/rss/all-articles", sourceUrl: "https://www.automation.com" },
  { source: "Control Engineering", url: "https://www.controleng.com/feed/", sourceUrl: "https://www.controleng.com" },
  { source: "Control Global", url: "https://www.controlglobal.com/rss/all.xml", sourceUrl: "https://www.controlglobal.com" },
  { source: "ISA", url: "https://blog.isa.org/rss.xml", sourceUrl: "https://www.isa.org" },
  { source: "The Hacker News (ICS)", url: "https://feeds.feedburner.com/TheHackersNews", sourceUrl: "https://thehackernews.com" },
  { source: "Industrial Cyber", url: "https://industrialcyber.co/feed/", sourceUrl: "https://industrialcyber.co" },
  { source: "Plant Engineering", url: "https://www.plantengineering.com/feed/", sourceUrl: "https://www.plantengineering.com" },
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
});

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImage(html: string): string | undefined {
  if (!html) return undefined;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1];
}

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

async function fetchFeed(feed: typeof FEEDS[number]): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": "SCADADaily/1.0 (+https://scadadaily.com)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const data = parser.parse(xml);

    const channelItems = data?.rss?.channel?.item;
    const atomEntries = data?.feed?.entry;
    const rawItems: any[] = (Array.isArray(channelItems) ? channelItems : channelItems ? [channelItems] : []) ||
      (Array.isArray(atomEntries) ? atomEntries : atomEntries ? [atomEntries] : []);
    const items: any[] = rawItems.length ? rawItems : Array.isArray(atomEntries) ? atomEntries : atomEntries ? [atomEntries] : [];

    return items.slice(0, 20).map((it: any) => {
      const title = stripHtml(typeof it.title === "string" ? it.title : it.title?.["#text"] || "");
      const linkRaw = typeof it.link === "string" ? it.link : it.link?.["@_href"] || it.link?.[0]?.["@_href"] || it.guid?.["#text"] || it.guid || "";
      const link = String(linkRaw).trim();
      const descRaw = it.description || it["content:encoded"] || it.summary || it.content?.["#text"] || it.content || "";
      const description = stripHtml(typeof descRaw === "string" ? descRaw : descRaw?.["#text"] || "");
      const summary = description.length > 320 ? description.slice(0, 317) + "…" : description;
      const pubRaw = it.pubDate || it.published || it.updated || it["dc:date"] || new Date().toISOString();
      let publishedAt = new Date(pubRaw).toISOString();
      if (isNaN(new Date(publishedAt).getTime())) publishedAt = new Date().toISOString();
      const image = extractImage(typeof descRaw === "string" ? descRaw : "") ||
        it.enclosure?.["@_url"] ||
        it["media:content"]?.["@_url"] ||
        it["media:thumbnail"]?.["@_url"];

      return {
        id: hash(`${feed.source}::${link}::${title}`),
        title,
        link,
        source: feed.source,
        sourceUrl: feed.sourceUrl,
        publishedAt,
        summary,
        categories: categorize(title, summary),
        image,
      } satisfies NewsItem;
    }).filter((i) => i.title && i.link);
  } catch (e) {
    console.error(`Feed failed: ${feed.source}`, e);
    return [];
  }
}

let cache: { at: number; items: NewsItem[] } | null = null;
const TTL = 10 * 60 * 1000; // 10 min

async function getAllNews(): Promise<NewsItem[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.items;
  const all = (await Promise.all(FEEDS.map(fetchFeed))).flat();
  all.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  cache = { at: Date.now(), items: all };
  return all;
}

export const fetchNews = createServerFn({ method: "GET" })
  .inputValidator((input: { category?: string; q?: string; limit?: number; offset?: number }) => input)
  .handler(async ({ data }) => {
    let items = await getAllNews();
    if (data.category) items = items.filter((i) => i.categories.includes(data.category as CategorySlug));
    if (data.q) {
      const q = data.q.toLowerCase();
      items = items.filter((i) => i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q));
    }
    const offset = data.offset ?? 0;
    const limit = data.limit ?? 20;
    return {
      total: items.length,
      items: items.slice(offset, offset + limit),
    };
  });

export const fetchTrending = createServerFn({ method: "GET" }).handler(async () => {
  const items = await getAllNews();
  // Trending: extract top words from titles
  const words = new Map<string, number>();
  const stop = new Set(["the","a","an","of","to","for","in","on","with","and","or","new","how","why","is","are","at","by","from","this","that","its","be","as","into","over","you","your","our","up","out","more"]);
  for (const it of items.slice(0, 60)) {
    for (const w of it.title.toLowerCase().split(/[^a-z0-9]+/)) {
      if (w.length < 4 || stop.has(w)) continue;
      words.set(w, (words.get(w) ?? 0) + 1);
    }
  }
  const top = [...words.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([w]) => w);
  return { topics: top };
});
