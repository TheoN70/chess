"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import type { PieceSymbol, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import PromotionPicker from "@/features/chess-game/components/promotion-picker";

type GameState = {
  fen: string;
  status: string;
  history: string[];
};

type PendingPromotion = {
  from: Square;
  to: Square;
};

function getStatus(game: Chess): string {
  const player = game.turn() === "w" ? "Blancs" : "Noirs";

  if (game.isCheckmate()) return `Échec et mat — les ${player} perdent`;
  if (game.isStalemate()) return "Pat — partie nulle";
  if (game.isDraw()) return "Partie nulle";
  if (game.isCheck()) return `Trait aux ${player} — échec !`;
  return `Trait aux ${player}`;
}

function snapshot(game: Chess): GameState {
  return { fen: game.fen(), status: getStatus(game), history: game.history() };
}

export default function ChessGame() {
  const [game] = useState(() => new Chess());
  const [state, setState] = useState<GameState>(() => snapshot(game));
  const [pending, setPending] = useState<PendingPromotion | null>(null);

  function play(from: Square, to: Square, promotion?: PieceSymbol): boolean {
    try {
      game.move({ from, to, promotion });
    } catch {
      return false;
    }
    setState(snapshot(game));
    return true;
  }

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!targetSquare) return false;

    const from = sourceSquare as Square;
    const to = targetSquare as Square;

    // Promotion détectée avant de jouer : on attend le choix du joueur.
    const move = game
      .moves({ square: from, verbose: true })
      .find((candidate) => candidate.to === to);

    if (move?.promotion) {
      setPending({ from, to });
      return false;
    }

    return play(from, to);
  }

  function onPromotionSelect(promotion: PieceSymbol) {
    if (pending) play(pending.from, pending.to, promotion);
    setPending(null);
  }

  function onReset() {
    game.reset();
    setPending(null);
    setState(snapshot(game));
  }

  function onUndo() {
    game.undo();
    setPending(null);
    setState(snapshot(game));
  }

  // ponytail: paires calculées à l'affichage, pas stockées.
  const turns = Array.from(
    { length: Math.ceil(state.history.length / 2) },
    (_, index) => state.history.slice(index * 2, index * 2 + 2),
  );

  return (
    <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
      <div className="w-full max-w-[560px] shrink-0" data-testid="chessboard">
        <Chessboard
          options={{
            id: "chess-game",
            position: state.fen,
            onPieceDrop,
            allowDragging: !pending,
          }}
        />
      </div>

      <aside className="flex w-full flex-col gap-4 lg:max-w-xs">
        <p className="text-lg font-semibold" data-testid="game-status">
          {state.status}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            data-testid="reset-button"
            onClick={onReset}
            className="rounded bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Nouvelle partie
          </button>
          <button
            type="button"
            data-testid="undo-button"
            onClick={onUndo}
            disabled={state.history.length === 0}
            className="rounded border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Annuler le dernier coup
          </button>
        </div>

        <ol
          className="max-h-80 overflow-y-auto font-mono text-sm"
          data-testid="move-history"
        >
          {turns.map(([white, black], index) => (
            <li key={index} className="flex gap-2 py-0.5">
              <span className="w-8 text-zinc-500">{index + 1}.</span>
              <span className="w-20">{white}</span>
              <span className="w-20">{black ?? ""}</span>
            </li>
          ))}
        </ol>
      </aside>

      {pending && (
        <PromotionPicker
          color={game.turn()}
          onSelect={onPromotionSelect}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
