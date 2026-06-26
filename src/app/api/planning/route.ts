import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { BoardCreateSchema } from "@/server/modules/planning/planning.validation";
import * as planningService from "@/server/modules/planning/planning.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function GET() {
  try {
    const userId = await getUserIdFromCookies();
    const boards = await planningService.getBoards(userId);
    return res.ok(boards);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookies();
    const body = await req.json();
    const parsed = BoardCreateSchema.safeParse(body);
    if (!parsed.success) return res.badRequest(parsed.error.message);
    const board = await planningService.createBoard(userId, parsed.data);
    return res.created(board);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
