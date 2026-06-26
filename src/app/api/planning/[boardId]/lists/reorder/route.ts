import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { ReorderSchema } from "@/server/modules/planning/planning.validation";
import * as planningService from "@/server/modules/planning/planning.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { boardId } = await params;
    const body = await req.json();
    const parsed = ReorderSchema.safeParse(body);
    if (!parsed.success) return res.badRequest(parsed.error.message);
    await planningService.reorderLists(boardId, userId, parsed.data.items);
    return res.noContent();
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
