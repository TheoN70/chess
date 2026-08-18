import { notFound } from "next/navigation";
import OpeningsService from "@/lib/services/openings/openings.service";
import OpeningTrainer from "@/features/opening-trainer";

export const dynamic = "force-dynamic";

export default async function OpeningTrainPage({
  params,
}: PageProps<"/ouvertures/[id]/entrainement">) {
  const { id } = await params;
  const opening = await OpeningsService.getById(id);

  if (!opening) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Entraînement — {opening.name}</h1>
      <OpeningTrainer opening={opening} />
    </main>
  );
}
