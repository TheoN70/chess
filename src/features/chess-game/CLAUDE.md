# Feature `chess-game`

Partie d'échecs locale à deux joueurs, un seul écran, tour par tour. Aucune IA, aucun réseau,
aucune persistance. Les règles ne sont **jamais** réimplémentées : `chess.js` est l'unique arbitre.

## Commandes

```bash
npm run dev        # http://localhost:3000
npm run build      # inclut le typecheck
npm run lint
npx tsc --noEmit
```

Pas de suite de tests. Les hypothèses sur l'API `chess.js` (promotion, roque, en passant, mat,
pat, coup illégal, undo) ont été vérifiées par un script d'assertions jetable — à re-jouer à la
main en cas de montée de version majeure de `chess.js`.

## Fichiers

| Fichier | Rôle |
|---------|------|
| `index.tsx` | Composant client principal : instance `Chess`, état, drag & drop, statut, historique, reset/undo. |
| `components/promotion-picker/index.tsx` | Overlay modal de choix de la pièce de promotion (dame/tour/fou/cavalier). |
| `docs/ARCHITECTURE.md` | Flux de données, découpage de l'état, contrat avec les deux libs. |
| `docs/AUDIT_SECURITE.md` | Invariants de sécurité et surface d'attaque. |

Pas de `docs/API.md` : la feature n'expose aucun endpoint.

## Mécanismes clés

- **Instance mutable, état immuable.** `useState(() => new Chess())` garde une instance stable ;
  chaque coup la mute puis `snapshot(game)` produit un nouvel objet `{ fen, status, history }`
  qui déclenche le re-render. Muter `game` sans appeler `setState` ne réaffiche rien.
- **Détection de promotion avant le coup.** `game.moves({ square, verbose: true })` sert à la fois
  de validation et de détection : si le coup trouvé porte `.promotion`, on ouvre l'overlay au lieu
  de jouer. `game.moves()` renvoie une entrée par pièce de promotion — tester la troncature
  (`move?.promotion`), pas une valeur précise.
- **Snapback.** `onPieceDrop` doit retourner un booléen **synchrone**. Une promotion en attente
  retourne `false` : la position reste pilotée par `state.fen`, le coup s'applique après le choix.
- **Plateau verrouillé pendant la promotion.** `allowDragging: !pending` empêche de jouer un autre
  coup tant que l'overlay est ouvert.
- **Statut dérivé.** `getStatus(game)` est pure et lue dans cet ordre : mat → pat → nulle → échec →
  trait. L'ordre compte (`isDraw()` est vrai en cas de pat).

## Voir aussi

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — flux détaillé
- [`docs/AUDIT_SECURITE.md`](docs/AUDIT_SECURITE.md) — invariants
- [`/docs/domain/GLOSSAIRE.md`](../../../docs/domain/GLOSSAIRE.md) — FEN, SAN, pat, roque…
