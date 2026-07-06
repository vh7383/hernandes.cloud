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

Le Pi héberge l'application Next.js (site, API routes) et reste toujours allumé. Desktop héberge le backend du chatbot et reste éteint/en veille par défaut pour limiter la consommation électrique — il est réveillé à la demande (Wake-on-LAN filaire, confirmé fonctionnel). Kali héberge Elastic mais **n'est pas réveillée automatiquement** (voir note ci-dessous) : elle est allumée manuellement par Vincent quand le monitoring doit être montré.

## Flux réveil (Wake-on-LAN) — Desktop uniquement

1. Un visiteur envoie un message au chatbot.
2. L'API route côté Pi (`/api/chat`) vérifie si le Desktop répond sur son port de service.
3. Si non : envoi d'un magic packet UDP (broadcast LAN, `lib/wol.ts`) vers la MAC du Desktop.
4. Polling du port de service (pas un simple ping) jusqu'à réponse ou timeout (~90s).
5. Le visiteur voit un indicateur "réveil en cours" pendant l'attente.

Ce sens de communication (Pi → cible) ne nécessite aucun credential : un magic packet est un datagramme UDP non authentifié, seul le LAN doit être partagé.

**Kali n'a pas ce flux.** Elle n'a qu'une interface Wi-Fi ; un test réel (WoWLAN correctement armé côté machine, association Wi-Fi préservée pendant la veille) n'a quand même pas permis de la réveiller à distance — cause probable : la Freebox ne relaie pas fiablement les trames broadcast vers un client Wi-Fi endormi. Voir `docs/decisions.md` (2026-07-06) pour le détail du diagnostic. `/monitoring` affiche donc un état "indisponible" quand Kali dort, sans tentative de réveil.

## Flux remise en veille — asymétrique par design

- **Kali** : machine dédiée, pas d'usage interactif concurrent. `lib/kaliSleepScheduler.ts`, démarré au boot du serveur via `instrumentation.ts`, vérifie toutes les 5 min si Kali est jointe ET inactive depuis plus de 15 min (`lib/activityTracker`, alimenté par `lib/status.ts` à chaque consultation de `/monitoring` où elle répond) ; si oui, il déclenche `ssh vincent@<kali> "systemctl suspend"` avec la clé dédiée Pi→Kali (restreinte à cette seule commande, cf. `docs/decisions.md`). Non testé de bout en bout avant déploiement réel sur le Pi (la clé n'existe que là-bas).
- **Desktop** : PC interactif quotidien de Vincent — on ne laisse **pas** le Pi forcer une mise en veille à distance (pas de WinRM/exec entrant à ouvrir sur ce poste). À la place, `scripts/desktop-sleep-watcher.ps1` (tâche planifiée Windows, toutes les ~5 min) interroge périodiquement `GET /api/activity` (dernière requête site) et son propre idle time local (souris/clavier, `GetLastInputInfo`). Il ne s'endort que si les deux conditions d'inactivité sont réunies (15 min de chaque côté, + 2 min de grâce après un réveil) — un seul sens de communication (Desktop → Pi), jamais l'inverse. Testé en dry-run (sortie anticipée quand actif) ; le déclenchement réel de mise en veille n'a pas été testé pour ne pas interrompre la session en cours.

## AlicIA-lite vs AlicIA

AlicIA (le lab IA personnel, OpenClaw + Ollama, avec accès `exec`/fichiers) ne doit jamais être exposée publiquement. AlicIA-lite est une instance de modèle isolée et sans outils, dédiée au chatbot du site — même persona/ton, aucune capacité d'action réelle.
