import { notFound } from "next/navigation";
import OpeningsService from "@/lib/services/openings/openings.service";
import OpeningEditor from "@/features/opening-editor";

export const dynamic = "force-dynamic";

export default async function OpeningEditPage({ params }: PageProps<"/ouvertures/[id]">) {
  const { id } = await params;
  const opening = await OpeningsService.getById(id);

  if (!opening) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Édition — {opening.name}</h1>
      <OpeningEditor opening={opening} />
    </main>
  );
}
