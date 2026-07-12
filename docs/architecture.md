# Architecture

## Vue d'ensemble

```
                         Internet
                            │
                            ▼
                    ┌───────────────┐
                    │  Raspberry Pi  │  (allumé 24/7, seule machine exposée publiquement)
                    │  nginx + TLS   │
                    │  Next.js (app) │
                    │  llama.cpp     │  (Gabrielle, chat)
                    └───────┬───────┘
                            │ LAN 192.168.1.0/24
                            ▼
                    ┌───────────────┐
                    │      Kali      │
                    │  (dédiée sécu/ │
                    │   monitoring)  │
                    │    Elastic     │
                    └───────────────┘
```

Le Pi héberge l'application Next.js (site, API routes) et le backend du chatbot (llama.cpp), tous deux toujours allumés — aucun réveil n'est nécessaire pour le chat. Kali héberge Elastic mais **n'est pas réveillée automatiquement** (voir note ci-dessous) : elle est allumée manuellement par Vincent quand le monitoring doit être montré.

## Kali : pas de réveil automatique

Kali n'a qu'une interface Wi-Fi ; un test réel (WoWLAN correctement armé côté machine, association Wi-Fi préservée pendant la veille) n'a quand même pas permis de la réveiller à distance — cause probable : la Freebox ne relaie pas fiablement les trames broadcast vers un client Wi-Fi endormi. Voir `docs/decisions.md` (2026-07-06) pour le détail du diagnostic. `/monitoring` affiche donc un état "indisponible" quand Kali dort, sans tentative de réveil.

## Flux remise en veille — Kali uniquement

Kali est une machine dédiée, sans usage interactif concurrent. `lib/kaliSleepScheduler.ts`, démarré au boot du serveur via `instrumentation.ts`, vérifie toutes les 5 min si Kali est jointe ET inactive depuis plus de 15 min (`lib/activityTracker`, alimenté par `lib/status.ts` à chaque consultation de `/monitoring` où elle répond) ; si oui, il déclenche `ssh vincent@<kali> "systemctl suspend"` avec la clé dédiée Pi→Kali (restreinte à cette seule commande, cf. `docs/decisions.md`). Non testé de bout en bout avant déploiement réel sur le Pi (la clé n'existe que là-bas).

(Un mécanisme équivalent existait pour un Desktop hébergeant le chatbot avant que celui-ci ne bascule sur le Pi — cf. `docs/decisions.md`, 2026-07-10 — retiré depuis, le Pi n'a pas besoin d'être réveillé puisqu'il tourne déjà 24/7.)

## Gabrielle vs AlicIA

AlicIA (le lab IA personnel, OpenClaw + Ollama, avec accès `exec`/fichiers) ne doit jamais être exposée publiquement. **Gabrielle** est le rôle d'accueil que joue AlicIA sur ce site : un petit modèle (0.5B) servi par llama.cpp sur le Pi, avec RAG géré côté serveur — même ton/persona, aucune capacité d'action réelle, aucun outil branché.

## kb.hernandes.cloud — carte du vault LabIA (Quartz)

Site statique généré par [Quartz](https://quartz.jzhao.xyz/) à partir d'un export du vault privé LabIA (`kb/content/`, régénéré par `scripts/export-kb-skeleton.mjs`) — **titres et liens uniquement, jamais le corps des notes** : le vault reste privé (ADR-005), seule sa topologie est publique. Buildé en CI (job `build-and-deploy-kb`, `ubuntu-latest` — pur HTML/CSS/JS, pas de cross-build arm64 nécessaire) et déployé par `rsync` vers `/opt/kb-hernandes-cloud/public/` sur le Pi. Aucun conteneur : nginx sert directement ce dossier, comme n'importe quel site statique.

**Mise à jour du contenu** : relancer `node scripts/export-kb-skeleton.mjs '<chemin-vault>'` (écrase `kb/content/*.md` sauf `index.md`, géré à la main), committer, pousser — le build/déploiement suit automatiquement.

**Clé SSH dédiée** : le job utilise `secrets.PI_KB_SSH_KEY`, distincte de `PI_SSH_KEY` (verrouillée sur `/opt/hernandes-cloud/deploy.sh` via `command=` dans `authorized_keys` — la réutiliser faisait échouer `rsync` en silence, cf. `docs/decisions.md`). Restreinte via `rrsync` au seul dossier kb :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_github_kb -N "" -C "github-actions-kb-deploy"
sudo mkdir -p /opt/kb-hernandes-cloud/public
sudo chown -R $(whoami):$(whoami) /opt/kb-hernandes-cloud
echo -n 'command="/usr/bin/rrsync /opt/kb-hernandes-cloud/public",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ' \
  | cat - ~/.ssh/id_ed25519_github_kb.pub >> ~/.ssh/authorized_keys
```

Puis coller `~/.ssh/id_ed25519_github_kb` (clé privée) dans le secret GitHub `PI_KB_SSH_KEY`.

**Configuration nginx sur le Pi (à poser une fois, manuellement)** :

```nginx
server {
    listen 443 ssl http2;
    server_name kb.hernandes.cloud;

    root /opt/kb-hernandes-cloud/public;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    ssl_certificate     /etc/letsencrypt/live/kb.hernandes.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kb.hernandes.cloud/privkey.pem;
}

server {
    listen 80;
    server_name kb.hernandes.cloud;
    return 301 https://$host$request_uri;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d kb.hernandes.cloud
```

(DNS wildcard `*.hernandes.cloud` déjà en place — pas d'enregistrement supplémentaire nécessaire.)
