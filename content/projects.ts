// Liste de projets à plat, en TypeScript : pas de CMS/MDX, juste un tableau
// qu'on édite à la main. Volontairement simple pour l'instant - voir
// docs/decisions.md pour la raison de ce choix.

export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  links?: { repo?: string; demo?: string; board?: string; page?: string };
  status: "active" | "archived" | "idea";
  /** Logo/illustration optionnel, affiché en tête de carte (cf. ProjectCard.tsx). */
  logo?: string;
}

export const projects: Project[] = [
  {
    slug: "hernandes-cloud",
    title: "hernandes.cloud",
    description:
      "Ce site lui-même : refonte complète en Next.js/React, avec chatbot maison et monitoring public, déployé sur mon propre Raspberry Pi.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Docker"],
    links: {
      repo: "https://github.com/vh7383/hernandes.cloud",
      board: "https://trello.com/b/fcf3lkjH/%F0%9F%A7%AA-refonte-wwwhernandescloud",
    },
    status: "active",
  },
  {
    slug: "labia",
    title: "LabIA",
    description:
      "Mon laboratoire IA personnel : une résidente (AlicIA, OpenClaw + Ollama, mon projet principal - identité, communication, expérimentation) et plusieurs assistants IA avec qui je collabore au quotidien. Travail en cours sur l'orchestration multi-agents (LangGraph) et la traçabilité (LangSmith).",
    stack: ["Ollama", "OpenClaw", "LangGraph", "LangSmith", "Multi-agent"],
    links: {
      page: "/labia",
      board: "https://trello.com/b/VDzfOOrX/%F0%9F%A7%A0-labia-suivi-public",
    },
    status: "active",
  },
  {
    slug: "infra-perso",
    title: "Infrastructure personnelle auto-hébergée",
    description:
      "Raspberry Pi (24/7, reverse proxy + services), NAS Synology, Desktop et Kali réveillés à la demande : quatre machines, quatre rôles, une architecture pensée pour limiter la surface d'attaque plutôt que pour la simplicité.",
    stack: ["Docker", "Nginx", "Synology DSM", "Wake-on-LAN", "SSH"],
    links: { page: "/infra" },
    status: "active",
  },
  {
    slug: "infra-onpremise-pme",
    title: "Infrastructure on-premise pour PME",
    description:
      "Conception et documentation d'une infrastructure on-premise pour une PME : sauvegardes chiffrées (Borg + snapshots Btrfs), VPN WireGuard, DNS interne, reverse proxy Nginx, hébergement Nextcloud et Odoo en conteneurs. Mission professionnelle réalisée en solo.",
    stack: ["Debian", "Docker", "Btrfs", "BorgBackup", "WireGuard", "Nginx", "Nextcloud", "Odoo"],
    status: "archived",
  },
  {
    slug: "wikilab",
    title: "WikiLAB - plateforme documentaire interne",
    description:
      "Application web de gestion documentaire (pages, tutoriels, présentations) avec authentification par rôles (utilisateur, modérateur, administrateur) et modération de contenu. Réalisée en équipe chez Thales AVS dans le cadre de ma licence.",
    stack: ["Angular", "Node.js", "Express", "MongoDB", "JWT"],
    status: "archived",
  },
  {
    slug: "otp-routage-multimodal",
    title: "OpenTripPlanner - routage multimodal (POC)",
    description:
      "Preuve de concept de routage multimodal pour une entreprise de mobilité, basée sur OpenTripPlanner 2.4 : pipeline de données OSM/GTFS/DEM (GDAL), construction de graphe, déploiement en service systemd, documentation d'exploitation et de reprise. Mission professionnelle réalisée en solo.",
    stack: ["OpenTripPlanner", "GDAL", "GTFS", "OSM", "Java", "Systemd"],
    status: "archived",
  },
  {
    slug: "osi-water-watch",
    title: "OSI Water Watch",
    description:
      "Application web pour la base de données scientifique du programme de sciences participatives OSI Water Watch (Objectif Sciences International) : collecte de données de qualité de l'eau, intégration MariaDB, collaboration avec chercheurs et équipe technique.",
    stack: ["JavaScript", "MariaDB"],
    links: { demo: "https://www.osi-water-watch.org/" },
    status: "archived",
  },
];
