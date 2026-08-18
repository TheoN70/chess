# Feature `opening-trainer`

Entraînement (`/ouvertures/[id]/entrainement`) : le joueur joue son camp, les coups adverses
pré-enregistrés sont joués automatiquement.

Deux modes (`mode`) : **Mélange** (défaut — toutes les lignes une fois, ordre Fisher-Yates, remélange
en fin de tour) et **Aléatoire** (tirage indépendant à chaque fois, répétitions possibles).

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
- **Indice** (`hint` : `none` → `piece` → `move`) : « Quelle pièce ? » surligne la case de départ
  (`options.squareStyles`), « Voir le coup » ajoute la flèche (`options.arrows`) + le SAN attendu.
  3 erreurs font passer automatiquement au niveau `piece`. Le coup est retrouvé via
  `game.moves({ verbose: true })`. Remis à `none` à chaque coup juste et à chaque relance.
- **File `queue`** : tableau d'index, la ligne courante est en tête. « Ligne suivante » fait
  `slice(1)` (mélange) ou `randomPick` (aléatoire). Position affichée = `lines.length - queue.length + 1`.
  Le mélange initial est dans l'initialiseur `useState` : rien dans le rendu SSR n'en dépend,
  donc pas de divergence d'hydratation (le tirage `Math.random` doit rester **hors du corps du
  composant**, sinon la règle `react-hooks/purity` casse le lint).
- `allowDragging` seulement au trait du joueur et si la ligne n'est pas finie.
- Aucune action serveur : données en props, lecture seule.
