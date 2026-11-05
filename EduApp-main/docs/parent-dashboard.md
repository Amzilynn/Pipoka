# Tableau de bord Parent — prototype de démonstration

## Comportement

Le Parent présente un enfant à la fois. Le sélecteur « Démonstration » permet de tester les trois profils fictifs. Chaque profil possède un parcours initial cohérent, construit une seule fois à partir des activités disponibles et daté sur les six jours précédant la première ouverture.

Les parties initiales portent `source: demo` et la mention « Exemple ». Les parties réellement terminées portent `source: recorded`. Les deux alimentent le parcours de démonstration ; elles restent identifiables séparément. Les compteurs ne sont donc pas présentés comme des observations réelles de l’enfant.

Les barres Parent et Enfant comptent les activités différentes terminées dans chaque domaine, depuis le début. Refaire une activité ajoute une partie et des étoiles, sans avancer une seconde fois la barre. Aucun jeu n’est bloqué lorsque le parcours est complet. Le filtre Parent agit sur les compteurs de pratique et les dernières parties ; le parcours conserve sa valeur globale, et le graphique affiche toujours les sept derniers jours.

Les résultats numériques des mini-jeux ne sont plus mis en avant : plusieurs jeux attribuent une note fixe. L’historique affiche la partie terminée. Les barres ne représentent pas la maîtrise d’une compétence et les objectifs individuels ne sont pas validés automatiquement.

## Sauvegarde partagée

`src/bublii/data/progress.js` contient le catalogue utilisé pour compter les activités, la préparation des exemples, la migration, les dates et le calcul des parcours. `BubliiContext.jsx` sauvegarde les profils dans `localStorage`, sous la clé versionnée `bubliiProfilesV2`. Le rôle reste propre à l’onglet ; le choix d’enfant est également conservé localement.

À la première ouverture de cette version, les anciens réglages et les parties datées de l’ancienne session sont conservés, puis les anciens exemples sans date sont remplacés. Une fois enregistrées, les dates des exemples ne bougent plus aux actualisations. Elles vieillissent normalement : après une semaine sans partie, le graphique peut donc être vide.

L’historique n’est plus limité à dix entrées. La conservation reste locale au navigateur, sans authentification, serveur ou synchronisation entre appareils. Effacer les données du site efface ce suivi. Le stockage privé ou saturé peut empêcher une sauvegarde durable ; le contexte tente alors une sauvegarde dans la session de l’onglet.

Le format des profils et des résultats reste compatible avec l’ESMS, dont l’écran n’est pas modifié. Dans l’Enfant, seuls les repères de parcours sont ajoutés sur l’accueil. Le relais `ActivityScreen.jsx` utilise désormais `score ?? 3` pour préserver un vrai zéro transmis par un jeu.

## Présentation

Les styles `parent-*` agrandissent les textes et associent le vert doux à des touches de bleu, corail et jaune. Les détails d’interprétation restent dans la rubrique dépliable. Les réglages sont liés au profil actif et réutilisent les actions existantes ; leur application effective dépend encore de chaque mini-jeu.

## Sources de conception

Consultées le 4 novembre 2026 :

- Down Syndrome International, recommandations pour l’éducation (2020) : https://ds-int.org/recommendations-for-the-education-of-learners-with-down-syndrome/ — objectifs individuels, participation de la famille et aides adaptées.
- PNDS Trisomie 21 (2020), hébergé par la HAS : https://www.has-sante.fr/jcms/p_3148883/en/trisomie-21 — élaboré par le centre de référence selon une méthodologie proposée par la HAS, sans validation par la HAS.

Ces sources éclairent les choix de présentation ; elles ne valident pas les compteurs de Boblii comme une échelle d’évaluation pédagogique ou clinique.

## Vérifier

Depuis `EduApp-main` :

- `node --test src/bublii/parent/parentMetrics.test.js src/bublii/data/progress.test.js`
- `npm.cmd run build`
- `npm.cmd run dev`, puis ouvrir http://localhost:5173/parent

Contrôles manuels :

1. Vérifier le parcours initial de Léna, les barres, le graphique et les mentions « Exemple ».
2. Ouvrir Grandir → Le matin dans l’espace Enfant, parcourir les étapes puis enregistrer la victoire.
3. Revenir au Parent : une partie de plus, mais le même nombre d’activités différentes puisque ce jeu était déjà découvert.
4. Terminer une activité encore non découverte : la barre du domaine doit avancer des deux côtés.
5. Choisir Noah puis revenir à Léna : les données restent séparées.
6. Changer un réglage, fermer puis rouvrir le site dans le même navigateur et à la même adresse : retrouver le parcours et le réglage.
7. Vérifier ordinateur et tablette, le filtre de période et la navigation au clavier.

Les tests automatisés couvrent les exemples datés, les anciens exemples exclus, les répétitions, les zéros, la migration, la stabilité des dates, la lecture du stockage, les changements de jour à Paris et un historique dépassant dix entrées.

## Suites possibles

De vrais comptes liés Parent/Enfant, une sauvegarde entre appareils, des observations de la famille ou de l’équipe éducative et une mesure explicite des aides reçues demandent un travail partagé. Aucune de ces données n’est déduite des barres de découverte.

Validation : 12 tests Node réussis, compilation Vite réussie et parcours Chrome validé (exemples, réglages, deux parties réelles, répétitions, filtre, profils séparés, retour sans mémoire de session et barres Enfant cohérentes). Affichage contrôlé à 1440, 820 et 390 pixels, sans débordement horizontal ni exception JavaScript non interceptée.
