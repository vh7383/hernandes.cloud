# Postmortem — déploiement CI/CD de kb.hernandes.cloud

**Date :** 2026-07-12 · **Durée :** ~50 min (partie CI) + une session de dépannage nginx/TLS immédiatement après · **Statut :** Résolu

## Résumé

L'ajout d'un nouveau job CI déployant le site statique Quartz sur `kb.hernandes.cloud` a échoué six fois de suite avant résolution complète, sur **trois causes racines indépendantes** empilées : un dossier de build absent du dépôt, une clé SSH partagée verrouillée sur une commande sans rapport, et une documentation de projet obsolète sur la gestion des certificats TLS. Aucun impact sur le site principal (`hernandes.cloud`), resté disponible tout du long — chaque échec était confiné au nouveau sous-domaine, pas encore public.

## Impact

- `hernandes.cloud` (site principal) : **aucun impact**, resté en ligne et fonctionnel tout du long.
- `kb.hernandes.cloud` (nouveau sous-domaine) : indisponible ou incorrect pendant toute la durée de l'incident — soit le build échouait, soit le déploiement échouait, soit (une fois déployé) le sous-domaine servait par erreur le contenu du site principal.
- Aucune donnée perdue, aucun secret exposé.

## Chronologie

| Heure (UTC) | Évènement |
|---|---|
| 10:02 | 1er run : le build échoue — un dossier de cache généré par l'outil (gitignoré par convention) est absent d'un checkout CI frais, alors que le build en dépend. |
| — | Fix : étape ajoutée pour régénérer ce cache depuis un fichier de verrouillage déjà commité. En creusant, un composant déjà désactivé mais toujours référencé pesait à lui seul plusieurs centaines de Mo (historique complet embarqué) ; retiré entièrement, division par ~8 du poids du cache. |
| 10:13 | 2e run : le build passe, mais le transfert vers le serveur échoue immédiatement avec une erreur de protocole générique, sans indice exploitable. |
| — | Diagnostic (faux départs) : l'outil de transfert est bien installé côté serveur ✓ ; aucun script de connexion suspect ✓ ; aucune bannière de connexion personnalisée ✓ ; port/routage écartés (mêmes identifiants qu'un autre job déjà fonctionnel). |
| — | Hypothèse (fausse) : contention — deux jobs se connectent au même serveur en même temps, l'un d'eux (occupé à autre chose) saturerait la connexion. Fix tenté : sérialiser les deux jobs. |
| 10:23–10:29 | 3e et 4e runs : toujours le même échec malgré la sérialisation — hypothèse de contention invalidée. |
| — | Hypothèse (fausse) : le pare-feu bloquerait ou limiterait la connexion (précédent réel plus tôt dans le projet, sur un tout autre service). Vérifié directement sur le serveur : règle en autorisation simple, aucune trace de blocage dans les journaux — écarté. |
| — | **Cause racine trouvée** : la clé SSH réutilisée pour ce nouveau job était déjà utilisée par un job existant, et verrouillée côté serveur à l'exécution d'une commande précise et sans rapport (peu importe ce que le client demande, c'est toujours cette commande qui s'exécute). Cela expliquait à la fois des lignes de sortie inattendues visibles dans les journaux du nouveau job depuis le tout premier échec (un indice présent dès le départ, mal interprété jusque-là), et l'échec de transfert (le serveur ne lançait jamais le bon programme, donc aucune poignée de main de protocole n'avait lieu). |
| 10:44 | 5e run (nouvelle clé dédiée, restreinte à une seule opération sur un seul dossier) : le transfert démarre enfin pour de vrai, mais échoue sur un chemin de destination dupliqué — la restriction côté serveur préfixe déjà le dossier cible, la commande cliente le reprécisait en plus. |
| 10:48 | 6e run : destination simplifiée côté client (laisser la restriction serveur fournir le chemin) → **succès**, tous les fichiers transférés. |
| ~10:53 | Sous-domaine joignable mais sert le mauvais contenu (celui du site principal) — aucune configuration dédiée pour ce sous-domaine, retombée sur la configuration par défaut existante. |
| — | Tentative de configuration TLS suivant la documentation existante — l'outil qu'elle mentionne n'est plus installé sur le serveur. |
| — | Incohérence relevée : le renouvellement automatique des certificats fonctionne depuis longtemps, donc cet outil ne peut pas être simplement absent. Rappel : le projet était passé à un outil différent à un moment non documenté. |
| — | Vérification directe : un certificat couvrant déjà tous les sous-domaines existait, sans qu'il soit nécessaire d'en émettre un nouveau — juste réutiliser les fichiers existants dans une configuration dédiée au nouveau sous-domaine. |
| ~11:00 | `kb.hernandes.cloud` confirmé en ligne, contenu correct. |

