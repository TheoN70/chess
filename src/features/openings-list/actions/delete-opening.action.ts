"use server";

import OpeningsService from "@/lib/services/openings/openings.service";

export async function deleteOpeningAction(id: string): Promise<void> {
  if (!id) throw new Error("Id requis");

  await OpeningsService.delete(id);
}
