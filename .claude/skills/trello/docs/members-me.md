# GET /members/me

Récupère les informations du membre authentifié (l'utilisateur courant).

**Méthode :** `GET`
**Path :** `/members/me` (alias de `/members/{id}` avec `id=me`)
**Documentation officielle :** https://developer.atlassian.com/cloud/trello/rest/api-group-members/#api-members-id-get

## Path Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `id` | string | Oui | Identifiant du membre. Utiliser `me` pour l'utilisateur courant, ou un `username`, ou un TrelloID. |

## Query Parameters

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| `fields` | string | Non | `all` | Champs du membre à retourner, séparés par des virgules |
| `boards` | string | Non | `none` | Inclure les boards. Valeurs : `all`, `open`, `closed`, `none` |
| `boardFields` | string | Non | `name,closed,idOrganization,pinned` | Champs des boards à inclure |
| `boardStars` | boolean | Non | `false` | Inclure les boards favoris |
| `cards` | string | Non | `none` | Inclure les cartes. Valeurs : `all`, `open`, `closed`, `none` |
| `organizations` | string | Non | `none` | Inclure les organisations. Valeurs : `all`, `none` |
| `organizationFields` | string | Non | `all` | Champs des organisations à inclure |
| `actions` | string | Non | `none` | Inclure les actions récentes |
| `notifications` | string | Non | `none` | Inclure les notifications |
| `notificationsFilter` | string | Non | - | Filtrer les notifications par type |
| `savedSearches` | boolean | Non | `false` | Inclure les recherches sauvegardées |
| `boardBackgrounds` | string | Non | `none` | Inclure les fonds de board |
| `customBoardBackgrounds` | string | Non | `none` | Inclure les fonds personnalisés |
| `customEmoji` | string | Non | `none` | Inclure les emojis personnalisés |
| `customStickers` | string | Non | `none` | Inclure les stickers personnalisés |
| `paid` | boolean | Non | `false` | Inclure le statut de compte payant |

## Champs du membre (`fields`)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | TrelloID | Identifiant unique du membre |
| `fullName` | string | Nom complet |
| `username` | string | Nom d'utilisateur |
| `email` | string | Adresse email (visible uniquement pour soi-même) |
| `url` | string (url) | URL du profil Trello |
| `avatarHash` | string | Hash de l'avatar |
| `avatarUrl` | string (url) | URL de l'avatar |
| `initials` | string | Initiales |
| `memberType` | string | Type de membre (`normal`, `admin`, `ghost`) |
| `confirmed` | boolean | Compte confirmé |
| `activityBlocked` | boolean | Activité bloquée |
| `bio` | string | Biographie |
| `bioData` | object | Données de biographie (emoji) |
| `idBoards` | array | IDs des boards |
| `idOrganizations` | array | IDs des organisations |
| `idEnterprisesAdmin` | array | IDs des entreprises administrées |
| `products` | array | Produits associés |
| `status` | string | Statut du membre |
| `nonPublic` | object | Données non publiques |
| `nonPublicAvailable` | boolean | Données non publiques disponibles |

## Commande curl

### Infos de base (recommandé)

```bash
curl -s "https://api.trello.com/1/members/me?fields=fullName,username,email,url,avatarUrl,bio&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Avec les boards ouverts

```bash
curl -s "https://api.trello.com/1/members/me?fields=fullName,username&boards=open&boardFields=name,url,shortUrl&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

### Profil complet

```bash
curl -s "https://api.trello.com/1/members/me?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" | jq .
```

## Exemple de réponse

```json
{
  "id": "5abbe4b7ddc1b351ef961410",
  "fullName": "Antho",
  "username": "antho97",
  "email": "antho@example.com",
  "url": "https://trello.com/u/antho97",
  "avatarHash": "abc123def456",
  "avatarUrl": "https://trello-members.s3.amazonaws.com/abc123/avatar.png",
  "initials": "A",
  "memberType": "normal",
  "confirmed": true,
  "bio": "",
  "idBoards": ["69c673d370bd697114e46db2"],
  "idOrganizations": [],
  "status": "active"
}
```

## Notes

- `me` est un alias pratique — pas besoin de connaître son propre TrelloID
- Le champ `email` n'est visible que pour soi-même
- Utiliser `boards=open` pour récupérer la liste des boards en un seul appel
- Cet endpoint sert aussi à vérifier que l'authentification fonctionne (bootstrap)
