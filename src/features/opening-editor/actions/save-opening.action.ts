"use server";

import { Chess } from "chess.js";
import OpeningsService from "@/lib/services/openings/openings.service";
import type { Opening } from "@/lib/services/openings/openings.types";

export async function saveOpeningAction(opening: Opening): Promise<void> {
  if (!opening.name.trim()) throw new Error("Nom requis");
  if (opening.color !== "w" && opening.color !== "b") throw new Error("Couleur invalide");
  if (!(await OpeningsService.getById(opening.id))) throw new Error("Ouverture inconnue");

  // chess.js est l'arbitre : la base puis chaque ligne sont rejouées coup par coup.
  for (const line of [[], ...opening.lines]) {
    const game = new Chess();
    for (const san of [...opening.base, ...line]) {
      try {
        game.move(san);
      } catch {
        throw new Error(`Ligne invalide : coup « ${san} »`);
      }
    }
  }

  await OpeningsService.update({
    ...opening,
    name: opening.name.trim(),
    lines: opening.lines.filter((line) => line.length > 0),
  });
}
