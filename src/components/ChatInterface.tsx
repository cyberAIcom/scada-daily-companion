import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Loader2, Sparkles, Cpu } from "lucide-react";
import { sendChat, type ChatMessage } from "@/lib/chat.functions";
import logo from "@/assets/scada-logo.png";

const SUGGESTIONS = [
  "Latest SCADA cybersecurity news",
  "Difference between PLC and DCS",
  "Top IIoT trends in 2026",
  "OT network segmentation best practices",
];

export function ChatInterface() {
  const callChat = useServerFn(sendChat);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm **SCADA Daily AI**, your dedicated assistant for SCADA, PLC, DCS, and OT cybersecurity news. Ask me anything about industrial automation — or pick a topic below to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await callChat({ data: { messages: next } });
      setMessages((m) => [...m, { role: "assistant", content: res.content }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] max-w-4xl mx-auto w-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <Avatar />
            <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <span className="text-sm">SCADA Daily AI is thinking…</span>
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {messages.length === 1 && !loading && (
          <div className="grid sm:grid-cols-2 gap-2 pt-4">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="text-left text-sm rounded-xl border border-border bg-card hover:border-accent hover:bg-accent/5 transition-colors px-4 py-3 group"
              >
                <Sparkles className="inline w-3.5 h-3.5 mr-2 text-accent group-hover:scale-110 transition-transform" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="flex items-end gap-2 max-w-3xl mx-auto"
        >
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask about SCADA, PLC, DCS, OT cybersecurity…"
              rows={1}
              className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent max-h-40"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-12 w-12 flex items-center justify-center rounded-2xl scada-gradient text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed scada-shadow hover:scale-105 active:scale-95 transition-transform"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          SCADA Daily AI · Industrial automation insights · Updated May 2026
        </p>
      </div>
    </div>
  );

  function Avatar() {
    return (
      <div className="w-9 h-9 rounded-xl scada-gradient flex items-center justify-center shrink-0 scada-shadow">
        <Cpu className="w-5 h-5 text-primary-foreground" />
      </div>
    );
  }

  function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === "user";
    return (
      <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
        {isUser ? (
          <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0 text-secondary-foreground text-sm font-semibold">
            You
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center shrink-0 overflow-hidden scada-shadow">
            <img src={logo} alt="SCADA Daily AI" width={36} height={36} className="w-7 h-7" />
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed ${
            isUser
              ? "scada-gradient text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border rounded-tl-sm prose-chat"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    );
  }
}
