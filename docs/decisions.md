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

## 2026-07-08 — Page `/infra` dédiée plutôt qu'une simple carte projet

L'infrastructure perso (Pi/NAS/Desktop/Kali) méritait plus qu'une carte descriptive : le *pourquoi* des choix (veille asymétrique, exposition minimale du Pi) est aussi intéressant que le *quoi*. Ajout d'un nouveau type de lien `Project.links.page` (interne, via `next/link`, sans icône ↗ ni nouvel onglet — contrairement à `repo`/`demo`/`board` qui sont tous externes) pour que `ProjectCard` puisse pointer vers une page du site lui-même plutôt qu'une URL externe.

Le narratif de `/infra` ne mentionne aucune IP ni nom d'hôte réel — cohérent avec le principe déjà acté pour les projets professionnels (anonymiser par défaut).

## 2026-07-08 — Script de cartographie réseau : Mermaid plutôt qu'une dépendance client

Vincent voulait un script perso (hors de ce dépôt, dans sa bibliothèque de scripts) qui scanne le LAN (`nmap`) et pipe le résultat vers un outil de visualisation, pour illustrer `/infra`. Choix : sortie en **Mermaid** (texte), pas d'intégration d'un renderer Mermaid côté client dans le site — ça aurait ajouté une dépendance JS (`mermaid`, plusieurs centaines de Ko) juste pour un diagramme qui ne change presque jamais. À la place : le script génère le `.mmd`, Vincent le rend une fois en SVG statique (Mermaid Live Editor, `mmdc`, ou export Obsidian) et le commit comme n'importe quelle autre image de projet (`Project.screenshot`) — cohérent avec le choix déjà fait ailleurs (`content/*.ts`) de préférer des données statiques versionnées à du rendu dynamique.

Le script (`homelab-network-map.sh`, dans la bibliothèque perso de Vincent, pas dans ce dépôt) a un mode `--public` qui remplace IP/hostnames réels par des rôles génériques (via un fichier de correspondance local, jamais commité) — c'est ce mode qui doit être utilisé pour tout ce qui finit sur le site public.

## 2026-07-08 — Quatrième projet professionnel (WikiLAB) après revue de confidentialité

Vincent a retrouvé WikiLAB (plateforme de gestion documentaire, réalisée chez Thales AVS dans le cadre de sa licence — dépôt `wikilabgroup/wikilab`, sans historique git, extrait et inspecté avant publication, même démarche que pour les deux projets Qualitanie.

**Revue** : pas de nom réel d'employé ni de collègue trouvé (plus propre que les deux précédents). Deux points relevés :
- Le namespace du dépôt (`wikilabgroup`) et la nature du projet indiquent un travail **en équipe**, pas solo — confirmé par Vincent. Contrairement aux deux projets Qualitanie (solo confirmé), la description ne doit pas laisser croire à un travail individuel.
- Une capture d'écran du rapport de projet affiche "Ressources SILAB" (nom d'une ressource interne Thales) dans la barre de navigation — pas une donnée personnelle, mais un nom interne non public.

**Décision** : même traitement que les deux projets Qualitanie — carte descriptive générique, pas de lien vers le dépôt, pas de capture d'écran, pas d'extrait de code (le rapport montre aussi une chaîne de connexion MongoDB avec identifiants — factices, mais à ne pas afficher par principe). La description précise "réalisée en équipe" pour ne pas s'attribuer un travail collectif.

## 2026-07-10 — Sous-pages projet plutôt qu'image intégrée à la carte

L'image du graphe de connaissances AlicIA intégrée directement dans `ProjectCard` (cf. entrée du 2026-07-08) cassait la cohérence visuelle de la grille `/projects` (une carte beaucoup plus haute que les autres). Décision : dès qu'un projet a "des éléments à mettre" (image, texte plus long, contexte), il obtient sa propre sous-page plutôt que d'alourdir sa carte — réutilise le mécanisme `Project.links.page` déjà introduit pour `/infra`. `ProjectCard` revient à un format uniforme (logo + description courte + stack + liens), et le `screenshot` sur `Project` est retiré (mort après ce changement).

