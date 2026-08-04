"use client";

import { useEffect, useId, useRef } from "react";

// Rendu client uniquement : mermaid manipule le DOM directement et n'a rien
// à faire côté serveur.
export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "-");

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then(async ({ default: mermaid }) => {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "default" });
      const { svg } = await mermaid.render(`mermaid-${id}`, chart);
      if (!cancelled && ref.current) {
        ref.current.innerHTML = svg;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return <div ref={ref} className="mt-4 overflow-x-auto" />;
}
