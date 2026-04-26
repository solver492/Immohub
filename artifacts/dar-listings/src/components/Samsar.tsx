import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Je cherche un appartement à louer à Casablanca",
  "Je veux acheter une villa à Marrakech",
  "Je suis une agence, présentez-moi vos services",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Bonjour 👋 Je suis Samsar, votre agent immobilier Immo-hub. Cherchez-vous un bien à acheter ou louer, ou représentez-vous une agence ? Dites-m'en plus et je vous oriente.",
};

export function Samsar() {
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasError, setHasError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-greet after a delay (once per session)
  useEffect(() => {
    const dismissed = sessionStorage.getItem("samsar-dismissed");
    if (dismissed) return;
    const t = setTimeout(() => {
      setAuto(true);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const dismissAuto = () => {
    setAuto(false);
    sessionStorage.setItem("samsar-dismissed", "1");
  };

  const openChat = () => {
    setOpen(true);
    dismissAuto();
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setSending(true);
    setHasError(false);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { reply?: string; error?: string };
      const reply = data.reply ?? data.error ?? "Désolé, je n'ai pas pu répondre.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setHasError(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Je rencontre un souci de connexion. Réessayez dans un instant ou appelez-nous au +212 5 22 00 00 00.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Auto-greeting bubble */}
      {auto && !open && (
        <div
          className="fixed bottom-24 right-4 md:right-6 z-50 max-w-[280px] bg-card shadow-2xl rounded-2xl p-4 border border-border animate-in slide-in-from-bottom-4 fade-in"
          data-testid="samsar-greeting"
        >
          <button
            onClick={dismissAuto}
            className="absolute -top-2 -right-2 bg-background border rounded-full p-1 shadow hover:bg-muted"
            aria-label="Fermer"
          >
            <X size={14} />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-bold text-sm text-primary">Samsar</p>
              <p className="text-sm text-foreground/80 mt-1">
                Bonjour ! Besoin d'aide pour trouver un bien ou découvrir nos services agence ?
              </p>
              <Button size="sm" className="mt-3 w-full" onClick={openChat}>
                Discuter avec moi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating action button */}
      <button
        onClick={() => (open ? setOpen(false) : openChat())}
        className={cn(
          "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full bg-secondary text-secondary-foreground shadow-2xl flex items-center justify-center hover:scale-105 transition-transform",
          open && "rotate-90",
        )}
        aria-label={open ? "Fermer Samsar" : "Ouvrir Samsar"}
        data-testid="samsar-toggle"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-[400px] h-[min(600px,80vh)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in"
          data-testid="samsar-panel"
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif font-bold leading-tight">Samsar</p>
              <p className="text-xs text-primary-foreground/70">
                Agent immobilier Immo-hub · {sending ? "écrit…" : "en ligne"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-line leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-secondary text-secondary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md",
                )}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="bg-muted rounded-2xl rounded-bl-md px-3.5 py-2 text-sm w-fit">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          {messages.length <= 1 && !sending && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border bg-background hover:bg-muted transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-3 flex gap-2 bg-card"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message…"
              className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
              disabled={sending}
              data-testid="samsar-input"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full shrink-0"
              disabled={sending || !input.trim()}
              data-testid="samsar-send"
            >
              <Send size={16} />
            </Button>
          </form>
          {hasError && (
            <p className="px-4 pb-2 text-xs text-destructive">
              Connexion difficile — vos prochains messages réessaieront automatiquement.
            </p>
          )}
        </div>
      )}
    </>
  );
}
