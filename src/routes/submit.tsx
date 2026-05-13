import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/submit")({
  component: Submit,
  head: () => ({
    meta: [
      { title: "Submit a News Tip — SCADA Daily" },
      { name: "description", content: "Have an industrial automation story or tip? Submit it to SCADA Daily — we review every submission." },
      { property: "og:title", content: "Submit a News Tip" },
      { property: "og:description", content: "Share your SCADA, PLC, DCS, or OT cybersecurity story with us." },
      { property: "og:url", content: "/submit" },
    ],
    links: [{ rel: "canonical", href: "/submit" }],
  }),
});

function Submit() {
  const [done, setDone] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="text-xs uppercase tracking-wider text-accent font-semibold">Submit</div>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">Share your story.</h1>
        <p className="text-muted-foreground mt-2">
          New product launch? Vulnerability disclosure? Plant case study? Send it our way and we'll review it for SCADA Daily.
        </p>

        {done ? (
          <div className="mt-8 rounded-2xl border border-accent/40 bg-accent/5 p-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-accent" />
            <div>
              <div className="font-semibold">Submission received</div>
              <div className="text-sm text-muted-foreground">Our editors will review it shortly.</div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="mt-8 rounded-2xl border border-border bg-card p-6 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Your name"><input required className="field" /></Field>
              <Field label="Email"><input required type="email" className="field" /></Field>
            </div>
            <Field label="Story title"><input required className="field" placeholder="e.g. New PLC firmware addresses CVE-2026-XXXX" /></Field>
            <Field label="Source URL (optional)"><input type="url" className="field" placeholder="https://" /></Field>
            <Field label="Category">
              <select className="field">
                <option>SCADA</option>
                <option>PLC</option>
                <option>DCS</option>
                <option>OT Cybersecurity</option>
                <option>IIoT & Industry 4.0</option>
                <option>HMI / SCADA Graphics</option>
                <option>Industrial Networks</option>
                <option>Automation & Robotics</option>
                <option>Standards & Regulations</option>
                <option>Case Studies</option>
              </select>
            </Field>
            <Field label="Details">
              <textarea required rows={7} className="field resize-none" placeholder="Tell us why this story matters…" />
            </Field>
            <button type="submit" className="inline-flex items-center gap-2 h-11 px-5 rounded-xl scada-gradient text-primary-foreground font-semibold scada-shadow hover:opacity-90 transition-opacity">
              <Send className="w-4 h-4" /> Submit tip
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
      <style>{`.field{width:100%;height:42px;padding:0 14px;border-radius:10px;border:1px solid var(--border);background:var(--background);font-size:14px;outline:none}
      .field:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in oklab,var(--accent) 20%,transparent)}
      textarea.field,select.field{height:auto;padding:10px 14px}`}</style>
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
