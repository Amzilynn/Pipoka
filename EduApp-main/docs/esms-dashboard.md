# Interface Établissement / ESMS

## Conception

Le dossier s’ouvre depuis `/specialiste`. La liste « Choisir l’enfant » utilise un sélecteur natif : clavier, lecteur d’écran et défilement des longues listes sont pris en charge par le navigateur. Aucun nouveau profil fictif n’est créé ; les trois profils communs suffisent pour la démonstration.

Quatre rubriques : vue d’ensemble, objectifs et observations, activités, réglages. Les compteurs et les barres réutilisent les données communes aux espaces Parent et Enfant, sans moyenne ni classement entre enfants. Les exemples sont identifiés. Une barre compte les activités différentes terminées, pas des compétences validées.

Les objectifs, points d’appui et besoins sont les exemples préexistants du profil. Aucun pourcentage d’acquisition ni synthèse automatique ne sont produits à partir des scores des jeux. L’ancienne synthèse qui affirmait un engagement positif sans observation a été retirée.

Les observations sont rédigées par l’utilisateur : auteur, objectif éventuel, contexte, aide apportée, faits observés et prochaine étape. Une prochaine étape est une saisie manuelle, jamais une recommandation clinique générée. Les brouillons sont conservés par enfant pendant la navigation dans l’ESMS, jusqu’à l’actualisation ou la fermeture de la page. Les observations enregistrées sont stockées dans `localStorage`, sous `bubliiEsmsObservationsV1:<childId>`, séparément des profils partagés. Une erreur de sauvegarde laisse le texte dans le formulaire et empêche une fausse confirmation.

Cette conservation est locale : pas d’authentification, de partage effectif avec la famille ou l’équipe, de gestion des permissions, de synchronisation entre appareils ni de dossier institutionnel complet. Les observations enregistrées ne sont pas affichées dans l’espace Parent. Les réglages des jeux, eux, sont bien communs avec le Parent.

## Sources consultées le 4 novembre 2026

- [HAS, Accompagner la scolarité et contribuer à l’inclusion scolaire (2021)](https://www.has-sante.fr/jcms/p_3287349/) : participation de l’enfant, implication des parents et coopération de la communauté éducative. Cette recommandation s’adresse notamment aux professionnels des ESSMS accompagnant les enfants.
- [Down Syndrome International, recommandations pour l’éducation (2020)](https://ds-int.org/recommendations-for-the-education-of-learners-with-down-syndrome/) : objectifs individuels, suivi partagé du projet avec l’équipe et la famille, supports visuels et adaptations.
- [HAS/Anesm, Les attentes de la personne et le projet personnalisé](https://has-sante.fr/jcms/c_2835163/en/les-attentes-de-la-personne-et-le-projet-personnalise) : prise en compte des attentes de la personne dans l’accompagnement.

Ces principes éclairent la conception. Ils ne valident pas les compteurs de mini-jeux comme une évaluation du développement ni ce prototype comme un outil institutionnel conforme à toutes les exigences d’un établissement.

## Vérifications

Depuis `EduApp-main` :

```text
node --test src/bublii/data/progress.test.js src/bublii/parent/parentMetrics.test.js src/bublii/esms/observations.test.js
npm.cmd run build
npm.cmd run dev
```

Ouvrir `http://localhost:5173/specialiste`.

1. Choisir Léna puis Noah : tous les repères et activités doivent suivre le dossier sélectionné.
2. Ouvrir « Objectifs & observations », rédiger une note avec auteur, objectif et prochaine étape, puis enregistrer.
3. Actualiser et vérifier que la note reste dans le journal de l’enfant concerné, sans apparaître chez l’autre enfant.
4. Commencer un brouillon, changer d’enfant ou de rubrique puis revenir : le brouillon doit rester associé à son enfant.
5. Filtrer les activités par période, domaine et origine. L’option « Parties enregistrées » exclut les exemples.
6. Changer un des quatre réglages ; retrouver sa valeur côté Parent pour le même enfant.
7. Vérifier clavier, ordinateur et tablette. Aucune autre interface n’a été modifiée sur cette branche.

À développer ensuite : modification des objectifs avec l’équipe et la famille, modification ou suppression des observations, comptes et droits d’accès, sauvegarde partagée et transfert de données explicite entre les parties prenantes.

Validation effectuée : 17 tests Node réussis et compilation Vite réussie. Parcours Chrome sur la version compilée : choix d’enfant, sauvegarde et restauration d’une observation, séparation des dossiers, maintien des brouillons pendant la navigation, filtres, réglage partagé avec le Parent et enregistrement réel d’un mini-jeu retrouvé dans l’ESMS. Captures contrôlées sur ordinateur et tablette ; absence de débordement vérifiée à 1440, 820 et 390 pixels. Aucune exception JavaScript non interceptée pendant ce parcours. Ce contrôle ne constitue pas un audit complet d’accessibilité ni un test de tous les mini-jeux.
