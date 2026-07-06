// Parcours professionnel, à plat — même logique que content/projects.ts et
// content/services.ts (tableau TS simple, pas de CMS).

export interface ExperienceEntry {
  period: string;
  title: string;
  company: string;
  location?: string;
  bullets: string[];
}

export const experience: ExperienceEntry[] = [
  {
    period: "Juin 2025 — Présent",
    title: "Administrateur Systèmes & Réseaux / Référent technique projets",
    company: "Qualitanie",
    location: "Saverdun / Toulouse",
    bullets: [
      "Suivi opérationnel des projets : tâches, avancement, communication interne et direction",
      "Coordination technique N1/N2 et échanges clients",
      "Conception et intégration de solutions : serveurs, moteurs de calcul, routage, déploiements spécifiques",
      "Administration Debian, Docker, WireGuard ; automatisation par scripts",
    ],
  },
  {
    period: "2022 — 2023",
    title: "Ingénieur en conception & spécification (alternance)",
    company: "Thales AVS",
    location: "Toulouse",
    bullets: [
      "Développement Python / Angular en environnement industriel certifié",
      "Conception, évolution et maintenance d'outils techniques multi-équipes",
      "Gestion autonome de projets internes : documentation, transfert de connaissances",
    ],
  },
  {
    period: "2022",
    title: "Développeur logiciel",
    company: "Objectif Science International",
    bullets: [
      "Développement d'une application web JavaScript pour base de données scientifique (MariaDB)",
    ],
  },
  {
    period: "2021",
    title: "Consultant informatique",
    company: "Link Consulting",
    location: "Toulouse",
    bullets: ["Appui technique et remédiation suite à un incident de cybersécurité"],
  },
  {
    period: "2019 — 2021",
    title: "Technicien réseau",
    company: "Econocom",
    location: "Toulouse",
    bullets: ["Infogérance, sécurité, déploiements (WSUS, ITCM, ServiceNow)"],
  },
  {
    period: "2019",
    title: "Technicien informatique / Helpdesk",
    company: "SPIE ICS",
    location: "Toulouse",
    bullets: ["Support N1/N2, déploiements"],
  },
];
