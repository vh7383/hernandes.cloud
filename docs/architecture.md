# Architecture

## Vue d'ensemble

```
                         Internet
                            │
                            ▼
                DNS (hernandes.cloud, bascule automatique)
                            │
              ┌─────────────┴──────────────┐
              ▼                            ▼
      ┌────────────────┐           ┌────────────────┐
      │       VPS       │  mesh VPN │ serveur local   │
      │ point d'entrée  │◄─────────►│ proxy local +   │
      │ par défaut      │           │ serveur secours │
      │ nginx + TLS     │           │ PLG monitoring  │
      │ Next.js (app)   │           └────────┬───────┘
      │ API Gabrielle   │                    │
      └────────┬───────┘                     │
               │              mesh VPN        │
               └──────────────┬───────────────┘
                               ▼
                       ┌────────────────┐
                       │      Kali       │
                       │ (poste sécurité) │
                       │  ELK (privé)     │
                       └────────────────┘
```

Le point d'entrée public de `hernandes.cloud` n'est plus une seule machine mais une propriété du DNS : un **VPS** sert le trafic par défaut (Next.js + API Gabrielle), avec bascule automatique vers un **serveur local** en secours si le VPS tombe (et retour automatique une fois rétabli). Le serveur local reste allumé 24/7, sert aussi de proxy pour mon réseau local, et héberge la stack **PLG** (Prometheus/Loki/Grafana) qui alimente le tableau de bord public sur `/monitoring`. **Kali**, mon poste de sécurité personnel, est reliée en mesh VPN aux deux autres machines ; elle héberge en plus une stack **ELK** (Elasticsearch/Logstash/Kibana) à usage strictement personnel - privée, pas exposée sur le site.

## Kali : gérée manuellement, aucune automation

Kali n'est jamais réveillée ou mise en veille automatiquement : Vincent l'allume et l'endort lui-même selon ses besoins (voir `docs/decisions.md`, 2026-07-06 et 2026-07-21, pour l'historique des tentatives d'automation et pourquoi elles ont été abandonnées). Kali n'intervient de toute façon pas dans `/monitoring` (public, alimenté uniquement par le PLG du serveur local) - son état n'affecte donc pas la page publique.

## Gabrielle vs AlicIA

AlicIA (le lab IA personnel, OpenClaw + Ollama, avec accès `exec`/fichiers) ne doit jamais être exposée publiquement. **Gabrielle** est le rôle d'accueil que joue AlicIA sur ce site - même ton/persona, aucune capacité d'action réelle, aucun outil branché.

## Gabrielle + Raphaël

Gabrielle a sa propre API (`GABRIELLE_API_URL`, cf. `lib/gabrielle.ts`), appelée uniquement côté serveur (`app/api/chat/route.ts`), jamais depuis le navigateur. Elle gère l'historique de conversation elle-même, par `session` (un UUID généré côté client, `sessionStorage`, transmis tel quel - borné à 20 tours et 1 h de TTL côté Gabrielle) : ce dépôt n'envoie que le dernier message, jamais tout le fil.

Pour les réponses qui s'appuient sur la base de connaissance personnelle de Vincent, Gabrielle interroge **Raphaël** en interne - ce dépôt ne l'appelle jamais directement. La réponse distingue trois cas via le champ `statut` : `sources` (réponse appuyée sur des passages retrouvés, chacun avec une `provenance`, un `score` de similarité et son `contenu`), `conversation` (réponse simple, pas de source pertinente), `indisponible` (Raphaël injoignable - traité comme une panne normale, pas une erreur HTTP : la réponse reste 200). Le `verdict` renvoyé est de l'observabilité interne (loggé en `console.debug` côté serveur), jamais affiché.

## kb.hernandes.cloud - carte du vault LabIA (Quartz)

Vit désormais dans son **propre dépôt dédié** ([`vh7383/kb.hernandes.cloud`](https://github.com/vh7383/kb.hernandes.cloud)), avec sa propre CI/CD - plus rien dans ce dépôt-ci (l'ancienne intégration embarquée sous `kb/` a été retirée, cf. `docs/decisions.md`). Toujours un site statique Quartz, servi par nginx, sur le certificat wildcard `*.hernandes.cloud` déjà en place.
