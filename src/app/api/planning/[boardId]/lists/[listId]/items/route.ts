import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { ItemCreateSchema } from "@/server/modules/planning/planning.validation";
import * as planningService from "@/server/modules/planning/planning.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string; listId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { boardId, listId } = await params;
    const body = await req.json();
    const parsed = ItemCreateSchema.safeParse(body);
    if (!parsed.success) return res.badRequest(parsed.error.message);
    const item = await planningService.createItem(listId, boardId, userId, parsed.data);
    return res.created(item);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
