// Liste de projets à plat, en TypeScript : pas de CMS/MDX, juste un tableau
// qu'on édite à la main. Volontairement simple pour l'instant — voir
// docs/decisions.md pour la raison de ce choix.

export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  links?: { repo?: string; demo?: string; board?: string };
  status: "active" | "archived" | "idea";
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
      board: "https://sharing.clickup.com/90121874429/l/h/6-901219336964-1/1d5bec3cbf05a0f",
    },
    status: "active",
  },
  {
    slug: "alicia",
    title: "AlicIA",
    description:
      "Lab IA personnel : agent local (OpenClaw + Ollama) exploré en observabilité avant fiabilité — un terrain d'expérimentation, pas un produit.",
    stack: ["Ollama", "OpenClaw", "Self-hosting"],
    links: {
      board: "https://sharing.clickup.com/90121874429/l/h/6-901219337586-1/c872c825dc3b934",
    },
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
    slug: "otp-routage-multimodal",
    title: "OpenTripPlanner — routage multimodal (POC)",
    description:
      "Preuve de concept de routage multimodal pour une entreprise de mobilité, basée sur OpenTripPlanner 2.4 : pipeline de données OSM/GTFS/DEM (GDAL), construction de graphe, déploiement en service systemd, documentation d'exploitation et de reprise. Mission professionnelle réalisée en solo.",
    stack: ["OpenTripPlanner", "GDAL", "GTFS", "OSM", "Java", "Systemd"],
    status: "archived",
  },
];
