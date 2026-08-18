# Architecture — `chess-game`

## Vue d'ensemble

```
app/page.tsx  (Server Component)
   └── <ChessGame />                        "use client"
        ├── new Chess()                     chess.js — arbitre des règles
        ├── <Chessboard options={…} />      react-chessboard v5 — rendu + drag & drop
        └── <PromotionPicker />             affiché seulement si `pending !== null`
```

Une seule frontière client/serveur : `page.tsx` est statique et n'importe que le composant.
Aucune donnée ne traverse le réseau, aucun `fetch`, aucune server action.

## État

| État | Type | Rôle |
|------|------|------|
| `game` | `Chess` | Instance **mutable**, créée une fois via l'initialiseur paresseux de `useState`. Détient l'historique complet — c'est elle qui rend `undo()` possible. |
| `state` | `{ fen, status, history }` | Photo immuable dérivée de `game`. Seul déclencheur de re-render. |
| `pending` | `PendingPromotion \| null` | `{ from, to }` d'une promotion en attente de choix. Non nul ⇒ overlay ouvert et plateau verrouillé. |

`status` et `history` sont dérivés, pas saisis : ils sont recalculés par `snapshot(game)` à chaque
mutation. Les paires de coups affichées (`turns`) sont recalculées au rendu, jamais stockées.

## Flux d'un coup

```
drag & drop
   └─> onPieceDrop({ sourceSquare, targetSquare })
        ├── targetSquare === null (sortie de plateau)  ──> false   (snapback)
        ├── game.moves({ square: from, verbose: true })
        │     ├── aucun coup vers `to`  ──────────────> false      (snapback, coup illégal)
        │     └── coup trouvé avec .promotion  ───────> setPending({from,to}) ; false
        └── play(from, to)
              ├── game.move()  → throw  ──────────────> false      (filet de sécurité)
              └── setState(snapshot(game))  ──────────> true
```

Choix de promotion :

```
<PromotionPicker onSelect={type} />
   └─> play(pending.from, pending.to, type)   →  setPending(null)
```

`onCancel` (clic hors modal) referme sans jouer : la position n'a pas bougé, rien à annuler.

## Dépendances

| Paquet | Version | Contrat utilisé |
|--------|---------|-----------------|
| `chess.js` | 1.4.0 | `move` (lève sur illégal), `moves({square, verbose})`, `fen`, `history`, `turn`, `undo`, `reset`, `isCheck/isCheckmate/isStalemate/isDraw`. |
| `react-chessboard` | 5.12.1 | API **v5** : props regroupées dans `options={{ … }}`. `onPieceDrop` reçoit un objet `{ piece, sourceSquare, targetSquare }` et retourne un booléen synchrone. Les exemples v2–v4 (props à plat, `(source, target)`) ne compilent pas. |

## Points de rupture connus

- Montée de `react-chessboard` : l'API `options` a déjà changé de forme entre majeures.
- `targetSquare` est nullable (`allowDragOffBoard`) — la garde est obligatoire.
- Position contrôlée par `state.fen` : toute animation « optimiste » côté plateau serait écrasée
  au re-render.

## Hors périmètre

Pas d'IA, pas de multijoueur réseau, pas de sauvegarde PGN/FEN. Un rechargement de page repart
d'une position initiale.
