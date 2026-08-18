# GET /lists/{id}/cards

Liste toutes les cartes d'une liste (colonne) d'un board.

**Méthode :** `GET`
**Path :** `/lists/{id}/cards`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-lists/#api-lists-id-cards-get

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string (TrelloID) | Oui | Identifiant de la liste. Format : `^[0-9a-fA-F]{24}$` |

## Query Parameters

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `fields` | string | Non | `all` | Champs des cartes à retourner, séparés par des virgules |
| `filter` | string | Non | `open` | Filtrer les cartes. Valeurs : `all`, `open`, `closed` |
| `members` | boolean | Non | `false` | Inclure les objets membres assignés |
| `memberFields` | string | Non | `avatarHash,fullName,initials,username` | Champs des membres à inclure |
| `attachments` | string | Non | `false` | Inclure les pièces jointes. Valeurs : `true`, `false`, `cover` |
| `attachmentFields` | string | Non | `all` | Champs des pièces jointes à inclure |
| `checklists` | string | Non | `none` | Inclure les checklists. Valeurs : `all`, `none` |
| `checklistFields` | string | Non | `all` | Champs des checklists à inclure |
| `stickers` | boolean | Non | `false` | Inclure les stickers |
| `customFieldItems` | boolean | Non | `false` | Inclure les champs personnalisés |

## Champs des cartes (`fields`)

Mêmes champs que `GET /cards/{id}` — voir [cards-get.md](cards-get.md) pour la liste complète.

Les plus utiles :
- `name`, `desc`, `due`, `dueComplete`, `labels`, `idMembers`, `pos`, `url`, `shortUrl`, `closed`, `dateLastActivity`, `idChecklists`

## Commande curl

### Cartes ouvertes avec champs essentiels (recommandé)

```bash
curl -s "https://api.trello.com/1/lists/${LIST_ID}/cards?fields=name,desc,due,dueComplete,labels,idMembers,pos,url,dateLastActivity&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Cartes avec membres et checklists

```bash
curl -s "https://api.trello.com/1/lists/${LIST_ID}/cards?fields=name,due,labels,pos&members=true&memberFields=fullName,username&checklists=all&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Toutes les cartes (y compris archivées)

```bash
curl -s "https://api.trello.com/1/lists/${LIST_ID}/cards?filter=all&fields=name,closed,url&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Champs minimaux (listing rapide)

```bash
curl -s "https://api.trello.com/1/lists/${LIST_ID}/cards?fields=name,due,labels&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
[
  {
    "id": "69c673d470bd697114e46e2a",
    "name": "Dive into Trello basics",
    "desc": "Organize your to-dos with boards...",
    "due": null,
    "dueComplete": false,
    "labels": [],
    "idMembers": [],
    "pos": 2,
    "url": "https://trello.com/c/OJqke54J/4-dive-into-trello-basics",
    "dateLastActivity": "2026-03-27T12:11:02.556Z"
  },
  {
    "id": "69c673d370bd697114e46dfe",
    "name": "Download the mobile app",
    "desc": "",
    "due": "2026-04-01T12:00:00.000Z",
    "dueComplete": false,
    "labels": [
      {
        "id": "69c673d370bd697114e46dc0",
        "name": "Priority",
        "color": "red"
      }
    ],
    "idMembers": ["69c673b27ffb9c5d06adbc04"],
    "pos": 4,
    "url": "https://trello.com/c/yotngFcj/5-download-the-mobile-app",
    "dateLastActivity": "2026-03-27T10:00:00.000Z"
  }
]
```

## Workflow typique

Pour lister les tickets d'une colonne d'un board :

```bash
# 1. Lister les boards
curl -s "https://api.trello.com/1/members/me/boards?fields=name,url&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .

# 2. Lister les listes (colonnes) du board
curl -s "https://api.trello.com/1/boards/${BOARD_ID}/lists?fields=name,pos&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .

# 3. Lister les cartes de la liste choisie
curl -s "https://api.trello.com/1/lists/${LIST_ID}/cards?fields=name,due,labels,url&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Notes

- Les cartes sont retournées triées par `pos` (position dans la liste)
- `filter=open` est le défaut — les cartes archivées sont exclues
- Pour obtenir les listes d'un board : `GET /boards/{id}/lists`
- Pour récupérer le détail complet d'une carte : `GET /cards/{id}` — voir [cards-get.md](cards-get.md)
