# Espace de travail éducatif - prototype local

## Ce qui fonctionne

- **Éclairages et idées** : période choisie, calculs sourcés, objectifs sans séance explicitement liée, aides récurrentes dans des observations datées, changements d’état des objectifs et participation positive uniquement lorsqu’elle est renseignée dans un bilan de séance. Chaque éclairage explique sa règle, cite ses enregistrements et distingue faits, calculs et suggestions.
- **Recommandations** : catalogue éditorial des thèmes des activités, domaine et formulation des objectifs, activités déjà découvertes, préférences saisies, propositions professionnelles et retours familiaux explicitement positifs. Le professionnel peut retenir, adapter ou écarter une piste. Quatre pistes sont affichées au départ pour éviter une page trop chargée.
- **Séances** : choix de plusieurs objectifs, propositions d’activités, ajouts au catalogue, ordre modifiable, durée et aides par activité, notes de préparation, enregistrement et modification des séances prévues dans un calendrier hebdomadaire. Les séances peuvent être sauvegardées comme modèles puis réutilisées. Les objectifs d’un autre enfant et les résultats réels ne sont pas copiés silencieusement dans un modèle.
- **Bilans de séance** : activité réalisée, adaptée ou non réalisée ; durée réelle facultative ; participation renseignée ; observation. Comparaison du plan et de ce qui a été saisi. Aucun résultat de mini-jeu n’est créé par ce bilan.
- **Rapports** : enfant courant, période, sections sélectionnables, version professionnelle ou famille, parties d’exemple incluses uniquement sur demande, historique daté des objectifs et observations liées, comparaison descriptive avec la période précédente lorsqu’elles comportent chacune des parties. Le document peut être ouvert dans un nouvel onglet, relu et exporté en PDF avec la fonction d’impression du navigateur. Le style A4 comporte marges, pagination, en-têtes de tableaux et blocs évitant les coupures internes.
- **Famille et objectifs** : création d’objectifs locaux, état et date de révision renseignés par l’équipe, partage explicite d’un objectif et d’une proposition pratique au Parent. Le Parent peut renseigner ses préférences et faire un retour sur la participation et l’activité proposée. L’ESMS retrouve ce retour. Les deux espaces montrent un fil commun des événements partagés et des jeux, et des notifications internes avec lecture explicite.
- **Établissement** : enfants suivis, répartition des objectifs par domaine, révisions proches ou dépassées, compteurs d’observations sur quatre périodes, calendrier des séances de l’ensemble de la structure, bibliothèque de ressources et modèles d’objectifs et de séances. Aucun classement des enfants ou du personnel.

## Ce qui n’est pas simulé comme un service réel

Il n’y a **aucun modèle d’IA connecté**, appel à une API d’IA, paiement, abonnement actif ou accès premium verrouillé. Les suggestions sont produites par les fonctions déterministes de `src/bublii/premium/model.js`. Leur résultat structuré (méthode, explication, références et décision humaine) peut servir de contrat à un futur service, après validation. Elles ne prédisent rien et ne posent aucun diagnostic.

Les profils, objectifs et parties initiaux restent la **démonstration préexistante**. Les séances, observations, retours et ressources ne sont pas artificiellement préremplis. Une liste vide ou un compteur nul l’indique explicitement. Pour voir des éclairages riches, enregistrer des observations et des bilans : la participation positive n’est jamais inférée d’un score de jeu.

Un objectif non retrouvé dans les séances n’est pas présenté comme « jamais pratiqué ». L’écran précise que l’équipe doit vérifier les activités réalisées en dehors de Boblii. La correspondance par domaine ou thème est une piste, pas une validation pédagogique.

## Données et frontières

- **Routines du quotidien** : le Parent et l’ESMS (rubrique Séances) peuvent créer et modifier des routines propres à l’enfant. Quatre modèles peuvent être adaptés ; les consignes libres sont limitées à 15 étapes courtes. Un jour précis ou une répétition quotidienne est possible. Le bouton « Mon calendrier » de l’accueil Enfant ouvre les routines du jour avec lecture vocale manuelle et une étape à la fois. Le suivi des étapes est sauvegardé par routine, version et date dans `bobliiRoutinesV1`, séparément des données existantes. Modifier une routine remet son suivi à zéro pour la nouvelle version ; retirer une routine l’archive. Les cases cochées ne constituent ni une vérification du geste réel ni une mesure de l’autonomie. Aucun rappel automatique, partage entre appareils ou image personnalisée par étape n’est implémenté.
- Validation des routines : quatre tests supplémentaires (37 au total) et parcours Chrome couvrant création Parent, adaptation d’un modèle, reprise après rechargement côté Enfant, consultation du suivi côté ESMS, séparation des enfants, création ESMS quotidienne et affichage tablette/mobile.
- Profils et jeux : clé existante `bubliiProfilesV2`, inchangée.
- Observations professionnelles : clés existantes `bubliiEsmsObservationsV1:<childId>`, inchangées.
- Nouvel espace local : clé versionnée `bobliiWorkspaceV1`, contenant objectifs ajoutés, suivi des objectifs, préférences, séances, modèles, propositions, retours, décisions, événements, notifications et ressources.
- La sauvegarde est effectuée avant d’annoncer un succès. Un échec garde la saisie des formulaires critiques et affiche une erreur. Une mémoire de travail corrompue n’est pas écrasée automatiquement.
- Les notes internes de l’ESMS ne sont pas automatiquement exposées au Parent. Le fil commun contient les événements de suivi et propositions et les parties. Un rapport peut inclure des observations, mais l’utilisateur le relit et choisit ses sections avant l’export ; aucun envoi n’est effectué.
- L’application réagit aux changements du stockage local entre onglets du même navigateur. Ce n’est pas de la communication temps réel entre comptes. Les écritures simultanées sur plusieurs onglets ne bénéficient pas encore d’une résolution de conflit.
- Les horaires du planning sont des horaires muraux libellés « Paris ». Un futur serveur devra gérer les fuseaux, les changements d’heure et les conflits de réservation.

