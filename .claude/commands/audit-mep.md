Audit de securite du differentiel avant mise en production (etat courant vs branche `production`).

L'audit porte UNIQUEMENT sur le differentiel courant / `production` des **apps managees** (= les apps effectivement mises en production) : `backend/` et `frontend/`, chacune etant son propre depot git avec sa branche `production`.

1. Pour CHAQUE app managee (`backend/` et `frontend/`), recupere le diff dans son depot : `git -C <app> diff production...HEAD`. Si la branche `production` n'existe pas en local, tente `git -C <app> fetch origin production` puis `git -C <app> diff origin/production...HEAD`.
2. Si les deux diffs sont vides, dis-le et arrete-toi.
3. Lance l'agent **cybersecurite** (subagent_type `cybersecurite`) en lui passant les diffs a auditer. Consigne : n'auditer QUE les fichiers modifies dans ces diffs (backend + frontend), ecrire un rapport `.md` a la racine du projet nomme `AUDIT_MEP_<AAAA-MM-JJ>.md`, verdict global GO / NO-GO + failles classees par severite (critique / haute / moyenne / basse) avec fichier:ligne et remediation.
4. Restitue le verdict final et le chemin du rapport.
