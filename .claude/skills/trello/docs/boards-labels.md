# GET /boards/{id}/labels

Liste tous les labels disponibles sur un board.

**Méthode :** `GET`
**Path :** `/boards/{id}/labels`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-labels-get

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string (TrelloID) | Oui | Identifiant du board. Accepte aussi le `shortLink`. |

## Query Parameters

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `fields` | string | Non | `all` | Champs à retourner : `id`, `color`, `idBoard`, `name`, `uses` |
| `limit` | integer | Non | `50` | Nombre max de labels à retourner (max 1000) |

## Champs du label (`fields`)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | TrelloID | Identifiant unique du label |
| `name` | string | Nom du label |
| `color` | string (nullable) | Couleur. Valeurs : `yellow`, `purple`, `blue`, `red`, `green`, `orange`, `black`, `sky`, `pink`, `lime`, `null` |
| `idBoard` | TrelloID | ID du board parent |
| `uses` | integer | Nombre de cartes utilisant ce label |

## Commande curl

### Tous les labels

```bash
curl -s "https://api.trello.com/1/boards/${BOARD_ID}/labels?fields=id,name,color,uses&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Labels avec nom uniquement

```bash
curl -s "https://api.trello.com/1/boards/${BOARD_ID}/labels?fields=name,color&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
[
  {
    "id": "69c673d370bd697114e46db0",
    "name": "Bug",
    "color": "red",
    "uses": 3
  },
  {
    "id": "69c673d370bd697114e46db1",
    "name": "Feature",
    "color": "green",
    "uses": 5
  },
  {
    "id": "69c673d370bd697114e46db3",
    "name": "Urgent",
    "color": "orange",
    "uses": 1
  },
  {
    "id": "69c673d370bd697114e46db4",
    "name": "",
    "color": "sky",
    "uses": 0
  }
]
```

## Notes

- Chaque board a des labels prédéfinis (un par couleur), même sans nom
- Les labels sans `name` existent avec juste une couleur
- `color: null` = label sans couleur (texte uniquement)
- Les IDs de labels sont nécessaires pour `POST /cards` (param `idLabels`) et `POST /cards/{id}/idLabels`
- Couleurs disponibles : yellow, purple, blue, red, green, orange, black, sky, pink, lime
