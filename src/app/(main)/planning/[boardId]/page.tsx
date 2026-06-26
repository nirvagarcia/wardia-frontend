import BoardDetailPage from "@/modules/planning/BoardDetailPage";

export const metadata = { title: "Tablero — Wardia" };

export default async function Page({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = await params;
  return <BoardDetailPage boardId={boardId} />;
}
