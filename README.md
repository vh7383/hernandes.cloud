# hernandes.cloud

Porte d'entrée de mon SI personnel : portfolio, hub vers mes services auto-hébergés (Nextcloud, Vaultwarden, Plex, photos, vidéosurveillance), chatbot **Gabrielle**, et affichage public de mon monitoring (Grafana).

Ce projet sert aussi de terrain d'apprentissage : Next.js/React, et la méthode de travail (documentation continue, décisions tracées) — voir [`docs/`](./docs).

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** (config native CSS via `@theme`, pas de `tailwind.config.ts`)
- Déploiement : Docker (image `linux/arm64`) sur un Raspberry Pi, via GitHub Actions + `ghcr.io`

## Particularité : Kali gérée manuellement

Ma machine Kali (labo perso, ELK) ne reste **pas** allumée en permanence, contrairement au Pi qui héberge le site. Je l'allume et l'endors moi-même selon mes besoins — aucune automation de réveil ou de mise en veille dans ce dépôt (Wake-on-LAN abandonné pour cette machine, cf. `docs/decisions.md`). Le monitoring public du site (Grafana) et le chatbot (Gabrielle, llama.cpp) tournent tous les deux directement sur le Pi, donc aucun des deux ne dépend de Kali. Détails dans [`docs/architecture.md`](./docs/architecture.md).

## Développement local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement

Voir le workflow `.github/workflows/deploy.yml` — build Docker multi-arch (arm64), push vers `ghcr.io/vh7383/hernandes.cloud`, puis déploiement sur le Pi via SSH (`docker compose pull && docker compose up -d`).

## Documentation

- [`docs/architecture.md`](./docs/architecture.md) — schéma des machines impliquées (Pi/Kali) et des flux (chatbot, monitoring).
- [`docs/decisions.md`](./docs/decisions.md) — journal des décisions structurantes prises pendant la construction.

## État de production

Déployé et en ligne sur `hernandes.cloud` (Pi, reverse proxy nginx → conteneur `127.0.0.1:3001`) depuis le 2026-07-06. Pipeline CI/CD GitHub Actions fonctionnel (build arm64 → `ghcr.io` → déploiement SSH). `/var/www/html` (ancien site statique) conservé intact en fallback, non nettoyé pour l'instant.

## Reste à faire

- Nettoyage de `/var/www/html` sur le Pi, une fois la confiance établie dans le nouveau déploiement.
- Alias DSM restant : `nas.hernandes.cloud` (DSM lui-même) toujours marqué `comingSoon` dans `content/services.ts` — pas encore configuré côté DSM, contrairement aux 7 autres services NAS (reverse proxy + certificat partagé avec le Pi, plus de port dans l'URL depuis le 2026-07-21, cf. `docs/decisions.md`).
