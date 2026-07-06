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
    status: "active",
  },
];
