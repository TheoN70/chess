# Feature `openings-list`

Liste des ouvertures du répertoire (`/ouvertures`) : création (nom + camp), liens
Édition / Entraînement, suppression avec `confirm()` natif.

## Fichiers

| Fichier | Rôle |
|---------|------|
| `index.tsx` | Composant client : formulaire de création, liste, suppression. |
| `actions/create-opening.action.ts` | Valide nom/couleur, `OpeningsService.create`, retourne l'ouverture (le client redirige vers l'éditeur). |
| `actions/delete-opening.action.ts` | `OpeningsService.delete`. |

## Mécanismes clés

- Données en props depuis la page serveur (`force-dynamic`) ; après suppression, `router.refresh()`.
- Actions importées **dynamiquement** dans les handlers (convention projet).
- Persistance : `data/openings.json` via `OpeningsService` (`src/lib/services/openings/`).
