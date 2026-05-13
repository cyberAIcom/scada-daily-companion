import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { NewsCard, NewsCardSkeleton } from "@/components/NewsCard";
import { fetchNews } from "@/lib/news.functions";
import { CATEGORIES, getCategory } from "@/lib/categories";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  beforeLoad: ({ params }) => {
    if (!getCategory(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const c = getCategory(params.slug);
    const name = c?.name ?? "Category";
    return {
      meta: [
        { title: `${name} News — SCADA Daily` },
        { name: "description", content: c?.description ?? "Industrial automation news category." },
        { property: "og:title", content: `${name} News — SCADA Daily` },
        { property: "og:description", content: c?.description ?? "Industrial automation news category." },
        { property: "og:url", content: `/category/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = getCategory(slug)!;
  const getNews = useServerFn(fetchNews);
  const { data, isLoading } = useQuery({
    queryKey: ["news", "cat", slug],
    queryFn: () => getNews({ data: { category: slug, limit: 60 } }),
  });
  const items = data?.items ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <div className="rounded-3xl scada-gradient p-8 sm:p-10 text-primary-foreground scada-shadow">
          <div className="text-xs uppercase tracking-wider opacity-90">Category</div>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1">{cat.name}</h1>
          <p className="opacity-90 mt-2 max-w-2xl">{cat.description}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== slug).map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-accent hover:text-accent transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
            : items.map((it) => <NewsCard key={it.id} item={it} />)}
        </div>

        {!isLoading && items.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground mt-6">
            No recent news in this category yet. Check back soon.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
