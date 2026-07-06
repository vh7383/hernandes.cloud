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
                    └───────┬───────┘
                            │ LAN 192.168.1.0/24
              ┌─────────────┼─────────────┐
              ▼                           ▼
      ┌───────────────┐           ┌───────────────┐
      │    Desktop     │           │      Kali      │
      │  (PC perso,    │           │  (dédiée sécu/ │
      │   usage actif) │           │   monitoring)  │
      │  AlicIA-lite   │           │    Elastic     │
      └───────────────┘           └───────────────┘
```

Le Pi héberge l'application Next.js (site, API routes) et reste toujours allumé. Desktop et Kali hébergent respectivement le backend du chatbot et Elastic, mais restent éteints/en veille par défaut pour limiter la consommation électrique — ils sont réveillés à la demande.

## Flux réveil (Wake-on-LAN)

1. Un visiteur envoie un message au chatbot (ou consulte `/monitoring`).
2. L'API route côté Pi (`/api/chat` ou `/api/status`) vérifie si la machine cible répond sur son port de service.
3. Si non : envoi d'un magic packet UDP (broadcast LAN, `lib/wol.ts`) vers la MAC de la cible.
4. Polling du port de service (pas un simple ping) jusqu'à réponse ou timeout (~90s).
5. Le visiteur voit un indicateur "réveil en cours" pendant l'attente.

Ce sens de communication (Pi → cible) ne nécessite aucun credential : un magic packet est un datagramme UDP non authentifié, seul le LAN doit être partagé.

## Flux remise en veille — asymétrique par design

- **Kali** : machine dédiée, pas d'usage interactif concurrent. Le Pi peut se connecter en SSH et déclencher `systemctl suspend` après N minutes sans requête.
- **Desktop** : PC interactif quotidien de Vincent — on ne laisse **pas** le Pi forcer une mise en veille à distance (pas de WinRM/exec entrant à ouvrir sur ce poste). À la place, un script local sur le Desktop interroge périodiquement `GET /api/activity` (dernière requête site) et son propre idle time local (souris/clavier, `GetLastInputInfo`). Il ne s'endort que si les deux conditions d'inactivité sont réunies — un seul sens de communication (Desktop → Pi), jamais l'inverse.

## AlicIA-lite vs AlicIA

AlicIA (le lab IA personnel, OpenClaw + Ollama, avec accès `exec`/fichiers) ne doit jamais être exposée publiquement. AlicIA-lite est une instance de modèle isolée et sans outils, dédiée au chatbot du site — même persona/ton, aucune capacité d'action réelle.
