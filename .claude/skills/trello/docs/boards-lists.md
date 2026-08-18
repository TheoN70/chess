# GET /boards/{id}/lists

Liste toutes les colonnes (listes) d'un board.

**Méthode :** `GET`
**Path :** `/boards/{id}/lists`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-lists-get

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string (TrelloID) | Oui | Identifiant du board. Accepte aussi le `shortLink`. |

## Query Parameters

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `fields` | string | Non | `all` | Champs à retourner, séparés par des virgules |
| `filter` | string | Non | `open` | Filtrer les listes. Valeurs : `all`, `open`, `closed` |
| `cards` | string | Non | `none` | Inclure les cartes. Valeurs : `all`, `open`, `closed`, `none` |
| `cardFields` | string | Non | `all` | Champs des cartes à inclure |

## Champs de la liste (`fields`)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | TrelloID | Identifiant unique de la liste |
| `name` | string | Nom de la liste |
| `closed` | boolean | `true` si la liste est archivée |
| `pos` | number | Position dans le board |
| `idBoard` | TrelloID | ID du board parent |
| `subscribed` | boolean | Abonné aux notifications |
| `softLimit` | number | Limite souple de cartes |

## Commande curl

### Listes ouvertes (recommandé)

```bash
curl -s "https://api.trello.com/1/boards/${BOARD_ID}/lists?fields=name,pos&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Listes avec leurs cartes

```bash
curl -s "https://api.trello.com/1/boards/${BOARD_ID}/lists?fields=name,pos&cards=open&cardFields=name,due,labels,pos&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Toutes les listes (y compris archivées)

```bash
curl -s "https://api.trello.com/1/boards/${BOARD_ID}/lists?filter=all&fields=name,closed,pos&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
[
  {
    "id": "69c673d370bd697114e46dc7",
    "name": "backlog",
    "pos": 0
  },
  {
    "id": "69c673d370bd697114e46dc8",
    "name": "todo",
    "pos": 1
  },
  {
    "id": "69c673d370bd697114e46dc9",
    "name": "in progress",
    "pos": 2
  },
  {
    "id": "69c673d370bd697114e46dca",
    "name": "done",
    "pos": 3
  }
]
```

## Notes

- Les listes sont retournées triées par `pos`
- `filter=open` est le défaut — les listes archivées sont exclues
- Ajouter `cards=open` pour récupérer board + cartes en un seul appel (évite un appel par liste)
- Cet endpoint est indispensable pour connaître les IDs des colonnes avant de déplacer/créer des cartes
