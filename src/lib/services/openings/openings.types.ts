export type PlayerColor = "w" | "b";

export type Opening = {
  id: string;
  name: string;
  color: PlayerColor; // camp joué par l'utilisateur
  base: string[]; // tronc commun en SAN, joué d'emblée à l'entraînement
  lines: string[][]; // chaque ligne = coups SAN des deux camps, à la suite de la base
};