Première application : `/alicia`, avec un vrai texte d'accueil (pas juste une liste technique) et l'image du graphe de connaissances en contexte, plutôt que la seule vignette compacte de la carte.

## 2026-07-10 — Capture LangSmith recadrée avant publication

Vincent a fourni une capture d'écran d'une vraie trace LangSmith (pipeline LangGraph classifier/writer/critic/router, mélangeant un modèle local Ollama et un modèle externe) pour illustrer `/alicia`. La capture brute montrait toute la fenêtre du navigateur : onglets ouverts (facturation OpenAI, Anthropic, Trello, Drive) et son adresse e-mail dans la barre latérale de LangSmith. Recadrage (`ffmpeg`, exécuté en WSL car les chemins Windows via UNC ne s'écrivent pas bien depuis ffmpeg — passage par `/tmp` puis copie) pour ne garder que le panneau de trace, sans chrome navigateur ni e-mail — même logique que le principe déjà acté : ne montrer que ce qui est nécessaire à l'illustration.

## 2026-07-10 — Rafraîchissement CV (About) + e-mail de contact

Nouveau CV fourni par Vincent, sensiblement plus détaillé que le précédent (titre "Ingénieur Infrastructure & DevOps", compétences élargies — ELK, Grafana, MCP/RAG, HTTPS/HSTS —, expériences enrichies avec des exemples concrets chiffrés). `content/experience.ts` et `app/about/page.tsx` mis à jour en conséquence.

Le nouveau CV liste `vincent.hernandes@gmail.com` comme contact, alors que le site utilisait jusqu'ici `vincent.hernandes@protonmail.com`. Mis à jour pour correspondre au CV (considéré comme la source la plus à jour) — à confirmer avec Vincent si ce n'était pas intentionnel.

## 2026-07-10 — Photo "À propos" oui, vCard non

Vincent a fourni une photo perso (déjà recadrée en carré, `avatar_512.jpg`, préparée à l'avance dans son dossier `cv-vincent`) et un fichier `.vcf` pour enrichir `/about`. La photo est intégrée en avatar rond à côté du titre. Le `.vcf` n'est **pas** publié : il contient le numéro de téléphone de Vincent en clair, alors qu'il avait explicitement demandé de ne pas afficher son téléphone sur le site (cf. plus haut, refonte du contenu "À propos"). Retenu comme principe : un champ exclu du texte de la page reste exclu même via un biais différent (fichier téléchargeable) — à publier seulement si Vincent le redemande explicitement, éventuellement expurgé du téléphone.

## 2026-07-10 — Chatbot renommé "Gabrielle", backend basculé sur llama.cpp (Pi)

Vincent a partagé (hors de ce dépôt) le contexte de son méta-projet personnel d'agents IA : dans son organisation interne, **Gabrielle** est le nom qu'il donne au rôle d'accueil que joue son IA sur ce site précis, distinct d'autres rôles internes qui restent non publiés (règle de visibilité de son cru : rien de ce contexte n'est publiable sans son feu vert explicite, note par note). Vincent a donné ce feu vert précisément pour "Gabrielle", donc le chatbot public est renommé en conséquence (`lib/chatPrompt.ts`, `ChatWidget.tsx`, mention sur `/alicia`) — seul ce nom est publié, pas le reste de cette organisation interne.

Changements :
- **Ouverture automatique** de `ChatWidget` à l'arrivée sur le site (`open` initialisé à `true`), avec le message d'accueil de Gabrielle qui assume franchement ses limites.
- **Backend basculé du Desktop (Ollama, réveillé par Wake-on-LAN) vers un serveur llama.cpp sur le Raspberry Pi lui-même** (`lib/llamaCpp.ts`, remplace `lib/aliciaLite.ts`) : le Pi étant déjà allumé 24/7, tout le mécanisme de réveil/attente (503 "waking", `WakingIndicator`, polling côté `ChatWidget`) devient inutile pour le chat et a été retiré de ce chemin. Le petit modèle visé (0.5B) et le RAG documentaire sont une responsabilité du serveur llama.cpp lui-même — ce dépôt reste un simple proxy HTTP (même philosophie que l'ancien `aliciaLite.ts`), pas de logique de retrieval dans Next.js.
- Endpoint ciblé : `POST {GABRIELLE_LLAMACPP_URL}/v1/chat/completions` (API compatible OpenAI exposée par `llama-server`), configurable par variable d'env, défaut `http://127.0.0.1:8080` (hypothèse : conteneur sibling sur le même Pi — à ajuster une fois le service réellement en place).

## 2026-07-10 — Retrait complet du réveil Desktop (devenu orphelin)

Suite à la bascule du chat vers llama.cpp/Pi, `wakeTargets.desktop`, `/api/wake`, `/api/activity` et `scripts/desktop-sleep-watcher.ps1` n'avaient plus aucun appelant réel — c'était leur seul usage concret sur le site en prod (Kali n'est pas réveillable automatiquement, cf. décision du 2026-07-06, donc n'a jamais emprunté ce chemin). Vincent a tranché : retrait plutôt que dormance.

Supprimés : `lib/wol.ts` (magic packet, plus aucun appelant), `app/api/wake/`, `app/api/activity/`, `scripts/desktop-sleep-watcher.ps1`, `components/WakingIndicator.tsx` (orphelin depuis le retrait du flux d'attente côté chat). `lib/wakeTargets.ts` simplifié à Kali seul (`WakeTargetName` n'a plus qu'une valeur). Champ `ServiceTarget.wakeTarget` retiré de `content/services.ts` (jamais renseigné par aucun service). `docs/architecture.md` et `README.md` mis à jour pour ne plus mentionner le Desktop comme machine réveillable.

## 2026-07-10 — Icônes maison pour Gabrielle/Raphaël/Mickaël (pas d'images tierces)

Premier essai : des photos trouvées en ligne (figurines/scans manga) pour représenter les trois rôles internes d'AlicIA sur `/alicia`. Écarté par Vincent — ce sont des visuels d'œuvres tierces sous droits, pas adaptés à une identité visuelle du site. Remplacés par `components/EntityIcons.tsx` : trois badges SVG maison (mêmes teintes que le reste du site — fond `#0a0a0a`, accent cyan `#06b6d4`), une forme géométrique simple et distincte par rôle (cercle/triangle/losange) plutôt qu'une illustration littérale — volontairement abstrait, cohérent avec le principe "mystérieux" demandé, et ne présuppose rien du rôle réel de chacun (seuls les noms sont couverts par le feu vert de Vincent, cf. décision précédente).

Chaque badge est accompagné d'une bulle avec une phrase qui définit le personnage sans décrire sa fonction réelle. L'icône de Gabrielle est réutilisée dans `ChatWidget` (en-tête et bouton flottant) pour une identité visuelle cohérente entre l'"entrée" (le chat) et la page `/alicia`.

## 2026-07-10 — Renommage `/alicia` → `/labia`, contenu élargi au labo et aux autres agents

Vincent a demandé de renommer la carte projet "AlicIA" en **LabIA** : le projet ne parle plus seulement de la résidente (AlicIA) mais du laboratoire dans son ensemble, y compris les autres assistants IA avec qui il collabore. Route déplacée `app/alicia/` → `app/labia/`, slug `content/projects.ts` `alicia` → `labia`.

Nouveau contenu, avec l'accord explicite de Vincent (au-delà du seul nom "Gabrielle" couvert précédemment) :
- Section **"AlicIA, la résidente"** : reprend l'ancien contenu (OpenClaw/Ollama, Gabrielle, les trois rôles internes en mystère — inchangé, toujours pas de détail fonctionnel sur Raphaël/Mickaël).
- Nouvelle section **"Les autres agents du labo"** : Claude (cadrage/revue/doc, a construit une partie du site), Gépéto (GPT via Codex, évaluateur/challenger), Gemini (consultation ponctuelle). **Mistral volontairement omis** : d'après le contexte partagé par Vincent, pas encore branché en pratique — cohérent avec le principe déjà appliqué à LangGraph/LangSmith de ne pas présenter comme acquis ce qui ne l'est pas.
- Mention du prochain chantier (graphe d'échanges inter-agents) dans "Chantier en cours".

L'ancien lien ClickUp (`Project.links.board`) retiré : ce n'était pas le bon outil (Vincent suit ce projet sur Trello, pas ClickUp) — en attente du lien public Trello.

## 2026-07-10 — Board Trello public branché, section AlicIA réécrite d'après son contenu réel

Vincent a rendu son board Trello dédié public (`https://trello.com/b/oCFRPLk6/alicia-🧪`, réglage de visibilité Trello — contrairement à ClickUp, pas un instantané figé mais un lien live) et l'a donné comme référence : AlicIA y est présentée bien plus richement que ce qu'on avait sur le site — pas juste un agent technique (OpenClaw/Ollama), mais un travail méthodique sur son identité (fondations mémoire/sécurité/journal, portrait et charte de personnalité, cartographie des styles de communication, expérimentations documentées) avec des pistes futures (plus expressive, plus autonome, multimodale, LabIA comme écosystème).

Section "AlicIA, mon projet principal" réécrite pour reprendre cette structure (Fondations / Identité / Communication / Expérimentation), avec les pistes futures en teaser. `Project.links.board` de la carte LabIA pointe maintenant vers ce board Trello. Contenu tiré directement du board via son endpoint JSON public (`{url}.json`), pas de contenu privé du vault Obsidian LabIA impliqué ici — source différente de celle couverte par `adr-005-visibilite-publication`, déjà rendue publique par Vincent lui-même.

Bug d'espace JSX (même famille que les précédents) recontré une nouvelle fois sur 4 items de liste avec un code source pourtant identique — confirmé octet pour octet identique entre un cas cassé et un cas correct, cause exacte non élucidée (comportement de collapse de React sur des textes multi-lignes). Fix systématique : `{" "}` explicite après chaque `</strong>` suivi d'un tiret, plutôt que de compter sur l'espace littéral.

## 2026-07-10 — Retrait des mentions "Claude a construit ce site"

Vincent a fait remarquer (à raison, avec humour) que le texte publié sur `/labia` et la description de la carte LabIA se mettaient un peu trop en avant côté "Claude a construit une bonne partie de ce site". Retiré des deux endroits (intro `/labia`, carte "Les autres agents du labo", `content/projects.ts`) — Claude reste mentionné comme collaborateur (cadrage/revue/documentation), sans revendication sur la paternité du site.

## 2026-07-10 — `/infra` allégée : retrait des détails techniques ("secrets de cuisine")

Vincent ne voulait plus laisser de détails techniques précis sur l'infra en accès public — même anonymisés, ce sont des indications utiles à un attaquant (mécanisme SSH pour la veille de Kali, partage de certificat TLS entre NAS et Pi, logique exacte du script de veille Desktop, présence et méthode du scanner réseau `nmap`). Retiré des sections "Pourquoi ces choix" et "Diagramme du réseau" (section supprimée entièrement), ainsi que la mention de l'agent IA réel hébergé sur Desktop (déjà couverte, en mieux, sur `/labia`). Ne reste que la vue d'ensemble des 4 machines/rôles (déjà générique) et une phrase de principe sans mécanique exposée.

## 2026-07-10 — "En dehors du code" : deux blocs distincts avec logos officiels

Les deux engagements bénévoles (Glénans, Restos du Cœur) séparés en deux blocs distincts, chacun avec un lien vers le site officiel de l'association. Logos récupérés directement depuis les sites officiels (`glenans.asso.fr` → `logo-glenans-white.svg`, variante blanche déjà adaptée à un fond sombre ; `restosducoeur.org` → `logo.svg`) et stockés dans `public/images/logos/` — téléchargement fait avec l'accord explicite de Vincent (cf. échange précédent).

## 2026-07-10 — Logo AlicIA : retiré de LabIA (carte + page), remis sur la mention d'AlicIA

Vincent a signalé que le logo d'AlicIA (la loupe) appliqué à la carte "LabIA" sur `/projects` et à l'en-tête de `/labia` ne convenait plus : LabIA est le labo dans son ensemble, ce logo est celui d'AlicIA spécifiquement. Retiré des deux endroits (`content/projects.ts` : champ `logo` retiré ; en-tête `/labia` : image retirée, juste le titre).

Précision de Vincent ensuite : le logo reste pertinent partout où AlicIA elle-même est nommée. Remis en petit à côté du titre de la section "AlicIA, mon projet principal" sur `/labia` — le logo habille la mention d'AlicIA, pas le titre générique de la page/carte LabIA.

## 2026-07-10 — Rôle de Claude sur `/labia` rééquilibré

Vincent a jugé la description de Claude ("cadrage, revue, documentation") sous-dimensionnée par rapport au rôle réellement tenu (implémentation de bout en bout : code, architecture, contenu, revues de confidentialité). Reformulée en conséquence — reste factuelle et non revendicative sur la paternité du site (cf. décision "Retrait des mentions Claude a construit ce site" plus haut) : décrire ce que fait Claude n'est pas la même chose que s'attribuer le site, tant que ça reste présenté comme sous la direction de Vincent.

## 2026-07-10 — Gépéto et Gemini précisés, par cohérence

Suite au rééquilibrage du rôle de Claude, Vincent a voulu la même précision pour les deux autres — mais contrairement à Claude, je n'ai pas de visibilité directe sur ce qu'ils font réellement, donc j'ai demandé plutôt que de deviner. Réponses de Vincent :
- **Gépéto** (GPT, via Codex) : pas un simple évaluateur/challenger comme décrit initialement (d'après `labia-contexte.md`) — un **codeur autonome**, qui écrit du code directement sur des tâches déléguées.
- **Gemini** : encore en test, nécessite d'être cadré précisément — pas encore un usage stable. Formulé pour rester honnête sur ce stade (même principe que "ne pas présenter comme acquis" déjà appliqué à LangGraph/LangSmith et à Mistral).

## 2026-07-10 — "Comment je pense mes notes" réécrite d'après la méthode réelle

Vincent a demandé de reprendre cette section d'après "l'existant public" — recherche faite dans le vault Obsidian `Claude` (celui de cette session, distinct du vault privé `LabIA` couvert par `adr-005-visibilite-publication` : celui-ci sert de KB partagée sur les concepts IA/LLM, déjà source du graphe de connaissances affiché sur la page). Découverte : le pipeline d'export public prévu par l'ADR-005 (`LabIA/scripts/export-public.mjs`) existe déjà mais n'a encore aucune note à exporter (aucune note du vault `LabIA` n'a `visibility: public`) — non utilisé ici, contenu tiré directement des notes du vault `Claude`.

Ancienne description ("notes atomiques reliées, organisées en cartes, Zettelkasten") remplacée par une description fidèle à la structure réelle observée : chaque concept est une note avec définition en une phrase, explication liée aux notions voisines, et source citée quand pertinent ; les "cartes" sont des points d'entrée thématiques qui tracent un chemin de lecture sans dupliquer le contenu. Ajout d'une mention de `carte-comment-je-fonctionne.md`, qui applique la méthode de façon introspective (retrace la machinerie d'un LLM à travers les notes existantes) — trouvaille sympathique en lisant le vault, gardée comme illustration concrète.

**Rectification de Vincent** : ma première rédaction présentait ce vault comme sa base de connaissances perso sur l'IA — inexact. C'est en réalité un **vault introspectif construit en collaboration avec un agent**, pensé pour que l'IA elle-même y retrouve une compréhension structurée de son propre fonctionnement. Reformulé en conséquence ; la carte "comment je fonctionne" est désormais présentée comme écrite du point de vue de l'agent lui-même ("vue depuis l'intérieur"), pas comme une note de Vincent sur l'IA. Bug d'espace JSX (même famille, `</em> —`) corrigé au passage sur un paragraphe voisin.

**Deuxième rectification** : Vincent tient **plusieurs** vaults introspectifs (un par IA) — celui-ci n'est qu'un exemple parmi d'autres, pas un projet unique/exceptionnel. Présentation pondérée en conséquence ("parmi plusieurs vaults introspectifs que je tiens (un par IA), celui-ci...") plutôt que de le présenter comme LE vault introspectif de Vincent.

## 2026-07-10 — Image de la trace LangSmith cliquable (vérification)

La capture de la trace LangSmith sur "Chantier en cours" est affichée en largeur réduite (rendue à 4877px de large dans un conteneur ~800px) — les détails fins du panneau de trace ne sont pas lisibles sans zoomer. Ajout d'un lien (`<a target="_blank">` autour de l'`<Image>`) qui ouvre le fichier PNG original en pleine résolution dans un nouvel onglet, avec un indice visuel au survol ("Voir l'image originale ↗", overlay semi-transparent). Pas de composant lightbox custom — juste un lien vers le fichier source, plus simple et suffisant pour le besoin (vérifier le détail de la trace).

## 2026-07-10 — Compétences clés enrichies (About)

Ajouts demandés par Vincent : Java/C (Développement), Ansible (DevOps), Arch Linux/IBM AS-400 (Systèmes), Split-DNS (Réseaux), certification ITIL Foundation (Outils). PLG (Prometheus/Loki/Grafana) remplace le tag "Grafana" seul (redondant sinon). Suite à discussion, "DNS" retiré au profit du seul "Split-DNS" (Vincent a confirmé) — les tags restent des mots-clés courts et scannables plutôt que des phrases techniques complètes ; le détail "multi-horizons" reste dans la description narrative du poste Qualitanie où le contexte est présent.

Ajouts complémentaires : **Ada** et **JavaScript / React** (Développement, distinct de "JavaScript / Angular" déjà présent — React est notamment la stack de ce site lui-même).

## 2026-07-10 — "En dehors du code" : bénévolats détaillés

Vincent a fourni des éléments bruts à mettre en forme pour chaque engagement :
- **Glénans** : au-delà du monitorat, il est membre du comité de secteur et contribue à la vie de la base et de la communauté — ajouté en seconde partie de phrase.
- **Restos du Cœur** : précision sur le rôle réel de chauffeur (livraison sur la zone départementale, parfois au-delà) plutôt que la mention générique "chauffeur-logisticien" seule.

Alignement des logos en `items-start` plutôt que `items-center` (texte sur deux lignes désormais, le logo doit rester ancré en haut plutôt que centré verticalement).

## 2026-07-10 — Suivi du projet hernandes.cloud basculé sur Trello

Même bascule que pour LabIA (cf. décision du 2026-07-10 sur le board Trello public) : l'ancien lien ClickUp de la carte "hernandes.cloud" remplacé par le board Trello dédié (`https://trello.com/b/fcf3lkjH/🧪-refonte-wwwhernandescloud`). Les deux projets actifs du site ont maintenant chacun leur board Trello public en suivi, plus de lien ClickUp sur `/projects`.

## 2026-07-11 — Vrais personae graphiques pour Gabrielle/Raphaël/Mickaël

Vincent a fourni un pack d'images (`personae_AlicIA.zip`, produit avec Claude Design) : un avatar cohérent par rôle (soleil levant doré pour Gabrielle, atome teal pour Raphaël, boussole rouge pour Mickaël — même univers visuel, fond sombre, accent couleur distinct), en plusieurs résolutions (avatars carrés 64 à 512px, vignettes bannière 1280x720/800x450/512 avec nom + accroche : "Annonce · Accueil", "Connaissance", "Protection · Arbitrage"). Remplacent les icônes SVG maison (`components/EntityIcons.tsx`, supprimé) sur la section "D'autres présences" de `/labia` et dans `ChatWidget` (en-tête + bouton flottant).

Seuls les avatars 256px sont intégrés pour l'instant (`public/images/personae/{gabrielle,mickael,raphael}.png`) — Vincent a précisé ne pas avoir encore défini tous les cas d'interaction personae/visiteur, donc pas d'intégration des vignettes bannière ni de nouveau comportement pour l'instant : remplacement d'asset à l'identique de la structure existante, rien de plus.

## 2026-07-11 — Personae cliquables : mystère remplacé par une vraie présentation

Vincent est revenu sur le parti-pris "mystérieux" : les visuels des personae doivent être cliquables et ouvrir une vraie présentation de chaque personae. (Terminologie : "sigil" désignait à l'origine de petites icônes vectorielles du pack fourni, jamais utilisées — ce qui est réellement cliquable est le HUD animé, cf. entrée suivante.) Discussion avant implémentation (demandée explicitement par Vincent, peu à l'aise avec ce type de décision UX) : recommandation d'une modale (plutôt qu'une sous-page par personae, trop lourde pour 3 courtes bios, ou un survol, inutilisable sur mobile), réutilisant les vignettes bannière du pack (jusque-là inutilisées) comme visuel, avec un paragraphe de description en dessous — et de garder la description au niveau personnalité/rôle perçu plutôt que la mécanique interne exacte (cohérent avec le principe de confidentialité par défaut déjà appliqué au vault LabIA). Vincent a validé cette direction avant tout code.

Implémentation : nouveau composant client `components/PersonaGrid.tsx` (extrait de `/labia`, qui reste un Server Component pour le reste) — grille de 3 boutons (au lieu de `<div>` statiques) ouvrant une modale plein écran (vignette 800×450 + nom + accroche + description, fermeture par clic sur le fond ou bouton ✕). Texte d'intro de la section adapté ("cliquez sur un visage pour en savoir plus sur chacun" au lieu de "je n'en dis pas plus ici"). Descriptions rédigées pour chaque personae en restant sur le registre personnalité (ex. Mickaël : "il observe ce qui se passe, pose des limites, et intervient quand quelque chose sort du cadre attendu" — pas de mention de mécanique de surveillance/véto précise). Build + lint vérifiés propres, interaction testée pour les trois personae dans le navigateur.

Description de Gabrielle précisée à la demande de Vincent : pas juste "elle tourne sur le Pi", mais l'angle "le chatbot peut la requêter directement" — sans réveil ni attente, par contraste avec l'ancien système Desktop/Wake-on-LAN retiré plus tôt dans la session. Texte final : "Elle tourne via llama.cpp sur le Raspberry Pi qui héberge ce site — toujours allumé, donc le chatbot peut la requêter directement, sans réveil ni attente." (Mention retirée ensuite de la bio publique — trop technique pour cet emplacement — mais le backend réel tourne bien ainsi.)

## 2026-07-11 — Mise en service réelle du backend de Gabrielle

Vincent a déployé `llama-server` sur le Pi avec un modèle Qwen2.5 0.5B quantifié (cohérent avec `GABRIELLE_MODEL` déjà configuré dans le code). Pas de prompt système par défaut côté serveur sur cette version de llama.cpp — le prompt reste porté côté client (`lib/chatPrompt.ts`), sans duplication à gérer.

Plusieurs problèmes de connectivité réseau interne résolus (le service tourne nativement sur l'hôte, le site tourne en conteneur) : mode serveur vs CLI, interface d'écoute du service, et une règle de pare-feu local manquante. Détails pratiques (adresses, ports, règles) volontairement non détaillés ici — cohérent avec le principe déjà acté de ne pas publier de détails d'infra exploitables (cf. décision "`/infra` allégée"). Testé de bout en bout via `/api/chat` en prod : réponse `200`, génération réelle du modèle. Qualité de réponse perfectible (modèle 0.5B, suit imparfaitement le prompt système) — attendu, déjà annoncé dans la bio publique de Gabrielle ("un petit modèle local, pas un oracle"), pas traité comme un bug.

## 2026-07-11 — HUD interactif des personae (états + yeux qui suivent la souris)

Vincent avait donné un pack d'assets plus riche que ce qui avait été exploité (avatars/vignettes statiques) : un projet Claude Design complet avec un composant déjà interactif, `HUD Agent.dc.html` — "l'anneau embarquable". Format propriétaire de l'outil (`<sc-if>`, bindings `{{ }}`, classe `DCLogic`), mais logique entièrement portable : 4 états (idle/pense/parle/alerte) avec une palette et des animations CSS par personae, et une pupille qui suit la souris (calcul de distance au curseur, offset plafonné, `requestAnimationFrame` pour throttle).

Port fidèle en React : `components/PersonaHUD.tsx` (props `persona`, `etat` contrôlé, `followMouse`, `showLabel`, `size` — tout en unités relatives à `size` pour rester net à n'importe quelle taille), animations CSS globales ajoutées à `app/globals.css` (préfixées `persona-*` pour éviter toute collision de nom). Couleurs et détails repris exactement de la source (dont l'asymétrie du contour de l'œil de Mickaël, gris neutre `#C9CCD1` plutôt que rouge — choix du design original, pas une erreur).

Remplace les avatars PNG statiques dans `PersonaGrid` (état `idle` fixe) et dans `ChatWidget` (état piloté par l'activité réelle du chat : `pense` pendant l'attente de réponse, `alerte` en cas d'erreur, `parle` brièvement après réception d'une réponse, `idle` sinon — bouton flottant fermé en `followMouse=false` pour éviter un listener global inutile quand le widget est réduit). Les fichiers sources (`assets/sigil-*.svg`, `assets/silhouette-*.svg`) copiés dans `public/images/personae/assets/` pour usage futur, non câblés pour l'instant. Build + lint propres ; suivi de souris vérifié par dispatch d'un `mousemove` synthétique et lecture du `transform` calculé sur les pupilles.

## 2026-07-11 — Modale personae : la vignette statique devient un HUD animé en cycle

Vincent voulait voir les 4 états sans devoir passer par une vraie conversation avec Gabrielle. La vignette PNG (800×450) dans la modale "en savoir plus" de `PersonaGrid` remplacée par le `PersonaHUD` en grand (160px, sur fond sombre `#12100E` assorti à son propre design), avec un cycle automatique idle → pense → parle → alerte (2,6s par état) tant que la modale reste ouverte, plus un petit libellé texte de l'état courant. Le cycle redémarre à `idle` à chaque ouverture (réinitialisé dans le gestionnaire de clic, pas dans l'effet, pour éviter un `setState` synchrone au montage — corrigé après une vraie erreur ESLint `react-hooks/set-state-in-effect`, pas juste un style). Vignettes PNG plus utilisées mais conservées dans `public/` (pas de raison de les retirer, elles restent correctes). Build + lint propres, cycle vérifié visuellement (transition PENSE → PARLE observée).

## 2026-07-12 — kb.hernandes.cloud (Quartz) : incident de déploiement CI/CD

Le premier déploiement du job CI de `kb.hernandes.cloud` a échoué six fois de suite sur trois causes indépendantes (dossier de build généré non versionné, réutilisation d'un accès SSH restreint à un usage différent de celui prévu, documentation TLS obsolète) avant résolution complète — voir le postmortem détaillé : [`docs/postmortems/2026-07-12-kb-deploy-cicd.md`](postmortems/2026-07-12-kb-deploy-cicd.md). Aucun impact sur `hernandes.cloud`, résolu sans perte de données.
