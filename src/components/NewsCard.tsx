import { Link } from "@tanstack/react-router";
import { ExternalLink, Clock } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { NewsItem } from "@/lib/news.functions";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function categoryName(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  return (
    <article
      className={`group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/60 hover:scada-shadow transition-all ${
        featured ? "md:col-span-2 md:flex-row" : ""
      }`}
    >
      {item.image && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`block overflow-hidden bg-secondary ${featured ? "md:w-1/2 aspect-video md:aspect-auto" : "aspect-video"}`}
        >
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => ((e.currentTarget.style.display = "none"))}
          />
        </a>
      )}
      <div className={`flex flex-col gap-3 p-5 flex-1 ${featured ? "md:p-7" : ""}`}>
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          {item.categories.slice(0, 2).map((c) => (
            <Link
              key={c}
              to="/category/$slug"
              params={{ slug: c }}
              className="px-2 py-0.5 rounded-md bg-accent/10 text-accent font-semibold uppercase tracking-wider hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {categoryName(c)}
            </Link>
          ))}
          <span className="text-muted-foreground inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> {timeAgo(item.publishedAt)}
          </span>
        </div>

        <a href={item.link} target="_blank" rel="noopener noreferrer">
          <h3 className={`font-bold leading-snug text-foreground group-hover:text-primary transition-colors ${featured ? "text-2xl" : "text-base"}`}>
            {item.title}
          </h3>
        </a>

        {item.summary && (
          <p className={`text-muted-foreground ${featured ? "text-sm line-clamp-4" : "text-sm line-clamp-3"}`}>
            {item.summary}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 text-xs">
          <span className="text-muted-foreground">via <span className="text-primary font-medium">{item.source}</span></span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline font-medium"
          >
            Read <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="aspect-video bg-secondary animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-secondary animate-pulse rounded" />
        <div className="h-4 w-full bg-secondary animate-pulse rounded" />
        <div className="h-4 w-4/5 bg-secondary animate-pulse rounded" />
      </div>
    </div>
  );
}
