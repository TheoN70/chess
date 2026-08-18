import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import type { Opening, PlayerColor } from "./openings.types";

const FILE = path.join(process.cwd(), "data", "openings.json");

// ponytail: fichier JSON mono-utilisateur, pas de verrou — passer à SQLite si multi-utilisateurs.
export default class OpeningsService {
  static async getAll(): Promise<Opening[]> {
    try {
      const openings: Opening[] = JSON.parse(await readFile(FILE, "utf-8"));
      // `base` ajoutée après coup : pas de migration de fichier.
      return openings.map((opening) => ({ ...opening, base: opening.base ?? [] }));
    } catch {
      return []; // fichier absent ou corrompu
    }
  }

  static async getById(id: string): Promise<Opening | null> {
    const openings = await OpeningsService.getAll();
    return openings.find((opening) => opening.id === id) ?? null;
  }

  static async create(name: string, color: PlayerColor): Promise<Opening> {
    const opening: Opening = { id: randomUUID(), name, color, base: [], lines: [] };
    const openings = await OpeningsService.getAll();
    await OpeningsService.writeAll([...openings, opening]);
    return opening;
  }

  static async update(opening: Opening): Promise<void> {
    const openings = await OpeningsService.getAll();
    await OpeningsService.writeAll(
      openings.map((existing) => (existing.id === opening.id ? opening : existing)),
    );
  }

  static async delete(id: string): Promise<void> {
    const openings = await OpeningsService.getAll();
    await OpeningsService.writeAll(openings.filter((opening) => opening.id !== id));
  }

  private static async writeAll(openings: Opening[]): Promise<void> {
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(openings, null, 2));
  }
}
