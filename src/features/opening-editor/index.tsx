"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import type { Opening } from "@/lib/services/openings/openings.types";

type Props = {
  opening: Opening;
};

export default function OpeningEditor({ opening }: Props) {
  const router = useRouter();
  const [base, setBase] = useState<string[]>(opening.base);
  // L'échiquier part toujours de la base : les lignes en sont la suite.
  const [game] = useState(() => {
    const chess = new Chess();
    for (const san of opening.base) chess.move(san);
    return chess;
  });
  const [fen, setFen] = useState(() => game.fen());
  const [name, setName] = useState(opening.name);
  const [lines, setLines] = useState<string[][]>(opening.lines);
  const [pgn, setPgn] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!targetSquare) return false;

    try {
      // ponytail: auto-dame — la sous-promotion n'existe pas dans une ligne d'ouverture.
      game.move({ from: sourceSquare as Square, to: targetSquare as Square, promotion: "q" });
    } catch {
      return false;
    }
    setFen(game.fen());
    return true;
  }

  // Toute modification est persistée immédiatement.
  async function persist(nextName: string, nextBase: string[], nextLines: string[][]) {
    setFeedback(null);
    setName(nextName);
    setBase(nextBase);
    setLines(nextLines);

    try {
      const { saveOpeningAction } = await import("./actions/save-opening.action");
      await saveOpeningAction({
        ...opening,
        name: nextName,
        base: nextBase,
        lines: nextLines,
      });
      setFeedback("Enregistré");
      router.refresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  function resetToBase(nextBase: string[]) {
    game.reset();
    for (const san of nextBase) game.move(san);
    setFen(game.fen());
  }

  function onSaveLine() {
    const line = game.history().slice(base.length);
    if (line.length === 0) return;

    persist(name, base, [...lines, line]);
    resetToBase(base);
  }

  function onSetBase() {
    const nextBase = game.history();
    // Les lignes existantes deviendraient incohérentes avec une autre base.
    if (lines.length > 0 && !confirm("Redéfinir la base supprimera les lignes existantes. Continuer ?"))
      return;

    persist(name, nextBase, []);
  }

  function onClearBase() {
    if (lines.length > 0 && !confirm("Supprimer la base supprimera les lignes existantes. Continuer ?"))
      return;

    persist(name, [], []);
    resetToBase([]);
  }

  function onImportPgn() {
    setFeedback(null);
    const parser = new Chess();

    try {
      parser.loadPgn(pgn);
    } catch {
      setFeedback("PGN invalide");
      return;
    }

    const moves = parser.history();

    // Le PGN part de la position initiale : il doit commencer par la base.
    if (!base.every((san, index) => moves[index] === san)) {
      setFeedback("Le PGN ne commence pas par la base de l’ouverture");
      return;
    }

    const line = moves.slice(base.length);
    if (line.length === 0) {
      setFeedback("PGN vide");
      return;
    }

    persist(name, base, [...lines, line]);
    setPgn("");
  }

  function onResumeLine(line: string[]) {
    resetToBase(base);
    for (const san of line) game.move(san);
    setFen(game.fen());
  }

  function onUndo() {
    game.undo();
    setFen(game.fen());
  }

  const history = game.history();
  const line = history.slice(base.length);

  return (
    <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
      <div className="w-full max-w-[560px] shrink-0" data-testid="editor-chessboard">
        <Chessboard
          options={{
            id: "opening-editor",
            position: fen,
            onPieceDrop,
          }}
        />
      </div>

      <aside className="flex w-full flex-col gap-4 lg:max-w-md">
        <label className="flex flex-col gap-1 text-sm">
          Nom de l’ouverture
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={(event) => persist(event.target.value, base, lines)}
            data-testid="opening-name-input"
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
          />
        </label>

        <div
          className="flex flex-wrap items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
          data-testid="base-panel"
        >
          <span className="font-semibold">Base :</span>
          <span className="grow font-mono text-zinc-500">
            {base.length > 0 ? base.join(" ") : "aucune (les lignes partent du début)"}
          </span>
          <button
            type="button"
            onClick={onSetBase}
            disabled={history.length === 0}
            title="Les coups actuellement sur l’échiquier deviennent le tronc commun"
            data-testid="set-base-button"
            className="rounded border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Définir ici
          </button>
          {base.length > 0 && (
            <button
              type="button"
              onClick={onClearBase}
              data-testid="clear-base-button"
              className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
            >
              Retirer
            </button>
          )}
        </div>

        <p className="font-mono text-sm text-zinc-500" data-testid="current-line">
          {line.length > 0
            ? line.join(" ")
            : "Jouez les coups des deux camps sur l’échiquier."}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSaveLine}
            disabled={line.length === 0}
            data-testid="save-line-button"
            className="rounded bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Enregistrer la ligne
          </button>
          <button
            type="button"
            onClick={onUndo}
            disabled={history.length === 0}
            data-testid="undo-button"
            className="rounded border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Annuler le coup
          </button>
          <button
            type="button"
            onClick={() => resetToBase(base)}
            disabled={line.length === 0}
            data-testid="reset-button"
            className="rounded border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            Revenir à la base
          </button>
        </div>

        <details className="text-sm">
          <summary className="cursor-pointer font-semibold">Importer un PGN</summary>
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              value={pgn}
              onChange={(event) => setPgn(event.target.value)}
              rows={4}
              data-testid="pgn-input"
              className="rounded border border-zinc-300 px-3 py-2 font-mono dark:border-zinc-600 dark:bg-zinc-900"
              placeholder="1. e4 e5 2. Nf3 Nc6 3. Bc4"
            />
            <button
              type="button"
              onClick={onImportPgn}
              disabled={!pgn.trim()}
              data-testid="import-pgn-button"
              className="self-start rounded border border-zinc-300 px-3 py-2 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              Importer comme ligne
            </button>
          </div>
        </details>

        <div className="flex flex-col gap-2" data-testid="lines-list">
          <h2 className="font-semibold">
            Lignes enregistrées ({lines.length})
          </h2>
          {lines.length === 0 && (
            <p className="text-sm text-zinc-500">Aucune ligne pour l’instant.</p>
          )}
          {lines.map((savedLine, index) => (
            <div
              key={index}
              data-testid="line-item"
              className="flex items-start gap-2 rounded border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
            >
              <span className="grow font-mono">{savedLine.join(" ")}</span>
              <button
                type="button"
                onClick={() => onResumeLine(savedLine)}
                data-testid="resume-line-button"
                title="Rejouer cette ligne sur l’échiquier pour créer une variante"
                className="shrink-0 rounded border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
              >
                Reprendre
              </button>
              <button
                type="button"
                onClick={() => persist(name, base, lines.filter((_, i) => i !== index))}
                data-testid="delete-line-button"
                className="shrink-0 rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        {feedback && (
          <p
            className={
              feedback === "Enregistré"
                ? "text-sm text-green-700"
                : "text-sm text-red-600"
            }
            data-testid="editor-feedback"
          >
            {feedback}
          </p>
        )}
      </aside>
    </div>
  );
}
