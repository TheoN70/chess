Commite les changements de documentation a la racine du projet (repo RACINE `officein_website/`).

IMPORTANT :
- Le projet contient TROIS repos git imbriques : la racine (documentation transverse + framework Claude), `backend/` et `frontend/`.
- Cette commande s'applique UNIQUEMENT au repo RACINE. Les dossiers `backend/` et `frontend/` y sont gitignores (ce sont des repos separes) — pour eux, utiliser `/commit-changes`.
- Le repo racine versionne la doc transverse et la config Claude : `docs/` (architecture/ADR, domain/GLOSSAIRE, playbooks, GOVERNANCE…), `.claude/` (CLAUDE.md, commands, skills), `README.md` et autres `*.md` racine.
- Toutes les commandes git s'executent a la racine du projet (`git -C <racine> ...`, ou `<racine>` = `git rev-parse --show-toplevel`).

Etapes :

1. Lance `git -C <racine> status` pour voir les fichiers modifies et non-suivis
2. Si aucun changement : affiche "Aucun changement de documentation a la racine" et arrete-toi
3. Lance `git -C <racine> diff` pour voir le contenu des changements (staged + unstaged)
4. Lance `git -C <racine> log --oneline -10` pour voir le style des messages de commit recents
5. Analyse les changements et redige un message de commit :
   - Resume la nature de la doc modifiee (ADR, glossaire, CLAUDE.md, commande/skill, playbook, README…)
   - Concentre-toi sur le "pourquoi" plutot que le "quoi"
   - 1 a 2 phrases, concis
   - Suit le style des commits recents du repo racine
6. Stage UNIQUEMENT les fichiers de documentation/config pertinents avec `git -C <racine> add <fichier>` (par nom, jamais `git add -A`). Ne committer que de la doc : `docs/`, `.claude/`, `*.md` racine.
7. Ne jamais commiter : `.env`, credentials, fichiers temporaires/generes, et tout ce qui releve de `backend/`/`frontend/` (de toute facon gitignore a la racine).
8. Cree le commit avec `git -C <racine> commit -m "..."`
9. Affiche le resultat : hash du commit, message, fichiers inclus.

A la fin, recapitule le commit cree (0 ou 1).
Si des changements non-documentaires inattendus apparaissent a la racine, mentionne-les dans le recap mais ne les commite PAS — informe l'utilisateur.
