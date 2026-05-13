import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Network, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — SCADA Daily" },
      { name: "description", content: "SCADA Daily aggregates SCADA, PLC, DCS, IIoT, and OT cybersecurity news from trusted sources, free for the global automation community." },
      { property: "og:title", content: "About SCADA Daily" },
      { property: "og:description", content: "Why we built SCADA Daily and how we curate the news." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="text-xs uppercase tracking-wider text-accent font-semibold">About</div>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">
          The home of <span className="scada-gradient-text">industrial automation</span> news.
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          SCADA Daily is an independent news aggregator built for engineers, technicians, integrators, plant managers, and OT
          cybersecurity professionals. We monitor the industry's most trusted publications and surface what matters — every day.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {[
            { Icon: Cpu, title: "Vendor-neutral", body: "We cover Siemens, Rockwell, Schneider, Honeywell, Emerson, ABB, GE — and everyone else." },
            { Icon: ShieldCheck, title: "OT-first security", body: "Dedicated OT cybersecurity coverage, including ICS-CERT advisories and IEC 62443 updates." },
            { Icon: Network, title: "Built on open RSS", body: "We use only free, open RSS feeds and credit every original publisher." },
            { Icon: Sparkles, title: "AI-assisted curation", body: "SCADA Daily AI helps categorize and summarize articles so you find the right news fast." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5">
              <div className="w-10 h-10 rounded-xl scada-gradient flex items-center justify-center text-primary-foreground scada-shadow">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold mt-3">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{body}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-14">How we aggregate</h2>
        <p className="text-muted-foreground mt-2">
          We pull articles from public RSS feeds (Automation.com, Control Engineering, ControlGlobal, ISA, Industrial Cyber, Plant
          Engineering, and more), normalize them, auto-categorize using a keyword-based classifier, and link directly to the original
          publisher. We never republish full articles — we always send readers to the source.
        </p>

        <div className="mt-12">
          <NewsletterSignup />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
