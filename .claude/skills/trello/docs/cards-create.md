# POST /cards

Crée une nouvelle carte dans une liste.

**Méthode :** `POST`
**Path :** `/cards`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-post

## Query Parameters

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `idList` | TrelloID | **Oui** | - | ID de la liste cible |
| `name` | string | Non | - | Titre de la carte |
| `desc` | string | Non | - | Description (supporte le Markdown) |
| `pos` | string/number | Non | `bottom` | Position. Valeurs : `top`, `bottom`, ou un nombre |
| `due` | string (date) | Non | - | Date d'échéance. Format ISO 8601 |
| `dueComplete` | boolean | Non | `false` | Marquer la date comme complétée |
| `idMembers` | string | Non | - | IDs des membres à assigner, séparés par des virgules |
| `idLabels` | string | Non | - | IDs des labels à ajouter, séparés par des virgules |
| `urlSource` | string (url) | Non | - | URL source à attacher |
| `idCardSource` | TrelloID | Non | - | ID d'une carte à copier |
| `keepFromSource` | string | Non | `all` | Éléments à garder de la carte source : `all`, `attachments`, `checklists`, `comments`, `due`, `labels`, `members`, `stickers` |

## Commande curl

### Créer une carte simple

```bash
curl -s -X POST "https://api.trello.com/1/cards?idList=${LIST_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" \
  --data-urlencode "name=Ma nouvelle carte" | jq .
```

### Créer une carte complète

```bash
curl -s -X POST "https://api.trello.com/1/cards?idList=${LIST_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" \
  --data-urlencode "name=Corriger le bug de login" \
  --data-urlencode "desc=Le formulaire ne valide pas les emails" \
  --data-urlencode "due=2026-04-15T12:00:00.000Z" \
  --data-urlencode "pos=top" | jq .
```

### Créer avec labels et membres

```bash
curl -s -X POST "https://api.trello.com/1/cards?idList=${LIST_ID}&idLabels=${LABEL_ID1},${LABEL_ID2}&idMembers=${MEMBER_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" \
  --data-urlencode "name=Feature importante" | jq .
```

### Dupliquer une carte existante

```bash
curl -s -X POST "https://api.trello.com/1/cards?idList=${LIST_ID}&idCardSource=${SOURCE_CARD_ID}&keepFromSource=all&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
{
  "id": "69c673d470bd697114e46fff",
  "name": "Corriger le bug de login",
  "desc": "Le formulaire ne valide pas les emails",
  "closed": false,
  "idBoard": "69c673d370bd697114e46db2",
  "idList": "69c673d370bd697114e46dc8",
  "idMembers": [],
  "idLabels": [],
  "due": "2026-04-15T12:00:00.000Z",
  "dueComplete": false,
  "pos": 1,
  "url": "https://trello.com/c/AbCdEfGh/7-corriger-le-bug-de-login",
  "shortUrl": "https://trello.com/c/AbCdEfGh",
  "dateLastActivity": "2026-03-27T13:00:00.000Z"
}
```

## Notes

- `idList` est le seul paramètre obligatoire
- Les champs texte (`name`, `desc`) doivent utiliser `--data-urlencode`
- `pos=top` place la carte en haut de la liste, `pos=bottom` en bas
- Pour dupliquer une carte, utiliser `idCardSource` avec `keepFromSource=all`
