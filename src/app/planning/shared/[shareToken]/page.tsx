import { SharedBoardView } from "@/views/planning/shared";

export const metadata = { title: "Tablero Compartido — Wardia" };

export default async function SharedBoardPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const { shareToken } = await params;
  return <SharedBoardView shareToken={shareToken} />;
}
