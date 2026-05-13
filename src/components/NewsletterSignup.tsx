import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  };

  if (done) {
    return (
      <div className={`flex items-center gap-3 ${compact ? "" : "rounded-2xl border border-border bg-card p-6 scada-shadow"}`}>
        <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
        <div>
          <div className="font-semibold">You're subscribed!</div>
          <div className="text-sm text-muted-foreground">Check your inbox for the next SCADA Daily roundup.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "" : "rounded-3xl scada-gradient p-8 sm:p-10 text-primary-foreground scada-shadow"}>
      {!compact && (
        <>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider opacity-90">
            <Mail className="w-3.5 h-3.5" /> Newsletter
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 max-w-xl">
            The week in industrial automation, in your inbox.
          </h2>
          <p className="mt-2 opacity-90 max-w-xl">
            Curated SCADA, PLC, DCS, and OT cybersecurity stories every Monday. Free, no spam.
          </p>
        </>
      )}
      <form onSubmit={submit} className={`mt-${compact ? "0" : "5"} flex flex-col sm:flex-row gap-2 max-w-md`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 h-11 rounded-xl px-4 text-sm bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className={`h-11 px-5 rounded-xl font-semibold text-sm ${
            compact ? "scada-gradient text-primary-foreground" : "bg-foreground text-background hover:bg-foreground/90"
          } transition-colors`}
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
