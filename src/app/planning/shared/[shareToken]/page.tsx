import SharedBoardPage from "@/modules/planning/SharedBoardPage";

export const metadata = { title: "Tablero Compartido — Wardia" };

export default async function Page({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params;
  return <SharedBoardPage shareToken={shareToken} />;
}
