import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Cpu, ShieldCheck, Network } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { NewsCard, NewsCardSkeleton } from "@/components/NewsCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { fetchNews, fetchTrending } from "@/lib/news.functions";
import { CATEGORIES } from "@/lib/categories";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "SCADA Daily — SCADA, PLC, DCS & Industrial Automation News" },
      {
        name: "description",
        content:
          "Your daily source for SCADA, PLC, DCS, IIoT, and OT cybersecurity news. Aggregated from trusted industry publications and updated continuously.",
      },
      { property: "og:title", content: "SCADA Daily — Industrial Automation News" },
      {
        property: "og:description",
        content: "Curated SCADA, PLC, DCS, and OT cybersecurity news — updated daily.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Home() {
  const getNews = useServerFn(fetchNews);
  const getTrending = useServerFn(fetchTrending);

  const { data: news, isLoading } = useQuery({
    queryKey: ["news", "home"],
    queryFn: () => getNews({ data: { limit: 13 } }),
  });
  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending({}),
  });

  const items = news?.items ?? [];
  const [featured, ...rest] = items;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 scada-gradient opacity-[0.04]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full scada-gradient opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent opacity-10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Updated continuously · May 2026
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-4xl leading-[1.05]">
            Your daily source for <span className="scada-gradient-text">SCADA, PLC, DCS</span> & industrial automation news.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Curated headlines, OT cybersecurity alerts, and IIoT trends — aggregated from the industry's most trusted publications.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl scada-gradient text-primary-foreground font-semibold scada-shadow hover:opacity-90 transition-opacity"
            >
              Browse all news <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card font-semibold hover:border-accent hover:text-accent transition-colors"
            >
              Ask SCADA Daily AI
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            {[
              { Icon: Cpu, label: "PLC & DCS" },
              { Icon: ShieldCheck, label: "OT Security" },
              { Icon: Network, label: "Industrial Networks" },
              { Icon: Sparkles, label: "IIoT & 4.0" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card/60">
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      {trending?.topics?.length ? (
        <section className="border-b border-border bg-card/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 overflow-x-auto">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold shrink-0">Trending</span>
            {trending.topics.map((t) => (
              <Link
                key={t}
                to="/news"
                search={{ q: t } as never}
                className="shrink-0 text-sm px-3 py-1 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
              >
                #{t}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Latest News */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Latest News</h2>
            <p className="text-muted-foreground text-sm mt-1">Fresh headlines from across the automation world.</p>
          </div>
          <Link to="/news" className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            No news available right now. Please check back shortly.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured && <NewsCard item={featured} featured />}
            {rest.slice(0, 11).map((it) => <NewsCard key={it.id} item={it} />)}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold">Explore by category</h2>
        <p className="text-muted-foreground text-sm mt-1 mb-6">Drill into the topic that matters to your plant.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-accent hover:scada-shadow transition-all"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold group-hover:text-accent transition-colors">{c.name}</h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        <NewsletterSignup />
      </section>

      <SiteFooter />
    </div>
  );
}
