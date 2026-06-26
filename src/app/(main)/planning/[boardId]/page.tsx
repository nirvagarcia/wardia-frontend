import { BoardDetailView } from "@/views/planning/board";

export const metadata = { title: "Tablero — Wardia" };

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  return <BoardDetailView boardId={boardId} />;
}
