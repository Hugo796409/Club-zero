# ZERO CLUB

Application de fléchettes entre amis, en français. Interface sombre et vert acide, scores XXL, animations de remise à zéro et de victoire. Code HTML/CSS/JavaScript sans bibliothèque externe, sans compte, sans IA, sans base de données distante.

## Mise en ligne sur GitHub puis Vercel

1. Décompresse `zero-club.zip` sur ton ordinateur.
2. Crée un dépôt GitHub, par exemple `zero-club`.
3. Avec **Add file → Upload files**, dépose le **contenu** du dossier `zero-club` : `dist`, `tests`, `package.json`, `vercel.json`, `server.mjs` et ce guide. Conserve les dossiers. Ne téléverse pas uniquement le ZIP.
4. Sur Vercel, crée un projet et importe ce dépôt GitHub.
5. Paramètres : **Framework Preset = Other**, **Root Directory = racine du dépôt**, **Output Directory = dist**, **Build Command = vide**. Aucune variable d’environnement. La configuration `vercel.json` fournit déjà les paramètres et les en-têtes.
6. Déploie et ouvre l’URL HTTPS donnée par Vercel.

Si tu as envoyé le dossier `zero-club` entier dans le dépôt, choisis ce dossier comme **Root Directory**.

Le projet est livré en code source : aucun dépôt GitHub ni déploiement Vercel n’a été créé à ta place.

Sources officielles consultées le 8 octobre 2026 :
- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/builds/configure-a-build

## Sur iPhone et hors ligne

Ouvre ton URL dans Safari → menu Partager → **Sur l’écran d’accueil**. Active **Ouvrir comme app web** si proposé. Ouvre ensuite cette icône une première fois avec Internet. Attends la mention **Prêt pour le hors-ligne**, puis tu peux jouer sans réseau.

Source Apple : https://support.apple.com/fr-be/guide/iphone/iphea86e5236/ios

Le service worker conserve le code, les styles et les icônes. Les données sont enregistrées dans le stockage local du navigateur. Pas d’images, polices, analytics ou scripts à télécharger ailleurs.

Le hors-ligne exige une première installation réussie sur HTTPS (ou localhost pour le développement). Le navigateur peut supprimer ses données : exporte régulièrement une sauvegarde. Le comportement exact sur ton iPhone reste à tester après mise en ligne.

## Règles implémentées

- Départ à 0, objectif exact : **150, 321 ou 501**.
- Un ou plusieurs joueurs, sans limite arbitraire imposée dans l’interface. Trois fléchettes chacun, dans l’ordre de saisie des joueurs.
- Saisie : simples 1–20, doubles 1–20, triples 1–20, bull 25, double bull 50, raté, bordure et au sol. Le multiplicateur revient sur Simple après chaque lancer.
- Après chaque fléchette qui marque, tout adversaire au même score strictement positif repart à 0. La vérification porte sur le score total, même après une soustraction. Les adversaires ne quittent pas la partie.
- Un raté, une bordure ou une fléchette au sol ne déclenche pas de remise à zéro.
- Si un lancer dépasse la cible, ses points sont soustraits au score avant ce lancer : **318 + 15 donne 303** pour une cible de 321. La volée continue.
- La victoire est immédiate au score exact, même à la première fléchette. Aucun double obligatoire pour finir.
- **Bordure :** 0 point, défi égal au cumul des points lancés jusqu’ici dans la volée, multiplié par l’intensité choisie et arrondi au supérieur.
- **Au sol :** 0 point, défi égal à **deux fois celui de la bordure**. Exemple : 21 points, intensité ×1 → 42 répétitions.
- Une bordure ou chute supplémentaire redéclenche le défi sur le cumul courant. Les points des dépassements comptent dans le cumul du défi. Le cumul repart à zéro au tour suivant.
- Intensité ×0,5, ×1 ou ×2. À ×0,5, 3 points donnent 2 répétitions pour la bordure et 4 au sol.
- Plafond facultatif, désactivé par défaut. Il s’applique au résultat final, y compris au défi doublé au sol.
- Pompes, squats, abdos, burpees, fentes, jumping jacks, montées de genoux ou exercice personnalisé. Chaque défi peut être passé.

Les cas particuliers ci-dessus explicitent les choix de cette version ; ils se modifient principalement dans `dist/engine.js`.

## Sauvegarde et classement

- Sauvegarde après chaque action et reprise de la partie à la réouverture.
- Joueurs mémorisés : retrouve-les au démarrage d’une nouvelle partie. Les noms identiques (sans tenir compte des majuscules) réutilisent le même profil. Deux personnes doivent utiliser des noms distincts.
- Classement par victoires, puis remises à zéro infligées. Seules les parties terminées sont comptées, tous modes confondus.
- Historique avec scores finaux et détail des lancers.
- Annulation des lancers et changements de joueur. Annuler un lancer gagnant retire immédiatement cette victoire de l’historique et du classement.
- **Mes données → Exporter la sauvegarde** produit un JSON. L’import restaure les joueurs, parties, classement et partie en cours, après confirmation du remplacement.
- Les données ne sont pas synchronisées entre appareils ou navigateurs. Partager le lien partage l’application, pas les scores. Un effacement des données du site peut les supprimer. En cas de stockage saturé, un avertissement demande d’exporter.

## Tester sur ordinateur

Avec Node.js installé, ouvre un terminal dans ce dossier :

```sh
npm start
```

Puis ouvre http://localhost:3000. Aucune installation de dépendances nécessaire. N’ouvre pas `index.html` directement avec un double-clic : les modules et le service worker ont besoin d’un serveur.

Tests :

```sh
npm test
```

## Fichiers

- `dist/index.html` : entrée de l’application.
- `dist/style.css` : identité visuelle, responsive et animations, respect du réglage « réduire les animations ».
- `dist/app.js` : interface, sauvegarde, historique et classement.
- `dist/engine.js` : règles du jeu, indépendantes de l’interface.
- `dist/sw.js` : cache hors ligne.
- `dist/manifest.webmanifest` et icônes : installation sur l’écran d’accueil.
- `vercel.json` : publication du dossier `dist` et en-têtes.
- `tests/` : scénarios automatisés des règles, parcours d’interface simulés et cache hors ligne simulé.

## Mettre l’application à jour

Modifie les fichiers, puis envoie les changements sur GitHub. Pour une nouvelle version, change `zero-club-v1` en `zero-club-v2` à la fois dans `dist/sw.js` et dans la vérification du cache à la fin de `dist/app.js`. Ne change pas `KEY='zero-club-v1'`, qui désigne les données des joueurs. Ferme les anciens onglets et rouvre l’application avec Internet pour activer la mise à jour. Le service worker attend la fermeture de l’ancienne version pour éviter de mélanger deux versions.

## Vérifications de cette livraison

Tests automatisés des règles et des parcours principaux ; vérification de la présence des huit ressources hors ligne, avec simulation d’un réseau indisponible. La vérification de syntaxe JavaScript a également été effectuée.

L’affichage visuel réel et l’installation sur Safari/iPhone n’ont pas été vérifiés ici. Les tests d’interface emploient un document simulé, et les tests hors ligne un cache simulé ; ils ne remplacent pas un essai sur téléphone. L’intégration WebMCP facultative (lecture des scores lorsqu’un navigateur la propose) n’a pas pu être vérifiée dans un navigateur compatible ; elle n’est pas nécessaire pour jouer.
