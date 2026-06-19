import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/modules/auth/auth.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";
import { handleRouteError } from "@/server/lib/api-error";
import { updatePreferencesSchema } from "@/server/modules/auth/auth.validation";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookies();
    const body = await req.json();
    const parsed = updatePreferencesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
    }
    await authService.updatePreferences(userId, parsed.data);
    return NextResponse.json({ data: null });
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
