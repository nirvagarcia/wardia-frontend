import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/modules/auth/auth.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";
import { handleRouteError } from "@/server/lib/api-error";
import { updateProfileSchema } from "@/server/modules/auth/auth.validation";

export async function GET() {
  try {
    const userId = await getUserIdFromCookies();
    const user = await authService.getMe(userId);
    return NextResponse.json({ data: user });
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookies();
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
    }
    const user = await authService.updateProfile(userId, parsed.data);
    return NextResponse.json({ data: user });
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
