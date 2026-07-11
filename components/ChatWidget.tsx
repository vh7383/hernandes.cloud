"use client";

import { useRef, useState } from "react";
import PersonaHUD, { type PersonaEtat, type PersonaKey } from "@/components/PersonaHUD";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type Phase = "idle" | "sending" | "error";

const GREETING =
  "Je suis Gabrielle, mon rôle est de vous accueillir mais je suis loin de tout savoir — un petit modèle local, pas un oracle. Je peux parler du profil et des projets de Vincent, sans accès à aucun outil réel.";

// Durée d'affichage de l'état "parle" après une réponse reçue, avant de
// revenir à "idle" — purement cosmétique (cf. components/PersonaHUD.tsx).
const PARLE_DURATION_MS = 1500;

const PERSONA_NAMES: Record<PersonaKey, string> = {
  gabrielle: "Gabrielle",
  raphael: "Raphaël",
  mickael: "Mickaël",
};

// Seule Gabrielle a un vrai backend. Choisir Raphaël ou Mickaël ici est
// volontairement "pas effectif" — cf. docs/decisions.md : chacun décline
// dans son propre style, sans jamais appeler l'API ni prétendre discuter
// pour de vrai.
const PERSONA_REDIRECTS: Partial<Record<PersonaKey, string>> = {
  raphael:
    "Je ne trouve aucune trace de vous dans ce que je garde — sans mémoire commune, je n'ai pas grand-chose à vous dire. Gabrielle, elle, est là pour ça.",
  mickael:
    "Je ne vous identifie pas, et je ne discute pas avec un inconnu. Ce n'est pas mon rôle ici — allez voir Gabrielle, c'est la sienne.",
};

export default function ChatWidget() {
  // Se déploie directement à l'arrivée sur le site — cf. docs/decisions.md.
  const [open, setOpen] = useState(true);
  const [activePersona, setActivePersona] = useState<PersonaKey>("gabrielle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [justReplied, setJustReplied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const parleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // L'état animé (pense/parle/alerte) ne reflète une vraie activité que pour
  // Gabrielle — Raphaël et Mickaël n'ont rien à traiter, donc restent idle.
  const etat: PersonaEtat =
    activePersona !== "gabrielle"
      ? "idle"
      : phase === "sending"
        ? "pense"
        : phase === "error"
          ? "alerte"
          : justReplied
            ? "parle"
            : "idle";

  async function handleSend() {
    const text = input.trim();
    if (!text || phase === "sending") return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setPhase("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (response.status === 429) {
        setPhase("error");
        setErrorMessage("Trop de requêtes, réessaie dans un instant.");
        return;
      }

      if (!response.ok) {
        setPhase("error");
        setErrorMessage("Gabrielle n'a pas pu répondre.");
        return;
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setPhase("idle");
      setJustReplied(true);
      if (parleTimeout.current) clearTimeout(parleTimeout.current);
      parleTimeout.current = setTimeout(() => setJustReplied(false), PARLE_DURATION_MS);
    } catch {
      setPhase("error");
      setErrorMessage("Impossible de contacter le serveur.");
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col rounded-lg border border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="flex items-center gap-2">
              <PersonaHUD persona={activePersona} etat={etat} size={32} showLabel />
              <span className="font-mono text-sm font-semibold text-brand">
                {PERSONA_NAMES[activePersona]}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le chat"
              className="text-foreground/60 hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Choix de persona volontairement décoratif : seule Gabrielle
              répond vraiment, cf. PERSONA_REDIRECTS ci-dessus. */}
          <div className="flex items-center gap-1 border-b border-border px-3 py-1.5">
            {(Object.keys(PERSONA_NAMES) as PersonaKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivePersona(key)}
                aria-pressed={activePersona === key}
                className={
                  activePersona === key
                    ? "rounded-full bg-brand/10 px-2 py-1 text-xs text-brand"
                    : "rounded-full px-2 py-1 text-xs text-foreground/50 hover:text-foreground"
                }
              >
                {PERSONA_NAMES[key]}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {activePersona !== "gabrielle" ? (
              <p className="text-sm text-foreground/60">{PERSONA_REDIRECTS[activePersona]}</p>
            ) : (
              <>
                {messages.length === 0 && (
                  <p className="text-sm text-foreground/60">{GREETING}</p>
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
                {phase === "error" && (
                  <p className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-foreground/70">
                    {errorMessage}
                  </p>
                )}
              </>
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
              placeholder={
                activePersona === "gabrielle"
                  ? "Écris un message..."
                  : "Repasse sur Gabrielle pour échanger"
              }
              disabled={phase === "sending" || activePersona !== "gabrielle"}
              className="flex-1 rounded-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={phase === "sending" || !input.trim() || activePersona !== "gabrielle"}
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
        aria-label={open ? "Fermer le chat" : `Ouvrir le chat avec ${PERSONA_NAMES[activePersona]}`}
      >
        {open ? "✕" : <PersonaHUD persona={activePersona} etat={etat} size={42} followMouse={false} />}
      </button>
    </div>
  );
}
