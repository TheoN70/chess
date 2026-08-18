Commite les changements en cours dans les repos `backend/` et `frontend/`.

IMPORTANT :
- Le projet contient TROIS repos git imbriques : la racine (framework Claude uniquement), `backend/` et `frontend/`.
- Cette commande s'applique UNIQUEMENT a `backend/` et `frontend/`. Ne JAMAIS commiter dans le repo racine.
- Toutes les commandes git doivent etre executees depuis `backend/` ou `frontend/` (via `git -C backend ...` ou `git -C frontend ...`).

Pour chacun des deux repos (`backend/` puis `frontend/`) :

1. Lance `git -C <repo> status` pour voir les fichiers modifies et non-suivis
2. Si aucun changement : passe au repo suivant (affiche "Aucun changement dans <repo>")
3. Lance `git -C <repo> diff` pour voir le contenu des changements (staged + unstaged)
4. Lance `git -C <repo> log --oneline -10` pour voir le style des messages de commit recents
5. Analyse les changements et redige un message de commit :
   - Resume la nature du changement (feature, fix, refactor, docs, test)
   - Concentre-toi sur le "pourquoi" plutot que le "quoi"
   - 1 a 2 phrases, concis
   - Suit le style des commits recents du repo
6. Stage les fichiers pertinents avec `git -C <repo> add <fichier>` (pas de `git add -A` — ajoute les fichiers par nom)
7. Ne jamais commiter : `.env`, credentials, fichiers temporaires, rapports generes
8. Cree le commit avec `git -C <repo> commit -m "..."`
9. Affiche le resultat : repo concerne, hash du commit, message, fichiers inclus

A la fin, recapitule les commits crees (0, 1 ou 2 selon les changements detectes).
Si le repo racine contient des changements, mentionne-le dans le recap mais ne commite PAS — informe l'utilisateur qu'il doit les gerer manuellement.
