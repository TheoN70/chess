---
name: work
description: Réalise l'intégralité du ticket passé en paramètre.
triggers:
  - "ticket"
---

# Work Skill

Réalise un ticket Trello de bout en bout : récupération → analyse → développement → PR → clôture.

## Références rapides (board OfficeIn Dev)

| Ressource | ID |
|-----------|-----|
| Board | `6776982c134384b15ea1f944` |
| Branche principale | `develop` |

---

## Étape 1 — Récupérer le ticket

### Si un ticket est passé en argument
Utiliser directement son ID ou son nom. Récupérer le détail complet :

```bash
curl -s "https://api.trello.com/1/cards/{CARD_ID}?fields=name,desc,idList,labels,due,dueComplete&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Sinon — lister les tickets de l'utilisateur

1. Récupérer le prénom de l'utilisateur depuis la mémoire Claude (MEMORY.md). Si le prénom n'est pas connu, **le demander à l'utilisateur**.

2. Lister les colonnes du board pour trouver celle qui correspond à `TODO ({Prénom})` (voir la skill Trello pour le pattern exact) :

```bash
curl -s "https://api.trello.com/1/boards/6776982c134384b15ea1f944/lists?fields=name,id&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq '.[] | select(.name | test("TODO.*{Prénom}"; "i")) | {id, name}'
```

3. Récupérer les cartes de cette liste :

```bash
curl -s "https://api.trello.com/1/lists/{TODO_LIST_ID}/cards?fields=name,desc,labels,due&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq '.[] | {id, name, desc}'
```

Afficher la liste à l'utilisateur et lui demander quel ticket réaliser.

---

## Étape 2 — Analyser le ticket (Plan Mode)

Passer en Plan Mode (`EnterPlanMode`) et analyser :
- Titre et description du ticket
- Fichiers impactés dans la codebase (lire les CLAUDE.md des apps concernées)
- Dépendances, modèles, URLs, tests existants
- Approche technique : quels fichiers créer/modifier, dans quel ordre

**Attendre la validation du plan par l'utilisateur avant de coder.**

---

## Étape 3 — Créer la branche

Depuis `develop`, créer une branche avec un nom descriptif en kebab-case :

```bash
git checkout develop && git pull origin develop
git checkout -b {nom-de-branche}
```

Convention de nommage : `{sujet-court-du-ticket}` (ex. `fix-invoice-status`, `add-biosim-export`).

---

## Étape 4 — Développer

- Invoquer la skill **python** avant toute modification de fichier backend (Django)
- Respecter les conventions définies dans les CLAUDE.md du projet
- Ne jamais lancer les tests (l'utilisateur s'en charge)
- Committer au fil du développement via la skill **commit** (jamais `git commit` direct)

---

## Étape 5 — Pull Request

Créer la PR vers `develop` avec `gh pr create` :

```bash
gh pr create --base develop --title "{titre}" --body "$(cat <<'EOF'
## Ticket Trello
{lien ou nom du ticket}

## Résumé
- {bullet point des changements}

## Test
- [ ] {scénarios à tester manuellement}
EOF
)"
```

---

## Étape 6 — Clôturer le ticket Trello

Marquer la carte comme achevée (`dueComplete=true`) sans la déplacer de colonne :

```bash
curl -s -X PUT "https://api.trello.com/1/cards/{CARD_ID}?dueComplete=true&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq '{name, dueComplete}'
```
