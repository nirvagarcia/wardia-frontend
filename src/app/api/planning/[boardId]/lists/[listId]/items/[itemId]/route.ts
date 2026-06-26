import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { ItemUpdateSchema } from "@/server/modules/planning/planning.validation";
import * as planningService from "@/server/modules/planning/planning.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string; listId: string; itemId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { itemId } = await params;
    const body = await req.json();
    const parsed = ItemUpdateSchema.safeParse(body);
    if (!parsed.success) return res.badRequest(parsed.error.message);
    const item = await planningService.updateItem(itemId, userId, parsed.data);
    return res.ok(item);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ boardId: string; listId: string; itemId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { itemId } = await params;
    await planningService.deleteItem(itemId, userId);
    return res.noContent();
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
