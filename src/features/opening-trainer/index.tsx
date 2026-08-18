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

type Mode = "shuffle" | "random";
type Hint = "none" | "piece" | "move";

// Fisher-Yates.
function shuffled(count: number) {
  const indexes = [...Array(count).keys()];
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

// File d'une seule ligne tirée au sort : répétitions possibles.
function randomPick(count: number) {
  return [Math.floor(Math.random() * count)];
}

export default function OpeningTrainer({ opening }: Props) {
  // La base est jouée d'emblée : l'entraînement démarre à la fin du tronc commun.
  const [game] = useState(() => {
    const chess = new Chess();
    for (const san of opening.base) chess.move(san);
    return chess;
  });
  const [fen, setFen] = useState(() => game.fen());
  const [mode, setMode] = useState<Mode>("shuffle");
  // File d'attente : la ligne courante est en tête, « suivante » défile.
  const [queue, setQueue] = useState<number[]>(() => shuffled(opening.lines.length));
  const [errors, setErrors] = useState(0);
  // Aide demandée par le joueur : pièce en surbrillance, puis coup complet.
  const [hint, setHint] = useState<Hint>("none");

  const lineIndex = queue[0] ?? 0;
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
    setHint("none");
    setFen(game.fen());
    return true;
  }

  function restart() {
    game.reset();
    for (const san of opening.base) game.move(san);
    setErrors(0);
    setHint("none");
    setFen(game.fen());
  }

  function nextLine() {
    setQueue(
      mode === "random"
        ? randomPick(opening.lines.length)
        : // Mélange épuisé → on remélange pour un nouveau tour.
          queue.length > 1
          ? queue.slice(1)
          : shuffled(opening.lines.length),
    );
    restart();
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setQueue(
      nextMode === "random"
        ? randomPick(opening.lines.length)
        : shuffled(opening.lines.length),
    );
    restart();
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

  // Aide affichée : demandée par le joueur, ou automatique après plusieurs erreurs.
  const level: Hint = errors >= HINT_AFTER_ERRORS && hint === "none" ? "piece" : hint;
  const hintMove =
    level !== "none" && expected && playerTurn && !finished
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
            // Surbrillance de la pièce à jouer ; la flèche n'apparaît qu'au niveau « coup ».
            squareStyles: hintMove
              ? { [hintMove.from]: { boxShadow: "inset 0 0 0 4px #16a34a" } }
              : {},
            arrows:
              hintMove && level === "move"
                ? [{ startSquare: hintMove.from, endSquare: hintMove.to, color: "#16a34a" }]
                : [],
          }}
        />
      </div>

      <aside className="flex w-full flex-col gap-4 lg:max-w-xs">
        <p className="text-sm text-zinc-500">
          {mode === "shuffle"
            ? `Ligne ${opening.lines.length - queue.length + 1}/${opening.lines.length} du mélange`
            : `Ligne ${lineIndex + 1}/${opening.lines.length} (tirage aléatoire)`}{" "}
          — vous jouez les {opening.color === "w" ? "Blancs" : "Noirs"}.
        </p>

        {opening.lines.length > 1 && (
          <div className="flex gap-2 text-sm" data-testid="mode-switch">
            {(["shuffle", "random"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => changeMode(value)}
                data-testid={`mode-${value}-button`}
                title={
                  value === "shuffle"
                    ? "Toutes les lignes une fois, dans un ordre mélangé"
                    : "Une ligne au hasard à chaque fois, répétitions possibles"
                }
                className={
                  mode === value
                    ? "rounded bg-zinc-900 px-3 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "rounded border border-zinc-300 px-3 py-1 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
                }
              >
                {value === "shuffle" ? "Mélange" : "Aléatoire"}
              </button>
            ))}
          </div>
        )}

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
            {errors >= HINT_AFTER_ERRORS ? " — la pièce à jouer est surlignée." : ""}
          </p>
        )}

        {playerTurn && !finished && (
          <div className="flex flex-wrap items-center gap-2 text-sm" data-testid="hint-controls">
            <button
              type="button"
              onClick={() => setHint("piece")}
              disabled={level !== "none"}
              data-testid="hint-piece-button"
              className="rounded border border-zinc-300 px-3 py-1 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              Quelle pièce ?
            </button>
            <button
              type="button"
              onClick={() => setHint("move")}
              disabled={level === "move"}
              data-testid="hint-move-button"
              className="rounded border border-zinc-300 px-3 py-1 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              Voir le coup
            </button>
            {level === "move" && (
              <span className="font-mono font-semibold text-green-700" data-testid="expected-move">
                {expected}
              </span>
            )}
          </div>
        )}

        {finished && (
          <p className="text-lg font-semibold text-green-700" data-testid="train-finished">
            Ligne terminée !
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={restart}
            data-testid="replay-line-button"
            className="rounded border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Rejouer cette ligne
          </button>
          {opening.lines.length > 1 && (
            <button
              type="button"
              onClick={nextLine}
              data-testid="next-line-button"
              className="rounded bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {mode === "shuffle" ? "Ligne suivante" : "Autre ligne"}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
