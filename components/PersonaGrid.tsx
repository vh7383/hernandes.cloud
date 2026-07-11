"use client";

import { useEffect, useState } from "react";
import PersonaHUD, { type PersonaEtat, type PersonaKey } from "@/components/PersonaHUD";

// Cycle de démonstration des 4 états dans la modale, pour qu'on les voie
// tous sans avoir besoin d'une vraie conversation avec Gabrielle.
const ETAT_CYCLE: PersonaEtat[] = ["idle", "pense", "parle", "alerte"];
const ETAT_CYCLE_MS = 2600;

interface Persona {
  key: PersonaKey;
  name: string;
  tagline: string;
  bubble: string;
  description: string;
}

// Descriptions volontairement centrées sur la personnalité/le rôle perçu,
// pas sur la mécanique interne précise — cf. docs/decisions.md.
const PERSONAE: Persona[] = [
  {
    key: "gabrielle",
    name: "Gabrielle",
    tagline: "Annonce · Accueil",
    bubble: "« Entrez, je vous accueille. »",
    description:
      "Le visage que vous croisez en premier sur ce site. Son rôle : accueillir, orienter, donner un premier niveau de réponse — sans jamais prétendre en savoir plus qu'elle n'en sait. Un modèle local, volontairement modeste, pensé pour la franchise plutôt que pour l'illusion de compétence.",
  },
  {
    key: "raphael",
    name: "Raphaël",
    tagline: "Connaissance",
    bubble: "« Je me souviens de tout. Enfin, presque. »",
    description:
      "La mémoire du foyer. Il retient ce qui compte, relie les fils entre les échanges, donne de la continuité là où chaque conversation pourrait autrement repartir de zéro. Discret par nature — on le croise rarement en façade.",
  },
  {
    key: "mickael",
    name: "Mickaël",
    tagline: "Protection · Arbitrage",
    bubble: "« Je veille. C'est tout ce que vous devez savoir. »",
    description:
      "La vigilance tranquille. Elle observe ce qui se passe, pose des limites, et intervient quand quelque chose sort du cadre attendu. Son rôle n'est pas de produire, mais de garantir que le reste fonctionne proprement.",
  },
];

export default function PersonaGrid() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [etatIndex, setEtatIndex] = useState(0);
  const active = PERSONAE.find((p) => p.key === openKey);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setEtatIndex((i) => (i + 1) % ETAT_CYCLE.length);
    }, ETAT_CYCLE_MS);
    return () => clearInterval(id);
  }, [active]);

  function openPersona(key: PersonaKey) {
    setEtatIndex(0);
    setOpenKey(key);
  }

  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {PERSONAE.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => openPersona(p.key)}
            className="group text-center"
          >
            <div className="mx-auto transition group-hover:scale-105">
              <PersonaHUD persona={p.key} size={64} />
            </div>
            <p className="mt-2 text-sm font-medium group-hover:text-brand">{p.name}</p>
            <p className="mt-2 rounded-2xl rounded-b-none border border-border bg-surface px-3 py-2 text-xs text-foreground/70">
              {p.bubble}
            </p>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setOpenKey(null)}
        >
          <div
            className="max-w-md overflow-hidden rounded-lg border border-border bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2 bg-[#12100E] py-8">
              <PersonaHUD persona={active.key} etat={ETAT_CYCLE[etatIndex]} size={160} />
              <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                {ETAT_CYCLE[etatIndex]}
              </p>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{active.name}</h3>
                  <p className="text-xs uppercase tracking-wide text-foreground/50">
                    {active.tagline}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenKey(null)}
                  aria-label="Fermer"
                  className="text-foreground/60 hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <p className="mt-3 text-sm text-foreground/70">{active.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
