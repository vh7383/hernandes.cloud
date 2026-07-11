"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  // Joue une animation d'arrivée ponctuelle au montage (vol depuis un bord
  // d'écran → burst → sigil → pupille) — spec chorégraphiée par Fable,
  // cf. docs/decisions.md. Ne rejoue pas tant que le composant ne remonte
  // pas : le parent doit lui donner une `key` stable par identité (ex.
  // key={persona}) pour la redéclencher au changement de persona.
  arrive?: boolean;
}

const VOL_SRC: Record<PersonaKey, string> = {
  gabrielle: "/images/personae/assets/silhouette-gabrielle-vol.svg",
  raphael: "/images/personae/assets/silhouette-raphael-vol.svg",
  mickael: "/images/personae/assets/silhouette-mickael-vol.svg",
};

// Portrait statique (assets fournis, ratio natif 4:3) — réutilisé à côté
// du nom dans la modale personae et dans l'en-tête du chat.
export const PERSONA_BUSTE_SRC: Record<PersonaKey, string> = {
  gabrielle: "/images/personae/assets/silhouette-gabrielle-buste.svg",
  raphael: "/images/personae/assets/silhouette-raphael-buste.svg",
  mickael: "/images/personae/assets/silhouette-mickael-buste.svg",
};

export default function PersonaHUD({
  persona,
  etat = "idle",
  followMouse = true,
  showLabel = false,
  size = 64,
  arrive = false,
}: PersonaHUDProps) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLImageElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const sigilRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  // Le vol est rendu via portail dans <body> (cf. JSX plus bas) pour
  // échapper à l'overflow-hidden de la modale personae — sinon la
  // silhouette est visuellement coupée dès qu'elle sort de la carte,
  // au lieu de vraiment partir du bord de l'écran. `flightBox` porte sa
  // position cible (calquée sur le HUD), mesurée avant peinture.
  const [flightBox, setFlightBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    if (!arrive) return;
    const el = eyeRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = size * 1.1;
    const height = size * 0.825;
    setFlightBox({
      left: r.left + r.width / 2 - width / 2,
      top: r.top + r.height / 2 - height / 2,
      width,
      height,
    });
    // Ne mesure qu'au montage — cf. commentaire du prop `arrive`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!arrive || !flightBox) return;

    // Phase 0 — vol : départ d'un bord d'écran aléatoire, trajectoire
    // courbe (wobble perpendiculaire), flip selon la direction, fusion
    // dans le sigil. Le burst/sigil/pupille sont décalés d'autant pour
    // démarrer pile à la fusion.
    let delay = 0;
    const flightEl = flightRef.current;
    if (flightEl) {
      const cx = flightBox.left + flightBox.width / 2;
      const cy = flightBox.top + flightBox.height / 2;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const M = 180;
      const edge = Math.floor(Math.random() * 4);
      let px: number, py: number;
      if (edge === 0) { px = Math.random() * W; py = -M; }
      else if (edge === 1) { px = Math.random() * W; py = H + M; }
      else if (edge === 2) { px = -M; py = Math.random() * H; }
      else { px = W + M; py = Math.random() * H; }
      const sx = px - cx;
      const sy = py - cy;
      const ang = Math.atan2(sy, sx);
      const wob = (Math.random() - 0.5) * 420;
      const mx = sx * 0.45 - Math.sin(ang) * wob;
      const my = sy * 0.45 + Math.cos(ang) * wob;
      const flip = sx > 0 ? -1 : 1;
      const tilt = (Math.random() - 0.5) * 30;
      const dur = 1250;
      flightEl.animate(
        [
          { transform: `translate(${sx}px,${sy}px) rotate(${tilt}deg) scale(${flip * 1.15}, 1.15)`, opacity: 0 },
          { opacity: 1, offset: 0.18 },
          { transform: `translate(${mx}px,${my}px) rotate(${tilt * 0.4}deg) scale(${flip * 0.85}, 0.85)`, opacity: 1, offset: 0.55 },
          { transform: `translate(0px, 0px) rotate(0deg) scale(${flip * 0.12}, .12)`, opacity: 0.9, offset: 0.96 },
          { transform: `translate(0px, 0px) scale(${flip * 0.08}, .08)`, opacity: 0 },
        ],
        { duration: dur, easing: "cubic-bezier(.3,.1,.25,1)" },
      );
      delay = dur - 120;
    }

    burstRef.current?.animate(
      [
        { transform: "scale(.3)", opacity: 0.9 },
        { transform: "scale(2.2)", opacity: 0 },
      ],
      { duration: 600, easing: "cubic-bezier(.2,.7,.3,1)", delay },
    );
    sigilRef.current?.animate(
      [
        { transform: "scale(.55) rotate(-18deg)", opacity: 0 },
        { transform: "scale(1.06) rotate(3deg)", opacity: 1, offset: 0.7 },
        { transform: "scale(1) rotate(0deg)", opacity: 1 },
      ],
      { duration: 700, easing: "cubic-bezier(.22,1,.36,1)", delay, fill: "backwards" },
    );
    pupilRef.current?.animate(
      [
        { transform: "scale(0)", opacity: 0 },
        { transform: "scale(0)", opacity: 0, offset: 0.5 },
        { transform: "scale(1.3)", opacity: 1, offset: 0.8 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 800, easing: "ease-out", delay, fill: "backwards" },
    );
    // Ne joue qu'une fois flightBox mesuré — cf. useLayoutEffect ci-dessus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightBox]);

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
  const burstInset = -size * (16 / 112);

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
        {arrive && (
          <div
            ref={burstRef}
            style={{
              position: "absolute",
              inset: burstInset,
              borderRadius: "50%",
              border: `2px solid ${c.main}`,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        )}
        {arrive &&
          flightBox &&
          createPortal(
            // eslint-disable-next-line @next/next/no-img-element -- overlay anime via WAAPI (translate/rotate/scale), pas un <Image> layout classique.
            <img
              ref={flightRef}
              src={VOL_SRC[persona]}
              alt=""
              style={{
                position: "fixed",
                left: flightBox.left,
                top: flightBox.top,
                width: flightBox.width,
                height: flightBox.height,
                opacity: 0,
                pointerEvents: "none",
                zIndex: 60,
                willChange: "transform",
              }}
            />,
            document.body,
          )}
        <div
          ref={sigilRef}
          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
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
            ref={pupilRef}
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
      </div>
      {showLabel && (
        <div className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-foreground/50">
          {persona} · {etat}
        </div>
      )}
    </div>
  );
}
