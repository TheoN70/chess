---
name: trello
description: Interact with the Trello API via CLI. Use when user wants to list boards, create/move/update cards, manage lists, labels, checklists, members, webhooks, or search Trello. Commands: trello {resource} {action}.
effort: low
model: sonnet
triggers:
  - "trello"
  - "board"
  - "carte trello"
  - "card trello"
  - "ticket trello"
  - "liste trello"
  - "checklist trello"
  - "label trello"
  - "webhook trello"
  - "search trello"
  - "boards"
  - "cards"
  - "lists"
  - "move card"
  - "create card"
  - "déplacer carte"
  - "créer carte"
  - "organiser board"
  - "kanban"
---

# Trello Skill

Skill pour interagir avec l'API REST Trello via des appels `curl`.

## Bootstrap (LIRE EN PREMIER)

**Avant toute action, vérifier si le fichier `BOOTSTRAP.md` existe dans ce dossier (`skills/trello/BOOTSTRAP.md`).**

- **Si `BOOTSTRAP.md` existe** → L'API n'est pas encore configurée. Lire `BOOTSTRAP.md` et guider l'utilisateur à travers le setup étape par étape. Ne pas tenter d'appels API tant que le setup n'est pas terminé.
- **Si `BOOTSTRAP.md` n'existe pas** → Le setup est terminé, procéder normalement avec les appels API.

### Fin du bootstrap

Une fois le setup vérifié (appel `GET /members/me` réussi avec réponse valide), **supprimer `BOOTSTRAP.md`** :

```bash
rm skills/trello/BOOTSTRAP.md
```

Cela signale que la configuration est complète pour toutes les futures sessions.

## Assignation des tickets

Les tickets sont assignés à un développeur via la liste dans laquelle ils se trouvent. Le nom de la liste suit le pattern :

```
TODO ({Prénom})
```

Exemples de listes existantes sur le board OfficeIn Dev :

| Liste | Développeur |
|-------|-------------|
| `TODO (Théo)` | Théo |
| `TODO (Muriel)` | Muriel |
| `TODO (Aina)` | Aina |
| `TODO (Juan)` | Juan |
| `TODO (Abdoul)` | Abdoul |

> **Note** : La liste de Abdoul utilise `TODO : (Abdoul)` (avec espace et deux-points) — légère incohérence à prendre en compte.

Pour trouver les tickets assignés à un développeur, récupérer l'ID de sa liste `TODO (Prénom)` puis appeler `GET /lists/{id}/cards`.

## Configuration par défaut

| Ressource | Valeur |
|-----------|--------|
| Board par défaut | **OfficeIn Dev** — `6776982c134384b15ea1f944` |

Utiliser cet ID de board lorsqu'aucun board n'est précisé par l'utilisateur.

## Authentification

Toutes les requêtes utilisent les variables d'environnement :

```bash
TRELLO_API_KEY="${TRELLO_API_KEY}"
TRELLO_TOKEN="${TRELLO_TOKEN}"
```

## Base URL

```
https://api.trello.com/1
```

## Documentation des endpoints

Chaque endpoint est documenté dans un fichier `.md` dédié dans `skills/trello/docs/`.

### Endpoints disponibles

| Ressource | Action | Fichier doc | Méthode | Path |
|-----------|--------|-------------|---------|------|
| Members | Get current user | [members-me.md](docs/members-me.md) | GET | `/members/me` |
| Members | List boards | [members-boards.md](docs/members-boards.md) | GET | `/members/{id}/boards` |
| Boards | List columns | [boards-lists.md](docs/boards-lists.md) | GET | `/boards/{id}/lists` |
| Boards | List labels | [boards-labels.md](docs/boards-labels.md) | GET | `/boards/{id}/labels` |
| Lists | List cards in a list | [lists-cards.md](docs/lists-cards.md) | GET | `/lists/{id}/cards` |
| Cards | Get a Card | [cards-get.md](docs/cards-get.md) | GET | `/cards/{id}` |
| Cards | Create a Card | [cards-create.md](docs/cards-create.md) | POST | `/cards` |
| Cards | Update/Move a Card | [cards-update.md](docs/cards-update.md) | PUT | `/cards/{id}` |
| Cards | Delete a Card | [cards-delete.md](docs/cards-delete.md) | DELETE | `/cards/{id}` |
| Cards | Add a comment | [cards-comment.md](docs/cards-comment.md) | POST | `/cards/{id}/actions/comments` |
| Cards | Add/Remove label | [cards-add-label.md](docs/cards-add-label.md) | POST | `/cards/{id}/idLabels` |
| Cards | Assign/Remove member | [cards-assign-member.md](docs/cards-assign-member.md) | POST | `/cards/{id}/idMembers` |

## Utilisation

Pour chaque appel API, construire la commande `curl` en suivant la doc de l'endpoint concerné.

### Pattern standard

```bash
curl -s "https://api.trello.com/1/{path}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}&{params}" | jq .
```

### Exemples rapides

```bash
# Récupérer le détail d'une carte
curl -s "https://api.trello.com/1/cards/{cardId}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .

# Récupérer uniquement certains champs
curl -s "https://api.trello.com/1/cards/{cardId}?fields=name,desc,due,idList,labels&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Conventions

- Toujours utiliser `jq .` pour formater la sortie JSON
- Toujours passer `key` et `token` en query params
- Pour les requêtes POST/PUT, utiliser `--data-urlencode` pour les paramètres
- Consulter le fichier doc de l'endpoint dans `docs/` avant d'exécuter un appel

## API Reference

Documentation officielle : https://developer.atlassian.com/cloud/trello/rest/
