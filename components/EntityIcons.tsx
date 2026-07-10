// Petites identités visuelles maison (SVG, pas de contenu tiers) pour les
// rôles internes d'AlicIA qu'on laisse entrevoir publiquement — mêmes teintes
// que le reste du site (fond sombre, accent cyan), une forme distincte par
// rôle plutôt qu'une illustration littérale, pour rester volontairement
// mystérieux (cf. docs/decisions.md).

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      <circle cx="32" cy="32" r="31" fill="#0a0a0a" stroke="#27272a" strokeWidth="2" />
      {children}
    </svg>
  );
}

/** Gabrielle : un cercle plein — la plus simple, la plus "ouverte" des trois. */
export function GabrielleIcon() {
  return (
    <Badge>
      <circle cx="32" cy="32" r="13" fill="none" stroke="#06b6d4" strokeWidth="3" />
      <circle cx="32" cy="32" r="4" fill="#06b6d4" />
    </Badge>
  );
}

/** Raphaël : un triangle — mémoire, quelque chose qui pointe vers le passé. */
export function RaphaelIcon() {
  return (
    <Badge>
      <path
        d="M32 18 L45 44 L19 44 Z"
        fill="none"
        stroke="#0e7490"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Badge>
  );
}

/** Mickaël : un losange — veille, quelque chose qui garde. */
export function MickaelIcon() {
  return (
    <Badge>
      <path
        d="M32 17 L47 32 L32 47 L17 32 Z"
        fill="none"
        stroke="#a1a1aa"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Badge>
  );
}
