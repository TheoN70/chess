Mise a jour de la documentation apres un changement de code.

Analyse le travail effectue dans la session courante (git diff ou contexte de conversation) et applique les mises a jour necessaires :

Convention de nommage OfficeIn : les fichiers de doc par sujet sont en MAJUSCULES avec `_` comme separateur (ex. `AUTHENTICATION.md`, `BANKING.md`, `ADR_001_TOKEN_AUTH.md`).

1. **Nouvelle app creee** :
   - Creer `<app>/CLAUDE.md` (commandes, architecture fichiers, flux, conventions test)
   - Creer `<app>/docs/ARCHITECTURE.md`, `<app>/docs/API.md`, `<app>/docs/AUDIT_SECURITE.md`
   - Ajouter l'app dans la section `Sub-documentation` du root `CLAUDE.md`
   - Suivre `docs/playbooks/NEW_APP.md`

2. **API modifiee** (nouvel endpoint, changement de signature, nouveau champ de reponse) :
   - Mettre a jour `<app>/docs/API.md` avec les changements

3. **Structure de fichiers modifiee** (nouveau fichier, fichier renomme/supprime) :
   - Mettre a jour la table "Architecture des fichiers" dans `<app>/CLAUDE.md`

4. **Decision d'architecture prise** (nouveau pattern, choix de technologie, compromis) :
   - Creer un ADR dans `docs/architecture/` en suivant `docs/architecture/ADR_TEMPLATE.md`
   - Nommer le fichier `ADR_NNN_TITRE_COURT.md` (NNN incrementie)
   - Ajouter l'entree dans `docs/architecture/README.md`

5. **Nouveau terme metier introduit** :
   - Ajouter une entree dans `docs/domain/GLOSSAIRE.md` (ordre alphabetique)

Ne modifie que les fichiers qui necessitent reellement une mise a jour. Ne pas toucher aux docs qui sont deja a jour.

La documentation doit suffire a donner une vision claire du code. Ne
pas tenir de journal de bord (DONE.md, CHANGELOG manuel) : le git log
est la source de verite pour l'historique.
