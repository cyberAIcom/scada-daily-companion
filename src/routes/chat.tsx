import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChatInterface } from "@/components/ChatInterface";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "SCADA Daily AI — Industrial Automation Assistant" },
      { name: "description", content: "Chat with SCADA Daily AI for instant answers on SCADA, PLC, DCS, IIoT, and OT cybersecurity." },
      { property: "og:title", content: "SCADA Daily AI" },
      { property: "og:description", content: "Your AI assistant for industrial automation." },
      { property: "og:url", content: "/chat" },
    ],
    links: [{ rel: "canonical", href: "/chat" }],
  }),
});

function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
            <h1 className="text-xl font-bold scada-gradient-text">SCADA Daily AI</h1>
            <p className="text-sm text-muted-foreground">Ask anything about SCADA, PLC, DCS, IIoT, or OT cybersecurity.</p>
          </div>
        </div>
        <ChatInterface />
      </main>
      <SiteFooter />
    </div>
  );
}
