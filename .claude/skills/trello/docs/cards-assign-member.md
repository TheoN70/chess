# POST /cards/{id}/idMembers

Assigne un membre à une carte.

**Méthode :** `POST`
**Path :** `/cards/{id}/idMembers`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-idmembers-post

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string (TrelloID) | Oui | Identifiant de la carte. Accepte aussi le `shortLink`. |

## Query Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `value` | TrelloID | **Oui** | ID du membre à assigner |

## Commande curl

### S'assigner soi-même

```bash
# 1. Récupérer son propre ID
MY_ID=$(curl -s "https://api.trello.com/1/members/me?fields=id&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq -r '.id')

# 2. S'assigner sur la carte
curl -s -X POST "https://api.trello.com/1/cards/${CARD_ID}/idMembers?value=${MY_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Assigner un membre par son ID

```bash
curl -s -X POST "https://api.trello.com/1/cards/${CARD_ID}/idMembers?value=${MEMBER_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Retirer un membre

```bash
curl -s -X DELETE "https://api.trello.com/1/cards/${CARD_ID}/idMembers/${MEMBER_ID}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

La réponse retourne la liste mise à jour des IDs de membres assignés :

```json
[
  "69c673b27ffb9c5d06adbc04"
]
```

## Notes

- L'ID du membre courant se récupère via `GET /members/me` — voir [members-me.md](members-me.md)
- Assigner un membre déjà présent ne crée pas de doublon
- On peut aussi assigner des membres à la création : `POST /cards?idMembers=id1,id2`
- Pour lister les membres d'un board : `GET /boards/{id}/members`
