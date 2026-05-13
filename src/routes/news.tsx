import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { NewsCard, NewsCardSkeleton } from "@/components/NewsCard";
import { fetchNews, type NewsItem } from "@/lib/news.functions";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/news")({
  component: NewsPage,
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "All News — SCADA Daily" },
      { name: "description", content: "Search and browse the latest SCADA, PLC, DCS, IIoT and OT cybersecurity news from across the industry." },
      { property: "og:title", content: "All News — SCADA Daily" },
      { property: "og:description", content: "Search the latest industrial automation news." },
      { property: "og:url", content: "/news" },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
});

const PAGE = 18;

function NewsPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(q);
  const [pages, setPages] = useState(1);
  const sentinel = useRef<HTMLDivElement>(null);
  const getNews = useServerFn(fetchNews);

  useEffect(() => setInput(q), [q]);
  useEffect(() => setPages(1), [q]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["news", "all", q, pages],
    queryFn: () => getNews({ data: { q: q || undefined, limit: pages * PAGE } }),
    placeholderData: (prev) => prev,
  });

  const items: NewsItem[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasMore = items.length < total;

  useEffect(() => {
    if (!sentinel.current || !hasMore || isFetching) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setPages((p) => p + 1);
    }, { rootMargin: "200px" });
    obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [hasMore, isFetching, items.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold">All News</h1>
        <p className="text-muted-foreground mt-1">Search the full feed of industrial automation news.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: { q: input } });
          }}
          className="mt-6 relative max-w-2xl"
        >
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search SCADA, PLC, OPC UA, ransomware…"
            className="w-full h-12 pl-11 pr-28 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 h-9 px-4 rounded-lg scada-gradient text-primary-foreground text-sm font-semibold"
          >
            Search
          </button>
        </form>

        {q && (
          <p className="text-sm text-muted-foreground mt-3">
            {total} results for <span className="font-semibold text-foreground">"{q}"</span>
          </p>
        )}

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => <NewsCardSkeleton key={i} />)
            : items.map((it) => <NewsCard key={it.id} item={it} />)}
        </div>

        {!isLoading && items.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground mt-6">
            No news matched your search.
          </div>
        )}

        <div ref={sentinel} className="h-12 flex items-center justify-center mt-6">
          {isFetching && hasMore && <Loader2 className="w-5 h-5 animate-spin text-accent" />}
          {!hasMore && items.length > 0 && <span className="text-xs text-muted-foreground">You've reached the end.</span>}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
