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
                    │  API Gabrielle │  (chat, interroge Raphaël en interne)
                    │  PLG           │  (Prometheus/Loki/Grafana - monitoring public)
                    └───────┬───────┘
                            │ LAN 192.168.1.0/24
                            ▼
                    ┌───────────────┐
                    │      Kali      │
                    │  (dédiée sécu/ │
                    │   labo perso)  │
                    │  ELK (privé)   │
                    └───────────────┘
```

Le Pi héberge l'application Next.js (site, API routes), l'API de Gabrielle (chatbot) et la stack **PLG** (Prometheus/Loki/Grafana) qui monitore le Pi et alimente le tableau de bord public sur `/monitoring` - tout ça tourne 24/7, aucun réveil n'est nécessaire. Kali héberge en plus une stack **ELK** (Elasticsearch/Logstash/Kibana), mais à usage personnel (travaux, apprentissage) : privée, pas exposée sur le site, et pas en production au même sens que PLG. Kali **n'est pas réveillée automatiquement** (voir note ci-dessous) : elle est allumée manuellement par Vincent quand il en a besoin pour son propre usage.

## Kali : gérée manuellement, aucune automation

Kali n'a qu'une interface Wi-Fi ; un test réel de réveil à distance (WoWLAN correctement armé côté machine, association Wi-Fi préservée pendant la veille) n'a quand même pas permis de la réveiller - cause probable : la Freebox ne relaie pas fiablement les trames broadcast vers un client Wi-Fi endormi. Voir `docs/decisions.md` (2026-07-06) pour le détail du diagnostic.

Suite à ce constat, l'automation de mise en veille par SSH (`lib/kaliSleepScheduler.ts`, `lib/activityTracker.ts`, `lib/wakeTargets.ts`, `lib/reachability.ts`, `instrumentation.ts`) a été retirée du dépôt (cf. `docs/decisions.md`, 2026-07-21) : Vincent allume et endort Kali lui-même selon ses besoins. Kali n'intervient de toute façon pas dans `/monitoring` (public, alimenté uniquement par le PLG du Pi) - son état n'affecte donc pas la page publique.

(Un mécanisme équivalent existait pour un Desktop hébergeant le chatbot avant que celui-ci ne bascule sur le Pi - cf. `docs/decisions.md`, 2026-07-10 - retiré depuis, le Pi n'a pas besoin d'être réveillé puisqu'il tourne déjà 24/7.)

## Gabrielle vs AlicIA

AlicIA (le lab IA personnel, OpenClaw + Ollama, avec accès `exec`/fichiers) ne doit jamais être exposée publiquement. **Gabrielle** est le rôle d'accueil que joue AlicIA sur ce site - même ton/persona, aucune capacité d'action réelle, aucun outil branché.

## Gabrielle + Raphaël

Gabrielle a sa propre API (`GABRIELLE_API_URL`, défaut `http://127.0.0.1:8082`, cf. `lib/gabrielle.ts`), appelée uniquement côté serveur (`app/api/chat/route.ts`), jamais depuis le navigateur. Elle gère l'historique de conversation elle-même, par `session` (un UUID généré côté client, `sessionStorage`, transmis tel quel - borné à 20 tours et 1 h de TTL côté Gabrielle) : ce dépôt n'envoie que le dernier message, jamais tout le fil.

Pour les réponses qui s'appuient sur la base de connaissance personnelle de Vincent, Gabrielle interroge **Raphaël** en interne - ce dépôt ne l'appelle jamais directement. La réponse distingue trois cas via le champ `statut` : `sources` (réponse appuyée sur des passages retrouvés, chacun avec une `provenance`, un `score` de similarité et son `contenu`), `conversation` (réponse simple, pas de source pertinente), `indisponible` (Raphaël injoignable - traité comme une panne normale, pas une erreur HTTP : la réponse reste 200). Le `verdict` renvoyé est de l'observabilité interne (loggé en `console.debug` côté serveur), jamais affiché.

## kb.hernandes.cloud - carte du vault LabIA (Quartz)

Vit désormais dans son **propre dépôt dédié** ([`vh7383/kb.hernandes.cloud`](https://github.com/vh7383/kb.hernandes.cloud)), avec sa propre CI/CD - plus rien dans ce dépôt-ci (l'ancienne intégration embarquée sous `kb/` a été retirée, cf. `docs/decisions.md`). Toujours un site statique Quartz, servi par nginx sur le Pi, sur le certificat wildcard `*.hernandes.cloud` déjà en place.
