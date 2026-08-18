# POST /cards/{id}/idLabels

Ajoute un label à une carte.

**Méthode :** `POST`
**Path :** `/cards/{id}/idLabels`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idlabels-post

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string (TrelloID) | Oui | Identifiant de la carte. Accepte aussi le `shortLink`. |

## Query Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `value` | TrelloID | **Oui** | ID du label à ajouter |

## Commande curl

### Ajouter un label

```bash
curl -s -X POST "https://api.trello.com/1/cards/${CARD_ID}/idLabels?value=${LABEL_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Retirer un label

Pour retirer un label d'une carte, utiliser `DELETE` :

```bash
curl -s -X DELETE "https://api.trello.com/1/cards/${CARD_ID}/idLabels/${LABEL_ID}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
[
  "69c673d370bd697114e46db0",
  "69c673d370bd697114e46db1"
]
```

La réponse retourne la liste complète des IDs de labels actuellement sur la carte.

## Workflow typique

```bash
# 1. Lister les labels du board
curl -s "https://api.trello.com/1/boards/${BOARD_ID}/labels?fields=id,name,color&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .

# 2. Ajouter le label "Bug" (red) à une carte
curl -s -X POST "https://api.trello.com/1/cards/${CARD_ID}/idLabels?value=${BUG_LABEL_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Notes

- Récupérer les IDs des labels via `GET /boards/{id}/labels` — voir [boards-labels.md](boards-labels.md)
- Ajouter un label déjà présent ne crée pas de doublon
- On peut aussi ajouter des labels directement à la création : `POST /cards?idLabels=id1,id2`
