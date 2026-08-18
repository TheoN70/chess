# Feature `opening-editor`

Éditeur d'une ouverture (`/ouvertures/[id]`) : une **base** (tronc commun) puis des lignes
(coups SAN des **deux** camps, à la suite de la base), saisies sur l'échiquier ou par import PGN.

## Fichiers

| Fichier | Rôle |
|---------|------|
| `index.tsx` | Composant client : échiquier libre, gestion des lignes, import PGN, sauvegarde. |
| `actions/save-opening.action.ts` | Valide (nom, couleur, **rejoue chaque ligne avec chess.js**), `OpeningsService.update`. |

## Mécanismes clés

- **Base** : l'échiquier part toujours de `opening.base` (rejouée à l'init et par `resetToBase`).
  `history().slice(base.length)` = la ligne en cours. « Définir ici » fige les coups actuels comme
  base ; comme les lignes stockées sont relatives à la base, la redéfinir **supprime les lignes**
  (confirmation).
- Pattern `chess-game` : instance `Chess` mutable + `fen` dans l'état pour le re-render.
- **Auto-dame** : `promotion: "q"` systématique (ignoré hors promotion) — pas de promotion-picker,
  la sous-promotion n'existe pas dans une ligne d'ouverture.
- « Enregistrer la ligne » pousse `game.history()` dans `lines` puis reset ; « Reprendre » rejoue
  une ligne existante sur l'échiquier pour brancher une variante sans tout resaisir.
- Import PGN : `new Chess().loadPgn()` sur instance jetable, try/catch. Le PGN part de la position
  initiale : il doit commencer par la base, sinon rejeté ; seule la suite est stockée. 1 PGN = 1 ligne.
- **Tout est persisté immédiatement** (`persist(name, base, lines)` → `saveOpeningAction`) :
  enregistrement/suppression de ligne, import PGN, base, nom au blur. Pas de bouton « Enregistrer ».
