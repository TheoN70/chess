# Feature `opening-trainer`

Entraînement (`/ouvertures/[id]/entrainement`) : le joueur joue son camp, les coups adverses
pré-enregistrés sont joués automatiquement. Ligne tirée au hasard à l'arrivée.

La **base** de l'ouverture est jouée d'emblée (position de départ de l'entraînement) ; la séquence
attendue est `[...base, ...ligne]`, donc si le trait est à l'adversaire juste après la base, son
coup part automatiquement.

## Fichiers

| Fichier | Rôle |
|---------|------|
| `index.tsx` | Composant client : échiquier orienté, coup adverse auto, refus des coups hors ligne, indice. |

## Mécanismes clés

- **Coup adverse auto** : un `useEffect` sur `[fen, lineIndex]` — si ce n'est pas le trait du
  joueur, `setTimeout` 300 ms puis `game.move(expected)`. Le cleanup `clearTimeout` évite le
  double coup en StrictMode. Couvre aussi le 1er coup quand le joueur a les Noirs.
- **Refus** : `onPieceDrop` synchrone — le coup est joué, comparé en **SAN exact**
  (`move.san !== expected`, gère roque/désambiguïsation), puis `undo()` + compteur d'erreurs
  si hors ligne. Retour `false` = snapback.
- **Indice** : à 3 erreurs, flèche verte (`options.arrows`) sur le coup attendu, retrouvé via
  `game.moves({ verbose: true })`.
- `allowDragging` seulement au trait du joueur et si la ligne n'est pas finie.
- Aucune action serveur : données en props, lecture seule.
