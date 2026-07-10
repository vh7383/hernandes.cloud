# hernandes.cloud

Porte d'entrée de mon SI personnel : portfolio, hub vers mes services auto-hébergés (Nextcloud, Vaultwarden, Plex, photos, vidéosurveillance), chatbot **Gabrielle**, et affichage public de mon monitoring (Elastic).

Ce projet sert aussi de terrain d'apprentissage : Next.js/React, et la méthode de travail (documentation continue, décisions tracées) — voir [`docs/`](./docs).

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** (config native CSS via `@theme`, pas de `tailwind.config.ts`)
- Déploiement : Docker (image `linux/arm64`) sur un Raspberry Pi, via GitHub Actions + `ghcr.io`

## Particularité : veille à la demande (Kali)

Le monitoring (Elastic sur ma machine Kali) tourne sur un poste qui ne reste **pas** allumé en permanence, contrairement au Pi qui héberge le site. Kali se rendort après inactivité (SSH déclenché par le Pi) mais n'est plus réveillée automatiquement (Wake-on-LAN abandonné pour cette machine, cf. `docs/decisions.md`). Le chatbot (Gabrielle) tourne directement sur le Pi (llama.cpp), donc pas de réveil nécessaire pour lui. Détails dans [`docs/architecture.md`](./docs/architecture.md).

## Développement local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement

Voir le workflow `.github/workflows/deploy.yml` — build Docker multi-arch (arm64), push vers `ghcr.io/vh7383/hernandes.cloud`, puis déploiement sur le Pi via SSH (`docker compose pull && docker compose up -d`).

## Documentation

- [`docs/architecture.md`](./docs/architecture.md) — schéma des machines impliquées (Pi/Kali) et des flux (chatbot, monitoring, veille).
- [`docs/decisions.md`](./docs/decisions.md) — journal des décisions structurantes prises pendant la construction.

## État de production

Déployé et en ligne sur `hernandes.cloud` (Pi, reverse proxy nginx → conteneur `127.0.0.1:3001`) depuis le 2026-07-06. Pipeline CI/CD GitHub Actions fonctionnel (build arm64 → `ghcr.io` → déploiement SSH). `/var/www/html` (ancien site statique) conservé intact en fallback, non nettoyé pour l'instant.

## Reste à faire

- Serveur llama.cpp de Gabrielle sur le Pi : pas encore monté (cf. `docs/decisions.md`) — `/api/chat` cible `GABRIELLE_LLAMACPP_URL` mais l'appel échouera tant que ce service n'existe pas.
- Dashboard Kibana/Grafana public curé et anonymisé pour `NEXT_PUBLIC_MONITORING_EMBED_URL` : pas encore configuré.
- Nettoyage de `/var/www/html` sur le Pi, une fois la confiance établie dans le nouveau déploiement.
- Alias DSM à configurer (Panneau de configuration > Portail de connexion > Applications) pour que les nouveaux sous-domaines NAS pointent réellement vers les bons services : `audio`, `contacts`, `files`, `notes`, `syno-drive`, `nas` (`cam` et `photo` existaient déjà). Tant que non fait, `/monitoring` les affichera correctement en "indisponible" (cf. `docs/decisions.md`).
- Vrais logos pour les services NAS (actuellement des icônes emoji de repli) — à déposer dans `public/images/` puis référencer via le champ `logo` de `content/services.ts`.
