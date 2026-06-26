import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import * as planningService from "@/server/modules/planning/planning.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ boardId: string; listId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { listId } = await params;
    const list = await planningService.completeList(listId, userId);
    return res.ok(list);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
