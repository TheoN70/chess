# PUT /cards/{id}

Met à jour une carte Trello. Permet notamment de déplacer une carte d'une liste à une autre.

**Méthode :** `PUT`
**Path :** `/cards/{id}`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-put

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string (TrelloID) | Oui | Identifiant de la carte. Accepte aussi le `shortLink`. |

## Query Parameters

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `name` | string | Non | - | Nouveau titre de la carte |
| `desc` | string | Non | - | Nouvelle description |
| `closed` | boolean | Non | - | `true` pour archiver, `false` pour désarchiver |
| `idList` | TrelloID | Non | - | ID de la liste cible (déplacer la carte) |
| `idBoard` | TrelloID | Non | - | ID du board cible (déplacer vers un autre board) |
| `pos` | string/number | Non | - | Position dans la liste. Valeurs : `top`, `bottom`, ou un nombre (ex: `1293.5`) |
| `due` | string (date) | Non | - | Date d'échéance. `null` pour supprimer |
| `dueComplete` | boolean | Non | - | Marquer la date d'échéance comme complétée |
| `dueReminder` | string | Non | - | Rappel de la date d'échéance. `null` pour supprimer |
| `subscribed` | boolean | Non | - | S'abonner/désabonner de la carte |
| `address` | string | Non | - | Adresse physique. `null` pour supprimer |
| `locationName` | string | Non | - | Nom du lieu. `null` pour supprimer |
| `coordinates` | string | Non | - | Coordonnées géographiques. `null` pour supprimer |
| `cover` | object | Non | - | Paramètres de couverture |

## Commande curl

### Déplacer une carte vers une autre liste

```bash
curl -s -X PUT "https://api.trello.com/1/cards/${CARD_ID}?idList=${TARGET_LIST_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Déplacer en haut de la liste cible

```bash
curl -s -X PUT "https://api.trello.com/1/cards/${CARD_ID}?idList=${TARGET_LIST_ID}&pos=top&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Déplacer vers un autre board + liste

```bash
curl -s -X PUT "https://api.trello.com/1/cards/${CARD_ID}?idBoard=${TARGET_BOARD_ID}&idList=${TARGET_LIST_ID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Renommer une carte

```bash
curl -s -X PUT "https://api.trello.com/1/cards/${CARD_ID}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" --data-urlencode "name=Nouveau titre" | jq .
```

### Mettre à jour la description

```bash
curl -s -X PUT "https://api.trello.com/1/cards/${CARD_ID}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" --data-urlencode "desc=Nouvelle description détaillée" | jq .
```

### Définir une date d'échéance

```bash
curl -s -X PUT "https://api.trello.com/1/cards/${CARD_ID}?due=2026-04-15T12:00:00.000Z&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Archiver une carte

```bash
curl -s -X PUT "https://api.trello.com/1/cards/${CARD_ID}?closed=true&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Marquer un ticket comme achevé (dueComplete)

```bash
curl -s -X PUT "https://api.trello.com/1/cards/${CARD_ID}?dueComplete=true&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Marquer un ticket comme inachevé (dueComplete)

```bash
curl -s -X PUT "https://api.trello.com/1/cards/${CARD_ID}?dueComplete=false&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
{
  "id": "69c673d370bd697114e46dda",
  "name": "Ma carte déplacée",
  "desc": "",
  "closed": false,
  "idBoard": "69c673d370bd697114e46db2",
  "idList": "69c673d370bd697114e46dc8",
  "pos": 65535,
  "due": null,
  "dueComplete": false,
  "url": "https://trello.com/c/9JKwwJXT/1-ma-carte",
  "shortUrl": "https://trello.com/c/9JKwwJXT",
  "dateLastActivity": "2026-03-27T13:00:00.000Z"
}
```

## Notes

- Pour déplacer une carte : passer `idList` avec l'ID de la liste cible
- Pour déplacer entre boards : passer `idBoard` ET `idList`
- `pos=top` place la carte en premier, `pos=bottom` en dernier
- Les champs texte (`name`, `desc`) doivent utiliser `--data-urlencode` pour gérer les caractères spéciaux
- Seuls les champs envoyés sont mis à jour, les autres restent inchangés
- `dueComplete=true` marque la carte comme achevée (badge vert sur la date d'échéance) ; `dueComplete=false` la marque comme inachevée — **nécessite qu'une date d'échéance (`due`) soit définie sur la carte**
