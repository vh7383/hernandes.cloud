# hernandes.cloud

Porte d'entrée de mon SI personnel : portfolio, hub vers mes services auto-hébergés (Nextcloud, Vaultwarden, Plex, photos, vidéosurveillance), chatbot **AlicIA-lite**, et affichage public de mon monitoring (Elastic).

Ce projet sert aussi de terrain d'apprentissage : Next.js/React, et la méthode de travail (documentation continue, décisions tracées) — voir [`docs/`](./docs).

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** (config native CSS via `@theme`, pas de `tailwind.config.ts`)
- Déploiement : Docker (image `linux/arm64`) sur un Raspberry Pi, via GitHub Actions + `ghcr.io`

## Particularité : réveil/veille à la demande

Le chatbot (backend sur mon Desktop) et le monitoring (Elastic sur ma machine Kali) tournent sur des postes qui ne restent **pas** allumés en permanence, contrairement au Pi qui héberge le site. Une requête sur le site déclenche un réveil Wake-on-LAN de la machine concernée ; elle se rendort après inactivité. Détails dans [`docs/architecture.md`](./docs/architecture.md).

## Développement local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement

Voir le workflow `.github/workflows/deploy.yml` — build Docker multi-arch (arm64), push vers `ghcr.io/vh7383/hernandes.cloud`, puis déploiement sur le Pi via SSH (`docker compose pull && docker compose up -d`).

## Documentation

- [`docs/architecture.md`](./docs/architecture.md) — schéma des machines impliquées (Pi/Desktop/Kali) et des flux (chatbot, monitoring, réveil/veille).
- [`docs/decisions.md`](./docs/decisions.md) — journal des décisions structurantes prises pendant la construction.

## À activer avant mise en prod

- `scripts/desktop-sleep-watcher.ps1` est écrit et testé en dry-run, mais **pas encore enregistré comme tâche planifiée Windows récurrente** — laissé en réserve tant que le site n'est pas réellement déployé (l'URL `hernandes.cloud/api/activity` qu'il interroge n'existe pas encore en prod). À activer via `Register-ScheduledTask` une fois le déploiement fait.
- Instance Ollama isolée dédiée à AlicIA-lite sur le Desktop : pas encore montée (cf. `docs/decisions.md`).
- Clé SSH dédiée Pi→Kali : générée et déployée (restreinte à `systemctl suspend`), mais le chemin exact (`KALI_SSH_KEY_PATH`) doit être confirmé/monté dans le conteneur au déploiement.
