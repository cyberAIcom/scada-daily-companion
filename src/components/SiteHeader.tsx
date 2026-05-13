import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, MessageCircle } from "lucide-react";
import logo from "@/assets/scada-logo.png";
import { CATEGORIES } from "@/lib/categories";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/news", label: "All News" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/submit", label: "Submit" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/85 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden scada-shadow">
              <img src={logo} alt="SCADA Daily" width={40} height={40} className="w-8 h-8" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold leading-none scada-gradient-text">SCADA Daily</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">SCADA · PLC · DCS · OT</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "text-primary font-semibold bg-secondary" }}
                activeOptions={{ exact: true }}
                className="px-3 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-secondary transition-colors"
              >
                {n.label}
              </Link>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="px-3 py-2 rounded-lg text-foreground/80 hover:text-primary hover:bg-secondary transition-colors">
                Categories
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-border bg-card scada-shadow p-2 grid grid-cols-1 gap-0.5">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      className="px-3 py-2 rounded-lg text-sm hover:bg-secondary hover:text-primary transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/news"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
              aria-label="Search news"
            >
              <Search className="w-4 h-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg scada-gradient text-primary-foreground text-sm font-medium scada-shadow hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-secondary"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-primary font-semibold bg-secondary" }}
                activeOptions={{ exact: true }}
                className="block px-3 py-2 rounded-lg text-sm hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-border">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-3 mb-1">Categories</div>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-secondary"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
