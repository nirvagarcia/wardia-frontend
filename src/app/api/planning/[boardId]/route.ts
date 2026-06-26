import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { BoardUpdateSchema } from "@/server/modules/planning/planning.validation";
import * as planningService from "@/server/modules/planning/planning.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { boardId } = await params;
    const board = await planningService.getBoardDetail(boardId, userId);
    return res.ok(board);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { boardId } = await params;
    const body = await req.json();
    const parsed = BoardUpdateSchema.safeParse(body);
    if (!parsed.success) return res.badRequest(parsed.error.message);
    const board = await planningService.updateBoard(boardId, userId, parsed.data);
    return res.ok(board);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { boardId } = await params;
    await planningService.deleteBoard(boardId, userId);
    return res.noContent();
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
