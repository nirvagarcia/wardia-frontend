import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/modules/auth/auth.service";
import { changePasswordSchema } from "@/server/modules/auth/auth.validation";
import { getUserIdFromCookies } from "@/server/lib/jwt";
import { handleRouteError } from "@/server/lib/api-error";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookies();
    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
    }

    await authService.changePassword(userId, parsed.data.currentPassword, parsed.data.newPassword);
    return NextResponse.json({ data: null });
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
