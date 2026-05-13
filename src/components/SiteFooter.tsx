import { Link } from "@tanstack/react-router";
import { Linkedin, Twitter, Instagram, Youtube, Facebook } from "lucide-react";
import logo from "@/assets/scada-logo.png";
import { CATEGORIES } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden scada-shadow">
              <img src={logo} alt="SCADA Daily" width={40} height={40} className="w-8 h-8" />
            </div>
            <div>
              <div className="font-bold scada-gradient-text">SCADA Daily</div>
              <div className="text-[11px] text-muted-foreground">Your daily source for industrial automation news</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 max-w-md">
            SCADA Daily aggregates and curates the latest news on SCADA, PLC, DCS, HMI, IIoT, and OT cybersecurity from
            trusted industry sources — updated continuously.
          </p>
          <div className="flex items-center gap-2 mt-4">
            {[
              { Icon: Linkedin, href: "https://linkedin.com" },
              { Icon: Twitter, href: "https://twitter.com" },
              { Icon: Instagram, href: "https://instagram.com" },
              { Icon: Youtube, href: "https://youtube.com" },
              { Icon: Facebook, href: "https://facebook.com" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                aria-label="social"
                className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold mb-3">Categories</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="hover:text-primary transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold mb-3">Site</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/news" className="hover:text-primary transition-colors">All News</Link></li>
            <li><Link to="/chat" className="hover:text-primary transition-colors">SCADA Daily AI</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link to="/submit" className="hover:text-primary transition-colors">Submit News</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} SCADA Daily. All trademarks belong to their respective owners.</span>
          <span>News sourced from public RSS feeds — credit to original publishers.</span>
        </div>
      </div>
    </footer>
  );
}
