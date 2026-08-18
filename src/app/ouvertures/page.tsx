import OpeningsService from "@/lib/services/openings/openings.service";
import OpeningsList from "@/features/openings-list";

export const dynamic = "force-dynamic";

export default async function OpeningsPage() {
  const openings = await OpeningsService.getAll();

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Ouvertures</h1>
      <OpeningsList openings={openings} />
    </main>
  );
}
