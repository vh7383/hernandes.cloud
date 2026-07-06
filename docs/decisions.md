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

## 2026-07-06 — Abandon du réveil automatique de Kali (Wake-on-Wireless-LAN)

Kali n'a qu'une interface Wi-Fi (pas d'Ethernet filaire disponible). Test réel effectué : le chipset supporte bien le trigger `wake up on magic packet` (confirmé via `iw phy wowlan`), un hook systemd (`/usr/lib/systemd/system-sleep/enable-wowlan.sh`) arme correctement le WoWLAN avant chaque veille, et les logs confirment que `wpa_supplicant` préserve l'association Wi-Fi pendant la veille au lieu de déconnecter (`Do not deauthenticate ... since WoWLAN is enabled`). Malgré cette configuration correcte côté machine, un magic packet envoyé pendant la fenêtre de veille (~5 minutes) n'a pas réveillé la machine — réveil obtenu uniquement par bouton d'alimentation manuel.

Cause probable : la Freebox (routeur) ne relaie pas fiablement les trames broadcast/multicast vers un client Wi-Fi en économie d'énergie (comportement connu, variable selon les box/firmwares) — hors de portée d'un fix côté Kali.

**Décision** : abandon du réveil automatique pour Kali. Le réveil Wake-on-LAN automatisé (`lib/wol.ts`, déclenché depuis le Pi) ne concerne que le **Desktop** (Ethernet filaire, réveil confirmé fonctionnel au niveau pilote — cf. `powercfg /devicequery wake_armed`). Pour Kali/Elastic, `/monitoring` affiche un état "indisponible" quand la machine dort ; Vincent la réveille manuellement quand il veut la montrer (ex. démo à un employeur). Le mécanisme de veille via SSH (`systemctl suspend` déclenché par le Pi, cf. décision "Mécanisme de veille asymétrique") reste inchangé — seul le réveil automatique est abandonné.

**Retest (même jour)** : Kali rapprochée physiquement de la Freebox (signal Wi-Fi fort) puis re-suspendue avec le hook WoWLAN réarmé — toujours aucun réveil après un magic packet (88s d'attente). Écarte l'hypothèse d'un signal Wi-Fi faible ; confirme que la cause est bien côté Freebox/driver, pas la portée radio. Décision d'abandon maintenue définitivement.

## 2026-07-06 — Premier déploiement en production réussi

Bascule complète effectuée le jour même :
- Nouvelle clé SSH dédiée GitHub Actions → Pi, restreinte via `command=` à `/opt/hernandes-cloud/deploy.sh` uniquement (jamais de shell libre), suivant le même principe que la clé Pi → Kali.
- Package `ghcr.io/vh7383/hernandes.cloud` rendu public (cohérent avec le repo déjà public) pour éviter de gérer un credential de pull supplémentaire sur le Pi.
- Deux incidents réseau résolus en cours de route : la redirection de port externe 22 → Pi n'était plus active sur la Freebox (réactivée par Vincent) ; une première entrée `authorized_keys` mal échappée (guillemets cassés par le passage PowerShell → SSH) a été corrigée en transférant la ligne en base64 pour éviter tout problème d'échappement multi-couches.
- nginx basculé de `root /var/www/html` (statique) vers un reverse proxy `proxy_pass http://127.0.0.1:3001` — avec `X-Forwarded-For`/`X-Real-IP` transmis (nécessaire pour que le rate limiting par IP, cf. `lib/rateLimit.ts`, voie les vraies IP visiteurs et non `127.0.0.1`). Ancienne config sauvegardée (`hernandes.cloud.bak-*`), `/var/www/html` conservé intact en fallback, non nettoyé pour l'instant.
- Vérifié après bascule : site principal, `/monitoring` (services réels en ligne détectés), API routes, et absence d'impact sur les autres sous-domaines (`stats.hernandes.cloud` testé, inchangé).

## 2026-07-06 — Services NAS Synology ajoutés + faux positif monitoring corrigé

Ajout de tous les services visibles dans le portail d'applications DSM (Photos, Vidéosurveillance, Synology Drive, File Station, Note Station, Audio Station, Contacts, DSM lui-même), groupés par section sur `/services` ("Raspberry Pi" / "NAS Synology"). Icônes emoji en attendant de vrais fichiers logo. Sous-domaines choisis par alias DSM (`cam`, `photo` existaient déjà ; `audio`, `contacts`, `files`, `notes`, `syno-drive`, `nas` restent à configurer côté DSM — Panneau de configuration > Portail de connexion > Applications). `syno-drive` plutôt que `drive` pour éviter la collision avec Nextcloud, déjà sur `drive.hernandes.cloud`.

**Faux positif découvert en testant** : les sous-domaines pas encore configurés côté DSM s'affichaient quand même "en ligne", parce que nginx (`server_name hernandes.cloud *.hernandes.cloud`) faisait atterrir tout sous-domaine non reconnu sur notre propre site, qui répondait 200 sans distinction de host.

- Fix nginx : `hernandes.cloud` déclaré `default_server` explicite pour le 443 (plutôt que de simplement retirer le wildcard) — sans ça, le vrai repli aurait été le premier bloc 443 chargé par nginx, probablement Nextcloud (`drive.hernandes.cloud`), un comportement moins prévisible que l'existant.
- Fix applicatif : premier essai avec un check générique `x-powered-by: Next.js` — écarté après test réel, `plex.tv` (service externe, pas le nôtre) envoie aussi ce header, ce qui aurait fait passer Plex à tort en "indisponible" (faux négatif). Remplacé par un header propre à ce déploiement précis (`X-Site-Id: hernandes-cloud-self`, injecté via `next.config.ts` → `headers()`), vérifié par `lib/status.ts`.

## 2026-07-06 — Suivi de projet ClickUp : liste dédiée + lien public en instantané

Une liste **hernandes.cloud** créée dans ClickUp (dossier "Projets"), avec un workflow à 4 statuts (Backlog → À faire → En cours → Terminé) — les statuts par défaut de l'espace ne suffisaient pas pour une gestion "classique". Une liste équivalente créée pour **AlicIA**, alimentée depuis son propre journal d'incidents (`ALICIA_CONTEXT.md`).

Limite technique actée : l'intégration MCP ClickUp ne permet pas de créer/nommer des statuts personnalisés par API — uniquement de déplacer des tâches entre statuts existants. Toute la configuration des statuts s'est faite à la main côté UI (plusieurs allers-retours avant d'obtenir une liste propre : les premiers essais ont mélangé statuts d'espace et de liste, ou parasité par un template ClickUp "Portfolio" inadapté — repris de zéro).

Partage public : ClickUp (sur ce plan) ne permet qu'un **instantané** figé, pas une vue live synchronisée. Accepté comme suffisant pour l'instant. Les deux liens (hernandes.cloud, AlicIA) sont exposés sur `/projects`, à côté du lien "Voir le code" — `Project.links.board` dans `content/projects.ts`.

## 2026-07-06 — Projets professionnels ajoutés après revue de confidentialité

Vincent a retrouvé les archives de deux projets menés chez un précédent employeur (infra on-premise pour un client, POC OpenTripPlanner pour un autre) et voulait les valoriser sur le site.

**Revue effectuée avant toute publication** : les deux dépôts (avec historique git complet) ont été extraits et inspectés. Trouvailles :
- Une liste de sources de sauvegarde contenant les **noms réels de 13 employés du client**.
- L'**historique git** révélait le nom d'un collègue (auteur de commits) et l'URL interne du GitLab de l'employeur.
- Un fichier `README.md` du second projet portait une mention `© <client> - Toute reproduction... soumise à autorisation` — ajoutée par Vincent lui-même à l'époque ("pour faire pro"), sans qu'une autorisation de publication n'ait jamais été réellement discutée avec son ancien manager.

**Décision** : ne publier ni le code, ni l'historique git, ni les noms de clients. Les deux projets apparaissent sur `/projects` sous forme de cartes descriptives génériques (secteur anonymisé : "PME", "entreprise de mobilité"), sans lien vers un dépôt — seulement stack technique et description du rôle. Principe retenu : en cas de doute non tranché sur l'autorisation de publier le travail d'un tiers (client, employeur), on **anonymise et on ne montre pas le code**, plutôt que d'attendre une clarification qui n'a pas de date.

Un troisième projet (OSI Water Watch, développé pour l'ONG Objectif Sciences International) a pu être ajouté avec un **lien direct vers le site public** (`Project.links.demo`, rendu "Voir le site ↗") : le site est déjà public, donc aucune question de confidentialité ne se posait.
