# Audit sécurité — `chess-game`

## Surface d'attaque

Quasi nulle en l'état : page statique, 100 % côté client, aucune entrée utilisateur textuelle,
aucun appel réseau, aucun stockage, aucune authentification. Les deux seules sources d'entrée
sont le drag & drop et les 4 boutons de l'overlay — toutes deux contraintes par l'UI.

Ce document existe pour que les invariants restent explicites **si** le périmètre s'élargit
(sauvegarde de partie, multijoueur, import PGN/FEN).

## Invariants

| # | Invariant | Où | Statut |
|---|-----------|----|--------|
| 1 | **Aucune règle d'échecs n'est réimplémentée.** La légalité d'un coup est décidée uniquement par `chess.js`, jamais par du code applicatif. | `onPieceDrop`, `play` | Tenu |
| 2 | **Double filet sur le coup.** Le coup est cherché dans `game.moves({verbose})` *puis* `game.move()` est appelé dans un `try/catch`. Un coup absent des coups légaux ne peut pas être joué. | `index.tsx` | Tenu |
| 3 | **La promotion est un choix explicite.** Aucun défaut silencieux en dame : tant que `pending` est non nul, aucun coup n'est appliqué. | `PromotionPicker` | Tenu |
| 4 | **Pas de coup concurrent pendant une promotion.** `allowDragging: !pending` verrouille le plateau. | `index.tsx` | Tenu |
| 5 | **`targetSquare` est traité comme nullable.** Un drop hors plateau ne déréférence rien. | `onPieceDrop` | Tenu |
| 6 | **Aucun `dangerouslySetInnerHTML`, aucun `eval`, aucune chaîne utilisateur rendue.** Les seuls textes affichés sont des littéraux et du SAN produit par `chess.js`. | tout le module | Tenu |
| 7 | **Aucune donnée persistée ni transmise.** Pas de `localStorage`, pas de cookie, pas de `fetch`. Rien à fuiter. | tout le module | Tenu |

## Si le périmètre s'élargit

- **Import PGN/FEN** — première vraie frontière de confiance. Toute chaîne entrante doit passer par
  `chess.js` (`load()` / `loadPgn()`) dans un `try/catch` et être rejetée sur erreur ; ne jamais
  l'injecter directement dans `state.fen`, qui est aujourd'hui supposé toujours valide.
- **Multijoueur réseau** — l'invariant 1 devient insuffisant côté client seul : le serveur doit
  rejouer et valider chaque coup, et vérifier que l'émetteur est bien le joueur au trait.
  La validation client resterait purement ergonomique.
- **Persistance** — pas de donnée personnelle dans une partie ; le risque porterait sur
  l'identification des joueurs, pas sur la position.

## Accessibilité (contrôlé au passage)

Boutons de promotion : `aria-label` + `title` explicites, `type="button"`. Le plateau reste
manipulable à la souris/tactile uniquement — **pas de jeu au clavier**, limitation connue de
l'implémentation actuelle.
