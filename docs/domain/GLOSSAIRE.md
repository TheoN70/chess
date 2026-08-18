# Glossaire

Vocabulaire métier du produit. Une entrée par terme ambigu ou spécifique au domaine.
Pré-rempli depuis la lecture du code — **à valider et enrichir**.

| Terme | Définition | Alias / Contexte |
|-------|------------|------------------|
| FEN | Chaîne décrivant une position complète (pièces, trait, roques, en passant, compteurs). Source de vérité passée au plateau. | Forsyth–Edwards Notation ; `state.fen` |
| SAN | Notation d'un coup lisible par un humain (`e4`, `Nf3`, `O-O`, `exd6`). Format de l'historique affiché. | Standard Algebraic Notation ; `game.history()` |
| Case / Square | Coordonnée du plateau, `a1` à `h8`. Type `Square` de chess.js. | `from`, `to`, `sourceSquare`, `targetSquare` |
| Coup / Move | Transition d'une position à une autre. Validé exclusivement par chess.js. | `game.move({ from, to, promotion })` |
| Promotion | Pion atteignant la dernière rangée, remplacé par une pièce au choix (dame, tour, fou, cavalier). Jamais automatique ici. | `PendingPromotion`, `PromotionPicker` |
| Roque | Coup double roi + tour. Joué en déplaçant le roi de deux cases. | SAN `O-O` / `O-O-O` |
| Prise en passant | Capture d'un pion adverse ayant avancé de deux cases, sur la case traversée. | SAN `exd6` |
| Échec | Le roi du joueur au trait est attaqué. | `game.isCheck()` |
| Échec et mat | Échec sans coup légal. Fin de partie. | `game.isCheckmate()` |
| Pat | Aucun coup légal sans être en échec. Partie nulle. | `game.isStalemate()` |
| Nulle | Fin de partie sans vainqueur (pat, matériel insuffisant, 50 coups, répétition). | `game.isDraw()` |
| Trait | Joueur dont c'est le tour. | `game.turn()` → `'w'` / `'b'` |
| Snapback | Retour visuel d'une pièce à sa case de départ quand le coup est refusé. | `onPieceDrop` retourne `false` |
