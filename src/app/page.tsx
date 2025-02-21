import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    redirect(`/session/${uuidv4()}`);
  }

  return null;
}
