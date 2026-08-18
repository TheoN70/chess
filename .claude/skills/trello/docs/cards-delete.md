# DELETE /cards/{id}

Supprime définitivement une carte Trello.

**Méthode :** `DELETE`
**Path :** `/cards/{id}`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-delete

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string (TrelloID) | Oui | Identifiant de la carte à supprimer. Accepte aussi le `shortLink`. |

## Commande curl

```bash
curl -s -X DELETE "https://api.trello.com/1/cards/${CARD_ID}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
{
  "_value": null
}
```

## Notes

- **Action irréversible** — la carte est supprimée définitivement
- Pour un retrait temporaire, préférer l'archivage : `PUT /cards/{id}?closed=true` — voir [cards-update.md](cards-update.md)
- La suppression échoue silencieusement si la carte n'existe pas (retourne `null`)
