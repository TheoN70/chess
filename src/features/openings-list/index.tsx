"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Opening, PlayerColor } from "@/lib/services/openings/openings.types";

type Props = {
  openings: Opening[];
};

export default function OpeningsList({ openings }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState<PlayerColor>("w");
  const [error, setError] = useState<string | null>(null);

  async function onCreate(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      const { createOpeningAction } = await import("./actions/create-opening.action");
      const opening = await createOpeningAction(name, color);
      router.push(`/ouvertures/${opening.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  async function onDelete(opening: Opening) {
    // ponytail: confirm() natif suffit pour un outil perso.
    if (!confirm(`Supprimer « ${opening.name} » ?`)) return;

    const { deleteOpeningAction } = await import("./actions/delete-opening.action");
    await deleteOpeningAction(opening.id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6" data-testid="openings-list">
      <form
        onSubmit={onCreate}
        className="flex flex-wrap items-end gap-2"
        data-testid="create-opening-form"
      >
        <label className="flex flex-col gap-1 text-sm">
          Nom de l’ouverture
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            data-testid="opening-name-input"
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
            placeholder="Ex. Partie italienne"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Je joue
          <select
            value={color}
            onChange={(event) => setColor(event.target.value as PlayerColor)}
            data-testid="opening-color-select"
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
          >
            <option value="w">Blancs</option>
            <option value="b">Noirs</option>
          </select>
        </label>
        <button
          type="submit"
          data-testid="create-opening-button"
          className="rounded bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Créer
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {openings.length === 0 ? (
        <p className="text-zinc-500">Aucune ouverture enregistrée pour l’instant.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {openings.map((opening) => (
            <li
              key={opening.id}
              data-testid="opening-item"
              className="flex flex-wrap items-center gap-3 rounded border border-zinc-200 px-4 py-3 dark:border-zinc-700"
            >
              <span className="font-semibold">{opening.name}</span>
              <span className="text-sm text-zinc-500">
                {opening.color === "w" ? "Blancs" : "Noirs"} —{" "}
                {opening.lines.length} ligne{opening.lines.length > 1 ? "s" : ""}
              </span>
              <span className="ml-auto flex gap-2">
                <Link
                  href={`/ouvertures/${opening.id}/entrainement`}
                  data-testid="train-opening-link"
                  className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  Entraînement
                </Link>
                <Link
                  href={`/ouvertures/${opening.id}`}
                  data-testid="edit-opening-link"
                  className="rounded border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
                >
                  Édition
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(opening)}
                  data-testid="delete-opening-button"
                  className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                >
                  Supprimer
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
