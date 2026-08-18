# POST /cards/{id}/actions/comments

Ajoute un commentaire à une carte.

**Méthode :** `POST`
**Path :** `/cards/{id}/actions/comments`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-actions-comments-post

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string (TrelloID) | Oui | Identifiant de la carte. Accepte aussi le `shortLink`. |

## Query Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `text` | string | **Oui** | Contenu du commentaire (supporte le Markdown) |

## Commande curl

### Commentaire simple

```bash
curl -s -X POST "https://api.trello.com/1/cards/${CARD_ID}/actions/comments?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" \
  --data-urlencode "text=Tâche terminée, prêt pour review." | jq .
```

### Commentaire avec Markdown

```bash
curl -s -X POST "https://api.trello.com/1/cards/${CARD_ID}/actions/comments?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" \
  --data-urlencode "text=## Résumé
- Bug identifié dans le module auth
- Fix déployé en staging
- **À valider** par l'équipe QA" | jq .
```

### Mentionner un membre

```bash
curl -s -X POST "https://api.trello.com/1/cards/${CARD_ID}/actions/comments?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" \
  --data-urlencode "text=@antho97 peux-tu valider ?" | jq .
```

## Exemple de réponse

```json
{
  "id": "660a1b2c3d4e5f6a7b8c9d0e",
  "idMemberCreator": "69c673b27ffb9c5d06adbc04",
  "data": {
    "text": "Tâche terminée, prêt pour review.",
    "textData": { "emoji": {} },
    "card": {
      "id": "69c673d370bd697114e46df6",
      "name": "Capture from email, Slack, and Teams",
      "shortLink": "tV3wOavO",
      "idShort": 2
    },
    "board": {
      "id": "69c673d370bd697114e46db2",
      "name": "My Trello board",
      "shortLink": "Jp0vRU05"
    },
    "list": {
      "id": "69c673d370bd697114e46dc7",
      "name": "backlog"
    }
  },
  "type": "commentCard",
  "date": "2026-03-27T13:30:00.000Z",
  "memberCreator": {
    "id": "69c673b27ffb9c5d06adbc04",
    "fullName": "Antho",
    "username": "antho97"
  }
}
```

## Notes

- Le texte supporte le Markdown de Trello
- Utiliser `@username` pour mentionner un membre
- Les commentaires apparaissent dans le flux d'activité de la carte
- Pour récupérer les commentaires existants : `GET /cards/{id}/actions?filter=commentCard`
