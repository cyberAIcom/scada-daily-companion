import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — SCADA Daily" },
      { name: "description", content: "Get in touch with the SCADA Daily team for partnerships, advertising, or feedback." },
      { property: "og:title", content: "Contact SCADA Daily" },
      { property: "og:description", content: "Send us a message — we read every email." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function Contact() {
  const [done, setDone] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="text-xs uppercase tracking-wider text-accent font-semibold">Contact</div>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">Let's talk.</h1>
        <p className="text-muted-foreground mt-2">
          Partnerships, advertising, content suggestions, corrections — we read everything.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          <a href="mailto:hello@scadadaily.com" className="rounded-2xl border border-border bg-card p-5 hover:border-accent transition-colors flex items-center gap-3">
            <Mail className="w-5 h-5 text-accent" />
            <div>
              <div className="font-semibold">Email</div>
              <div className="text-sm text-muted-foreground">hello@scadadaily.com</div>
            </div>
          </a>
          <a href="/chat" className="rounded-2xl border border-border bg-card p-5 hover:border-accent transition-colors flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-accent" />
            <div>
              <div className="font-semibold">Chat with AI</div>
              <div className="text-sm text-muted-foreground">Quick answers, 24/7</div>
            </div>
          </a>
        </div>

        {done ? (
          <div className="mt-8 rounded-2xl border border-accent/40 bg-accent/5 p-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-accent" />
            <div>
              <div className="font-semibold">Message sent</div>
              <div className="text-sm text-muted-foreground">We'll get back to you within 1–2 business days.</div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="mt-8 rounded-2xl border border-border bg-card p-6 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name"><input required className="field" placeholder="Jane Engineer" /></Field>
              <Field label="Email"><input required type="email" className="field" placeholder="you@company.com" /></Field>
            </div>
            <Field label="Subject"><input required className="field" placeholder="How can we help?" /></Field>
            <Field label="Message">
              <textarea required rows={6} className="field resize-none" placeholder="Tell us a bit more…" />
            </Field>
            <button type="submit" className="h-11 px-5 rounded-xl scada-gradient text-primary-foreground font-semibold scada-shadow hover:opacity-90 transition-opacity">
              Send message
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
      <style>{`.field{width:100%;height:42px;padding:0 14px;border-radius:10px;border:1px solid var(--border);background:var(--background);font-size:14px;outline:none}
      .field:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in oklab,var(--accent) 20%,transparent)}
      textarea.field{height:auto;padding:12px 14px}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
