import ChessGame from "@/features/chess-game";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-8">
      <h1 className="text-2xl font-bold">Échecs</h1>
      <ChessGame />
    </main>
  );
}
