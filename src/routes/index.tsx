import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Twitter, Instagram, Youtube, Facebook } from "lucide-react";
import logo from "@/assets/scada-logo.png";
import { ChatInterface } from "@/components/ChatInterface";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SCADA Daily AI — SCADA, PLC, DCS & OT News Assistant" },
      {
        name: "description",
        content:
          "Chat with SCADA Daily AI for the latest news on SCADA, PLC, DCS, HMI, IIoT, and OT cybersecurity — updated May 2026.",
      },
      { property: "og:title", content: "SCADA Daily AI" },
      {
        property: "og:description",
        content: "Your AI assistant for SCADA, PLC, DCS, and industrial automation news.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "icon", type: "image/png", href: logo },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-secondary/30">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden scada-shadow">
              <img src={logo} alt="SCADA Daily" width={40} height={40} className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none scada-gradient-text">SCADA Daily AI</h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">SCADA Daily News · May 2026</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-3 text-muted-foreground">
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-accent transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="https://twitter.com" aria-label="X" className="hover:text-accent transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-accent transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="https://youtube.com" aria-label="YouTube" className="hover:text-accent transition-colors"><Youtube className="w-4 h-4" /></a>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-accent transition-colors"><Facebook className="w-4 h-4" /></a>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex">
        <ChatInterface />
      </main>
    </div>
  );
}
