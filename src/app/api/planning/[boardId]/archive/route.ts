import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import * as planningService from "@/server/modules/planning/planning.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { boardId } = await params;
    const board = await planningService.archiveBoard(boardId, userId);
    return res.ok(board);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
