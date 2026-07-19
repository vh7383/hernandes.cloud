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

Vit désormais dans son **propre dépôt dédié** ([`vh7383/kb.hernandes.cloud`](https://github.com/vh7383/kb.hernandes.cloud)), avec sa propre CI/CD — plus rien dans ce dépôt-ci (l'ancienne intégration embarquée sous `kb/` a été retirée, cf. `docs/decisions.md`). Toujours un site statique Quartz, servi par nginx sur le Pi, sur le certificat wildcard `*.hernandes.cloud` déjà en place.
