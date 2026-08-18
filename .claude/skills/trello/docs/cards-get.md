# GET /cards/{id}

Récupère le détail complet d'une carte Trello.

**Méthode :** `GET`
**Path :** `/cards/{id}`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-get

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string (TrelloID) | Oui | Identifiant unique de la carte. Format : `^[0-9a-fA-F]{24}$`. Accepte aussi le `shortLink` de la carte. |

## Query Parameters

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `fields` | string | Non | `all` | Liste de champs à retourner, séparés par des virgules. Voir la liste ci-dessous. |

### Valeurs possibles pour `fields`

| Champ | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | TrelloID | Non | Identifiant unique de la carte |
| `name` | string | Non | Titre de la carte |
| `desc` | string | Non | Description de la carte |
| `closed` | boolean | Non | `true` si la carte est archivée |
| `due` | string (date) | Oui | Date d'échéance |
| `dueComplete` | boolean | Non | `true` si la date d'échéance est marquée comme complétée |
| `dueReminder` | string | Oui | Rappel de la date d'échéance |
| `dateLastActivity` | string (date-time) | Non | Timestamp de la dernière activité |
| `idBoard` | TrelloID | Non | ID du board parent |
| `idList` | TrelloID | Non | ID de la liste parente |
| `idMembers` | array | Non | IDs des membres assignés |
| `idMembersVoted` | array | Non | IDs des membres ayant voté |
| `idLabels` | array | Non | IDs des labels |
| `idChecklists` | array | Non | IDs des checklists |
| `idShort` | integer | Non | Identifiant court numérique |
| `idAttachmentCover` | TrelloID | Oui | ID de la pièce jointe utilisée comme couverture |
| `labels` | array | Non | Objets labels complets |
| `badges` | object | Non | Compteurs (attachments, votes, comments, checklists) |
| `pos` | number (float) | Non | Position dans la liste |
| `url` | string (url) | Non | URL complète de la carte |
| `shortUrl` | string (url) | Non | URL courte Trello |
| `shortLink` | string | Non | Identifiant court URL-safe |
| `subscribed` | boolean | Non | `true` si l'utilisateur est abonné |
| `cover` | object | Non | Paramètres de couverture (couleur, image, brightness) |
| `address` | string | Oui | Adresse physique |
| `coordinates` | string | Oui | Coordonnées géographiques |
| `locationName` | string | Oui | Nom du lieu |
| `isTemplate` | boolean | Non | `true` si c'est un template |
| `checkItemStates` | array | Non | États de complétion des check items |
| `descData` | object | Non | Données de description (emoji) |
| `limits` | object | Non | Limites de la carte |
| `manualCoverAttachment` | boolean | Non | Couverture manuelle |
| `creationMethod` | string | Oui | Méthode de création |

## Commande curl

### Tous les champs

```bash
curl -s "https://api.trello.com/1/cards/${CARD_ID}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Champs sélectionnés (recommandé)

```bash
curl -s "https://api.trello.com/1/cards/${CARD_ID}?fields=name,desc,due,dueComplete,idList,idBoard,labels,idMembers,url,dateLastActivity,closed&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Champs minimaux

```bash
curl -s "https://api.trello.com/1/cards/${CARD_ID}?fields=name,desc,due,labels,url&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
{
  "id": "5abbe4b7ddc1b351ef961414",
  "name": "Corriger le bug de login",
  "desc": "Le formulaire ne valide pas les emails correctement",
  "closed": false,
  "due": "2026-04-01T12:00:00.000Z",
  "dueComplete": false,
  "dateLastActivity": "2026-03-27T10:30:00.000Z",
  "idBoard": "5abbe4b7ddc1b351ef961400",
  "idList": "5abbe4b7ddc1b351ef961401",
  "idMembers": ["5abbe4b7ddc1b351ef961410"],
  "idLabels": ["5abbe4b7ddc1b351ef961420"],
  "labels": [
    {
      "id": "5abbe4b7ddc1b351ef961420",
      "idBoard": "5abbe4b7ddc1b351ef961400",
      "name": "Bug",
      "color": "red"
    }
  ],
  "badges": {
    "attachmentsByType": { "trello": { "board": 0, "card": 0 } },
    "location": false,
    "votes": 0,
    "viewingMemberVoted": false,
    "subscribed": false,
    "fogbugz": "",
    "checkItems": 3,
    "checkItemsChecked": 1,
    "comments": 2,
    "attachments": 1,
    "description": true,
    "due": "2026-04-01T12:00:00.000Z",
    "dueComplete": false
  },
  "pos": 65535,
  "url": "https://trello.com/c/AbCdEfGh/1-corriger-le-bug-de-login",
  "shortUrl": "https://trello.com/c/AbCdEfGh",
  "shortLink": "AbCdEfGh",
  "subscribed": false,
  "cover": {
    "idAttachment": null,
    "color": null,
    "idUploadedBackground": null,
    "size": "normal",
    "brightness": "dark",
    "isTemplate": false
  }
}
```

## Notes

- Le `id` peut être soit l'identifiant complet (24 caractères hex), soit le `shortLink` visible dans l'URL de la carte
- Utiliser `fields` pour limiter la réponse et améliorer les performances
- Les champs les plus utiles au quotidien : `name`, `desc`, `due`, `labels`, `idList`, `idMembers`, `url`
