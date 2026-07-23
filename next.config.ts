import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nécessaire pour le Dockerfile : génère .next/standalone (server.js
  // autonome + node_modules minimal), voir docs/architecture.md.
  output: "standalone",

  // Autorise next/image à optimiser les SVG (bloqué par défaut, risque XSS
  // sur du SVG non maîtrisé) - les nôtres sont écrits par nous, dans public/,
  // pas des uploads utilisateur.
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Marqueur pour lib/status.ts : distingue "on a vraiment atteint ce
  // service" de "on a rebondi sur notre propre app via le default_server
  // nginx" (cf. docs/decisions.md). Un simple header `x-powered-by: Next.js`
  // ne suffit pas - plex.tv tourne lui-même sur Next.js (faux négatif testé
  // en réel), il faut un identifiant propre à CE déploiement précis.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Site-Id", value: "hernandes-cloud-self" }],
      },
    ];
  },
};

export default nextConfig;
