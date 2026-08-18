"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import type { Opening } from "@/lib/services/openings/openings.types";

type Props = {
  opening: Opening;
};

const HINT_AFTER_ERRORS = 3;

export default function OpeningTrainer({ opening }: Props) {
  // La base est jouée d'emblée : l'entraînement démarre à la fin du tronc commun.
  const [game] = useState(() => {
    const chess = new Chess();
    for (const san of opening.base) chess.move(san);
    return chess;
  });
  const [fen, setFen] = useState(() => game.fen());
  const [lineIndex, setLineIndex] = useState(() =>
    Math.floor(Math.random() * opening.lines.length),
  );
  const [errors, setErrors] = useState(0);

  const line = [...opening.base, ...(opening.lines[lineIndex] ?? [])];
  const step = game.history().length;
  const expected = line[step];
  const finished = line.length > 0 && step >= line.length;
  const playerTurn = game.turn() === opening.color;

  // Coup adverse automatique (couvre le 1er coup quand le joueur a les Noirs).
  useEffect(() => {
    if (!expected || playerTurn) return;

    const timer = setTimeout(() => {
      game.move(expected);
      setFen(game.fen());
    }, 300);
    return () => clearTimeout(timer); // évite le double coup en StrictMode

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, lineIndex]);

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!targetSquare || !playerTurn || finished) return false;

    let move;
    try {
      move = game.move({
        from: sourceSquare as Square,
        to: targetSquare as Square,
        promotion: "q",
      });
    } catch {
      return false; // coup illégal
    }

    // Comparaison SAN exact : gère roque et désambiguïsation.
    if (move.san !== expected) {
      game.undo();
      setErrors((count) => count + 1);
      return false;
    }

    setErrors(0);
    setFen(game.fen());
    return true;
  }

  function restart(nextIndex: number) {
    game.reset();
    for (const san of opening.base) game.move(san);
    setErrors(0);
    setLineIndex(nextIndex);
    setFen(game.fen());
  }

  if (opening.lines.length === 0) {
    return (
      <p data-testid="trainer-empty">
        Aucune ligne enregistrée.{" "}
        <Link href={`/ouvertures/${opening.id}`} className="underline">
          Ajoutez-en dans l’éditeur.
        </Link>
      </p>
    );
  }

  // Indice : flèche sur le coup attendu après plusieurs erreurs.
  const hintMove =
    errors >= HINT_AFTER_ERRORS && expected
      ? game.moves({ verbose: true }).find((move) => move.san === expected)
      : undefined;

  return (
    <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
      <div className="w-full max-w-[560px] shrink-0" data-testid="trainer-chessboard">
        <Chessboard
          options={{
            id: "opening-trainer",
            position: fen,
            boardOrientation: opening.color === "b" ? "black" : "white",
            allowDragging: playerTurn && !finished,
            onPieceDrop,
            arrows: hintMove
              ? [{ startSquare: hintMove.from, endSquare: hintMove.to, color: "#16a34a" }]
              : [],
          }}
        />
      </div>

      <aside className="flex w-full flex-col gap-4 lg:max-w-xs">
        <p className="text-sm text-zinc-500">
          Ligne {lineIndex + 1}/{opening.lines.length} — vous jouez les{" "}
          {opening.color === "w" ? "Blancs" : "Noirs"}.
        </p>

        {opening.base.length > 0 && (
          <p className="font-mono text-sm text-zinc-500" data-testid="train-base">
            Base : {opening.base.join(" ")}
          </p>
        )}

        <p className="font-mono text-sm" data-testid="train-progress">
          {game.history().slice(opening.base.length).join(" ") || "À vous de jouer…"}
        </p>

        {errors > 0 && !finished && (
          <p className="text-sm font-semibold text-red-600" data-testid="train-error">
            Coup hors répertoire ({errors} erreur{errors > 1 ? "s" : ""})
            {errors >= HINT_AFTER_ERRORS ? " — suivez la flèche." : ""}
          </p>
        )}

        {finished && (
          <p className="text-lg font-semibold text-green-700" data-testid="train-finished">
            Ligne terminée !
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => restart(lineIndex)}
            data-testid="replay-line-button"
            className="rounded border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Rejouer cette ligne
          </button>
          {opening.lines.length > 1 && (
            <button
              type="button"
              onClick={() =>
                // Nouvelle ligne différente de l'actuelle.
                restart((lineIndex + 1 + Math.floor(Math.random() * (opening.lines.length - 1))) % opening.lines.length)
              }
              data-testid="next-line-button"
              className="rounded bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Autre ligne
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
