"use server";

import OpeningsService from "@/lib/services/openings/openings.service";
import type { Opening, PlayerColor } from "@/lib/services/openings/openings.types";

export async function createOpeningAction(
  name: string,
  color: PlayerColor,
): Promise<Opening> {
  if (!name.trim()) throw new Error("Nom requis");
  if (color !== "w" && color !== "b") throw new Error("Couleur invalide");

  return OpeningsService.create(name.trim(), color);
}
