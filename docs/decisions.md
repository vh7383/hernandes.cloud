# Journal des décisions

Décisions structurantes prises pendant la construction du projet, avec le contexte qui les justifie — utile pour se souvenir *pourquoi*, pas seulement *quoi*.

## 2026-07-06 — Next.js/React plutôt qu'un générateur de site statique

Un site vitrine + portfolio pouvait très bien être fait en Astro (plus simple, zéro JS par défaut). Choix de Next.js/React quand même : objectif explicite de pratiquer ces technos, et un backend était de toute façon nécessaire (chatbot, statut, réveil/veille).

## 2026-07-06 — GitHub comme dépôt canonique (remplace GitLab)

Le projet existait sur GitLab (`l4chd4n4n/hernandes.cloud`) sous forme de POC. La refonte est traitée comme un nouveau projet, hébergé sur GitHub (`vh7383/hernandes.cloud`). Le GitLab existant reste en l'état, non maintenu — pas de synchronisation entre les deux.

## 2026-07-06 — Mécanisme de veille asymétrique (Kali vs Desktop)

Kali est mise en veille par le Pi via SSH (`systemctl suspend`), centralisé et simple. Desktop ne l'est *jamais* à distance : c'est le poste de travail interactif quotidien de Vincent, et ouvrir un accès entrant (WinRM ou équivalent) dessus pour permettre une mise en veille forcée aurait été une surface d'attaque inutile sur la machine la plus sensible (elle héberge aussi la vraie AlicIA, avec accès `exec`/fichiers). À la place, un script local sur le Desktop prend la décision lui-même, en croisant l'inactivité du site et sa propre inactivité locale (souris/clavier) — communication à sens unique (Desktop interroge le Pi, jamais l'inverse).

## 2026-07-06 — Suivi de projet dans ClickUp

Le découpage en tâches n'est pas géré dans un TODO du repo mais dans ClickUp, dans une logique d'apprentissage de la méthode de travail (pas seulement de la technique).

## 2026-07-06 — Next.js 16 / React 19 (au lieu d'une version antérieure ciblée dans le plan initial)

Le scaffold (`create-next-app@latest`) a installé Next.js 16, plus récent qu'anticipé au moment du plan. Différences notables actées : Turbopack par défaut (plus besoin du flag `--turbopack`), Tailwind v4 configuré nativement en CSS (`@theme` dans `globals.css`, pas de `tailwind.config.ts`), et un nouveau modèle expérimental "Cache Components" qu'on n'active pas (on reste sur le comportement de cache standard, plus proche de ce qui était prévu dans le plan).
