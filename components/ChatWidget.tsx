"use client";

import { useRef, useState } from "react";
import WakingIndicator from "@/components/WakingIndicator";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 30; // ~90s, cf. docs/architecture.md

type Phase = "idle" | "sending" | "waking" | "error";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [wakingElapsed, setWakingElapsed] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Incrémenté à chaque nouvel envoi : si l'utilisateur relance un message
  // pendant qu'on attend le réveil du précédent, ce garde-fou arrête la
  // boucle de polling obsolète au lieu de laisser deux boucles tourner.
  const requestIdRef = useRef(0);

  async function callChatApi(payloadMessages: ChatMessage[]) {
    return fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: payloadMessages }),
    });
  }

  async function pollUntilAwake(payloadMessages: ChatMessage[], requestId: number) {
    for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt++) {
      if (requestId !== requestIdRef.current) return; // une requête plus récente a pris le relais

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      if (requestId !== requestIdRef.current) return;

      setWakingElapsed(attempt * (POLL_INTERVAL_MS / 1000));

      const response = await callChatApi(payloadMessages);
      if (requestId !== requestIdRef.current) return;

      if (response.status === 503) continue; // toujours en train de se réveiller

      if (response.status === 429) {
        setPhase("error");
        setErrorMessage("Trop de tentatives, réessaie dans un instant.");
        return;
      }

      if (!response.ok) {
        setPhase("error");
        setErrorMessage("AlicIA-lite n'a pas pu répondre.");
        return;
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setPhase("idle");
      return;
    }

    setPhase("error");
    setErrorMessage("La machine n'a pas répondu à temps — réessaie plus tard.");
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || phase === "sending" || phase === "waking") return;

    const requestId = ++requestIdRef.current;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setPhase("sending");
    setErrorMessage("");

    try {
      const response = await callChatApi(nextMessages);
      if (requestId !== requestIdRef.current) return;

      if (response.status === 503) {
        setPhase("waking");
        setWakingElapsed(0);
        await pollUntilAwake(nextMessages, requestId);
        return;
      }

      if (response.status === 429) {
        setPhase("error");
        setErrorMessage("Trop de requêtes, réessaie dans un instant.");
        return;
      }

      if (!response.ok) {
        setPhase("error");
        setErrorMessage("AlicIA-lite n'a pas pu répondre.");
        return;
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setPhase("idle");
    } catch {
      if (requestId !== requestIdRef.current) return;
      setPhase("error");
      setErrorMessage("Impossible de contacter le serveur.");
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col rounded-lg border border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-mono text-sm font-semibold text-brand">AlicIA-lite</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le chat"
              className="text-foreground/60 hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-sm text-foreground/60">
                Bonjour, je suis une version limitée d&apos;AlicIA — je peux parler du profil
                et des projets de Vincent, sans accès à aucun outil réel.
              </p>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-lg bg-brand px-3 py-2 text-sm text-white"
                    : "mr-auto max-w-[85%] rounded-lg border border-border px-3 py-2 text-sm"
                }
              >
                {message.content}
              </div>
            ))}
            {phase === "waking" && <WakingIndicator elapsedSeconds={wakingElapsed} />}
            {phase === "error" && (
              <p className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-foreground/70">
                {errorMessage}
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écris un message..."
              disabled={phase === "sending" || phase === "waking"}
              className="flex-1 rounded-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={phase === "sending" || phase === "waking" || !input.trim()}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-lg transition-transform hover:scale-105"
        aria-label={open ? "Fermer AlicIA-lite" : "Ouvrir AlicIA-lite"}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