## Prise en main

La navigation principale comporte trois entrées : **Dossier enfant**, **Séances** et **Établissement**. Dans le dossier, le menu **Autres outils du dossier** donne accès aux idées, rapports, échanges avec la famille, observations, historique et réglages. Les formulaires secondaires restent repliés jusqu’à leur ouverture ; la préparation d’une séance se déroule en trois étapes (objectifs, activités, vérification).

1. Ouvrir l’espace Établissement et choisir un enfant.
2. Dans **Famille & objectifs**, renseigner un état ou une date de révision, puis proposer une activité à la maison avec le nom du professionnel.
3. Dans **Séances**, cliquer **Préparer une séance**, sélectionner des objectifs, ajouter plusieurs activités, puis vérifier et enregistrer. Les aides et l’enregistrement comme modèle sont facultatifs et repliés. Le bouton **Modifier** permet de reprendre une séance prévue ; le calendrier hebdomadaire est disponible dans une section dépliable.
4. Dans **Renseigner le bilan**, compléter ce qui s’est passé pour chaque activité, puis clôturer. Consulter ensuite **Voir prévu / réalisé**.
5. Ouvrir **Éclairages & idées** : les nouvelles données servent de preuves. Choisir ses préférences et retenir ou adapter une piste.
6. Passer à l’espace Parent du même navigateur : retrouver la proposition et envoyer un retour local. Revenir à l’ESMS pour le consulter.
7. Dans **Rapports**, choisir période, sections et version, puis **Ouvrir le rapport et exporter en PDF**. Cliquer **Imprimer / enregistrer en PDF** et choisir la destination PDF du navigateur.
8. Dans **Établissement**, ajouter une ressource et un modèle d’objectif ; retrouver ce modèle dans l’ajout d’objectif individuel.

## Validation technique

Depuis `EduApp-main` :

```text
node --test src/bublii/data/progress.test.js src/bublii/parent/parentMetrics.test.js src/bublii/esms/observations.test.js src/bublii/premium/model.test.js
npm.cmd run build
npm.cmd run dev
```

Les tests du modèle couvrent données vides, distinction exemple/enregistré, dates Paris, périodes comparables, preuves des éclairages, absence d’inférence clinique, indépendance de l’âge et du diagnostic, séparation des enfants, priorisation thématique, validation des séances et modèles sans copie des résultats.

Validation réalisée le 5 novembre 2026 : **33 tests réussis**, compilation Vite réussie et parcours Chrome complet sur un profil isolé. Le parcours crée une proposition professionnelle, la retrouve dans le Parent, transmet un retour et le retrouve dans l’ESMS ; il crée, réordonne, modifie et réutilise des séances, clôture un bilan, adapte une recommandation, ajoute une ressource et un modèle d’objectif et teste un dossier sans données. Les références explicatives, la séparation des enfants et l’affichage à 1440, 820 et 390 pixels sont contrôlés. Le rapport professionnel de trois pages est exporté puis rendu en images pour vérification visuelle ; la variante famille est également générée dans le navigateur. Le PDF exemple dans `output/pdf/rapport-demo-lea.pdf` provient uniquement de ce profil de test, pas de données d’un utilisateur réel.

## Besoins d’un produit déployé

Authentification, droits par rôle et établissement, stockage serveur, consentements et politique de partage explicite, gestion des conflits, journal d’audit, modification/archivage des notes, véritable suivi des versions d’objectifs et gestion des suppressions. Les PDF et toutes les données restent ici sur l’appareil ; aucun niveau de conformité institutionnelle ou de sécurité d’un dossier médical n’est revendiqué.

Les anciennes interfaces et leur routage sont conservés. Les nouveaux modules sont dans `src/bublii/premium/`. Il n’y a pas de nouvelle dépendance de l’application ; les outils Python utilisés pour contrôler le PDF sont uniquement des outils locaux de vérification.