## Causes racines

Trois causes indépendantes, chacune masquant la suivante une fois la précédente résolue :

1. **Un dossier généré mais requis au build n'était pas disponible en CI** — écart entre convention locale (dossier gitignoré par réflexe) et besoin réel d'un environnement de build qui repart de zéro à chaque fois.
2. **Réutilisation d'un identifiant d'accès sans vérifier sa portée réelle côté serveur** — l'identifiant semblait générique ("la clé de déploiement du serveur"), alors qu'il était en réalité verrouillé à un seul usage précis. Rien dans le code du job qui le réutilisait ne signalait cette restriction.
3. **Documentation de projet obsolète** — la doc décrivait un outillage TLS qui avait été remplacé depuis un moment, sans mise à jour. A conduit droit dans une impasse de dépannage.

## 5 pourquoi (sur la cause la plus coûteuse en temps)

1. Pourquoi le transfert échouait-il ? → Le serveur ne lançait jamais le programme de transfert attendu.
2. Pourquoi ? → La connexion était systématiquement redirigée vers un script sans rapport avec la tâche demandée.
3. Pourquoi ? → L'identifiant d'accès utilisé est restreint côté serveur à cette seule commande.
4. Pourquoi cet identifiant a-t-il été utilisé pour une tâche qu'il ne permettait pas ? → Il était déjà disponible (réutilisé par réflexe) sans vérifier ses restrictions réelles.
5. Pourquoi cette vérification n'a-t-elle pas eu lieu avant ? → Aucune habitude établie de documenter/vérifier les restrictions d'un accès avant de le réutiliser pour un usage différent de celui prévu à l'origine.

## Ce qui a bien fonctionné

- Chaque hypothèse (contention, pare-feu) a été testée puis **abandonnée sur preuve concrète** plutôt que sur supposition — pas d'acharnement sur une piste fausse une fois infirmée.
- L'indice le plus important (une sortie de commande inattendue dans les journaux d'un job qui n'était censé faire que du transfert de fichiers) était visible dès le tout premier échec réel du problème d'accès — une fois repéré, il a mené directement à la cause racine.
- Une déduction erronée en cours de route ("il faut sûrement réinstaller l'ancien outil") a été directement contestée avec un fait concret ("le renouvellement marche depuis longtemps, donc ce n'est pas ça") — a évité d'installer un outil inutile et redondant avec l'existant.
- Correctif appliqué dans l'esprit du principe de moindre privilège déjà en place sur le projet (un accès restreint existant avait déjà ce même design) plutôt qu'un accès à portée large par facilité.
- Aucun changement risqué n'a été poussé sans confirmation explicite à chaque étape.

## Ce qui a mal fonctionné

- Le message d'erreur de transfert ne donnait strictement aucun indice sur la vraie cause (restriction d'accès côté serveur) — a coûté la majorité du temps de diagnostic sur des pistes plausibles mais fausses.
- La documentation existante affirmait un fait obsolète sans que rien ne l'ait signalé comme périmé — a activement induit en erreur plutôt que de rester simplement incomplète.
- Six itérations correction → nouvelle tentative → observation pour un seul déploiement — chaque cycle coûte plusieurs minutes, ce qui aurait pu être réduit avec une vérification plus systématique des restrictions d'accès dès le premier échec de transfert.

## Actions

| Action | Statut |
|---|---|
| Vérifier les restrictions d'un accès avant de le réutiliser pour un nouveau job, plutôt que de supposer qu'un identifiant existant est générique. | Fait (appliqué immédiatement) |
| Tenir la documentation d'architecture à jour à chaque changement d'infra constaté en cours de route, pas seulement au moment où on l'écrit. | À faire au fil de l'eau |
| Si un job produit une sortie inattendue (signe d'un autre programme que celui exécuté), creuser cet indice en premier plutôt qu'en dernier recours. | Leçon à retenir |

## Leçons apprises

Un identifiant d'accès partagé n'est pas juste une clé abstraite — il peut porter des restrictions concrètes côté serveur qui ne sont visibles nulle part dans le code qui le réutilise. La seule façon fiable de le savoir est de vérifier directement sur la machine cible avant de réutiliser un accès existant pour un usage différent de celui pour lequel il a été créé. Par ailleurs, un indice qui ne colle pas avec ce qu'on attend mérite d'être élevé en priorité de diagnostic, même s'il semble secondaire au premier abord.
