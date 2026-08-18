"use client";

import type { Color, PieceSymbol } from "chess.js";

const GLYPHS: Record<"w" | "b", Record<string, string>> = {
  w: { q: "♕", r: "♖", b: "♗", n: "♘" },
  b: { q: "♛", r: "♜", b: "♝", n: "♞" },
};

const CHOICES = [
  { type: "q", label: "Dame" },
  { type: "r", label: "Tour" },
  { type: "b", label: "Fou" },
  { type: "n", label: "Cavalier" },
] as const;

type Props = {
  color: Color;
  onSelect: (piece: PieceSymbol) => void;
  onCancel: () => void;
};

export default function PromotionPicker({ color, onSelect, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      data-testid="promotion-overlay"
      onClick={onCancel}
    >
      <div
        className="rounded-lg bg-white p-4 shadow-xl dark:bg-zinc-800"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="mb-3 text-center text-sm font-medium">Promotion</p>
        <div className="flex gap-2">
          {CHOICES.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              title={label}
              aria-label={label}
              data-testid={`promotion-${type}`}
              className="flex h-16 w-16 items-center justify-center rounded border border-zinc-300 text-4xl leading-none hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
              onClick={() => onSelect(type)}
            >
              {GLYPHS[color][type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
