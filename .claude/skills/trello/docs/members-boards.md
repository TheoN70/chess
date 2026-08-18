# GET /members/{id}/boards

Liste tous les boards d'un membre.

**Méthode :** `GET`
**Path :** `/members/{id}/boards`
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-members/#api-members-id-boards-get

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string | Oui | Identifiant du membre. Utiliser `me` pour l'utilisateur courant. |

## Query Parameters

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `fields` | string | Non | `all` | Champs des boards à retourner, séparés par des virgules |
| `filter` | string | Non | `all` | Filtrer les boards. Valeurs : `all`, `open`, `closed`, `members`, `organization`, `public`, `starred` |
| `lists` | string | Non | `none` | Inclure les listes. Valeurs : `all`, `open`, `closed`, `none` |
| `memberships` | string | Non | `none` | Inclure les memberships. Valeurs : `all`, `none` |
| `organization` | boolean | Non | `false` | Inclure les données de l'organisation |
| `organizationFields` | string | Non | `name,displayName` | Champs de l'organisation à inclure |

## Champs du board (`fields`)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | TrelloID | Identifiant unique du board |
| `name` | string | Nom du board |
| `desc` | string | Description |
| `closed` | boolean | `true` si le board est archivé |
| `idOrganization` | TrelloID | ID de l'organisation (workspace) |
| `pinned` | boolean | Board épinglé |
| `url` | string (url) | URL complète du board |
| `shortUrl` | string (url) | URL courte |
| `shortLink` | string | Identifiant court URL-safe |
| `prefs` | object | Préférences du board (background, visibility, etc.) |
| `labelNames` | object | Noms des labels par couleur |
| `starred` | boolean | Board favori |
| `memberships` | array | Memberships du board |
| `dateLastActivity` | string (date-time) | Dernière activité |
| `dateLastView` | string (date-time) | Dernière consultation |

## Commande curl

### Lister les boards ouverts (recommandé)

```bash
curl -s "https://api.trello.com/1/members/me/boards?filter=open&fields=name,url,shortUrl,closed,dateLastActivity&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Tous les boards avec les listes

```bash
curl -s "https://api.trello.com/1/members/me/boards?filter=all&lists=open&fields=name,url,closed&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Champs minimaux

```bash
curl -s "https://api.trello.com/1/members/me/boards?fields=name,url&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
[
  {
    "id": "69c673d370bd697114e46db2",
    "name": "My Trello board",
    "url": "https://trello.com/b/Jp0vRU05/my-trello-board",
    "shortUrl": "https://trello.com/b/Jp0vRU05",
    "closed": false,
    "dateLastActivity": "2026-03-27T12:11:02.556Z"
  }
]
```

## Notes

- Utiliser `filter=open` pour ne voir que les boards actifs
- Ajouter `lists=open` pour récupérer les listes de chaque board en un seul appel
- Pour un board spécifique, préférer `GET /boards/{id}` directement
