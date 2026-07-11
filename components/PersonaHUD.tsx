"use client";

import { useEffect, useRef, useState } from "react";

export type PersonaKey = "gabrielle" | "raphael" | "mickael";
export type PersonaEtat = "idle" | "pense" | "parle" | "alerte";

interface Palette {
  main: string;
  dim: string;
  alert: string;
  eyeBorder: string;
}

// Port fidèle du HUD interactif fourni par Vincent (Claude Design,
// "HUD Agent.dc.html") : mêmes couleurs, mêmes animations par état, même
// logique de poursuite de la souris par la pupille. cf. docs/decisions.md.
const PALETTES: Record<PersonaKey, Palette> = {
  mickael: { main: "#B5202E", dim: "#7A4A50", alert: "#FF3B30", eyeBorder: "#C9CCD1" },
  gabrielle: { main: "#D9A441", dim: "#8A7345", alert: "#FFC24D", eyeBorder: "#D9A441" },
  raphael: { main: "#2E8B74", dim: "#3D5F55", alert: "#3FD9B0", eyeBorder: "#2E8B74" },
};

interface AnimSet {
  aura: string;
  ring: string;
  pupilColor: string;
}

function animsForEtat(etat: PersonaEtat, c: Palette): AnimSet {
  switch (etat) {
    case "pense":
      return { aura: "persona-flash 3.2s ease-in-out infinite", ring: "persona-spin-slow 14s linear infinite", pupilColor: c.dim };
    case "parle":
      return { aura: "persona-pulse-fast 0.9s ease-in-out infinite", ring: "none", pupilColor: c.main };
    case "alerte":
      return { aura: "persona-flash 0.5s ease-in-out infinite", ring: "persona-spin-rev 3s linear infinite", pupilColor: c.alert };
    default:
      return { aura: "persona-breath 5s ease-in-out infinite", ring: "none", pupilColor: c.main };
  }
}

interface PersonaHUDProps {
  persona: PersonaKey;
  etat?: PersonaEtat;
  followMouse?: boolean;
  showLabel?: boolean;
  size?: number;
}

export default function PersonaHUD({
  persona,
  etat = "idle",
  followMouse = true,
  showLabel = false,
  size = 64,
}: PersonaHUDProps) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!followMouse) return;
    let raf: number | null = null;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = eyeRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const maxOffset = 6 * (size / 112);
        const k = Math.min(maxOffset, (d / 30) * (size / 112));
        setPupil({ x: (dx / d) * k, y: (dy / d) * k });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [followMouse, size]);

  const c = PALETTES[persona];
  const anims = animsForEtat(etat, c);
  const eyeSize = size * (34 / 112);
  const pupilSize = size * (10 / 112);
  const ringInset = size * (8 / 112);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <div
        ref={eyeRef}
        style={{
          width: size,
          height: size,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c.main}5c 0%, ${c.main}00 70%)`,
            animation: anims.aura,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: ringInset,
            borderRadius: "50%",
            border: `2px dashed ${c.main}`,
            opacity: 0.8,
            animation: anims.ring,
          }}
        />
        <div
          style={{
            width: eyeSize,
            height: eyeSize,
            borderRadius: "50%",
            border: `2px solid ${c.eyeBorder}`,
            background: "#12100E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: pupilSize,
              height: pupilSize,
              borderRadius: "50%",
              background: anims.pupilColor,
              transform: `translate(${pupil.x.toFixed(1)}px, ${pupil.y.toFixed(1)}px)`,
              transition: "transform .12s ease-out, background .3s",
            }}
          />
        </div>
      </div>
      {showLabel && (
        <div className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-foreground/50">
          {persona} · {etat}
        </div>
      )}
    </div>
  );
}
