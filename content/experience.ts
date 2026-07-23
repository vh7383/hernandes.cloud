// Parcours professionnel, à plat - même logique que content/projects.ts et
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
    period: "Juin 2025 - Janvier 2026",
    title: "Administrateur Systèmes & Réseaux · Référent technique projets",
    company: "Qualitanie",
    location: "Saverdun / Toulouse",
    bullets: [
      "Conception d'un moteur de calcul d'itinéraires basé sur OpenTripPlanner : génération d'un graphe de routage GTFS optimisé à l'échelle régionale, dimensionné pour tenir sur un serveur client contraint (32 Go de RAM)",
      "Mise en production du POC sur l'infrastructure du client, validé et exploité par celui-ci",
      "Migration complète du SI d'un client, de macOS vers Debian / Btrfs (~20 utilisateurs) : proposée, validée par le client, menée de bout en bout - intégration système, refonte réseau, split-DNS multi-horizons",
      "Conception et intégration de solutions clients : serveurs, routage, déploiements spécifiques",
      "Administration Debian / Docker / WireGuard ; automatisation par scripts",
      "Suivi opérationnel de plusieurs chantiers clients en parallèle : découpage, avancement, communication interne et direction",
      "Coordination technique N1/N2 et interface clients (clarification des besoins, réunions techniques)",
      "Rédaction de documentation et de procédures d'exploitation",
    ],
  },
  {
    period: "2022 - 2023",
    title: "Ingénieur en conception & spécification (alternance)",
    company: "Thales AVS - SciLab",
    location: "Toulouse",
    bullets: [
      "Développement Python / Angular au sein du SciLab, structure agile opérant comme une start-up interne au cœur d'un groupe industriel",
      "MCO / MCS d'un Business Managed Network : réseau privé du laboratoire, autonome sous supervision de la DSI groupe - exploitation, sécurité, intégration de nouvelles solutions",
      "Rôle transverse au service des équipes du groupe (développement, R&D, communication, cybersécurité) : valorisation de leurs projets avec les moyens du laboratoire",
      "Gestion autonome de projets internes : documentation, transfert de connaissances",
    ],
  },
  {
    period: "2022",
    title: "Développeur logiciel",
    company: "Objectif Science International",
    bullets: [
      "Application web (JavaScript / MariaDB) centralisant les mesures de terrain des contributeurs participatifs et des chercheurs de l'INRAE",
      "Développement en binôme sous conduite d'un chef de projet ; solution livrée et exploitée sur un programme scientifique au long cours",
    ],
  },
  {
    period: "2021",
    title: "Consultant informatique",
    company: "Link Consulting",
    location: "Toulouse",
    bullets: [
      "Reconstruction du SI d'une entreprise (~100 utilisateurs répartis en France, infrastructure auto-hébergée) après une attaque par ransomware ayant chiffré le SI et ses sauvegardes",
      "Remise en service sans paiement de rançon ; accompagnement technique et humain des équipes pendant la phase critique",
    ],
  },
  {
    period: "2019 - 2021",
    title: "Technicien réseau",
    company: "Econocom",
    location: "Toulouse",
    bullets: [
      "Infogérance d'un parc d'environ 1 500 utilisateurs sur site industriel (Thales, sous-traitance) : sécurité, déploiements, WSUS / ITCM / ServiceNow",
      "Masterisation de postes à l'échelle de la plaque régionale",
      "Recommandation interne ayant conduit au recrutement chez Thales",
    ],
  },
  {
    period: "2019",
    title: "Technicien de proximité, puis technicien support",
    company: "SPIE ICS",
    location: "Toulouse",
    bullets: [
      "Technicien de proximité itinérant, clients privés et publics : déploiements de parcs physiques puis logiciels",
      "Support N1/N2 en équipe mutualisée : environnements hétérogènes multi-clients, virtualisation, systèmes legacy (IBM AS/400, Lotus Domino, ERP Movex)",
    ],
  },
];
