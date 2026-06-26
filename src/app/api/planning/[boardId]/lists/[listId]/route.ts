import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { ListUpdateSchema } from "@/server/modules/planning/planning.validation";
import * as planningService from "@/server/modules/planning/planning.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string; listId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { listId } = await params;
    const body = await req.json();
    const parsed = ListUpdateSchema.safeParse(body);
    if (!parsed.success) return res.badRequest(parsed.error.message);
    const list = await planningService.updateList(listId, userId, parsed.data);
    return res.ok(list);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ boardId: string; listId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { listId } = await params;
    await planningService.deleteList(listId, userId);
    return res.noContent();
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
