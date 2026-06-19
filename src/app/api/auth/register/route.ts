import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/server/modules/auth/auth.service";
import { registerSchema } from "@/server/modules/auth/auth.validation";
import { signToken, getCookieOptions, COOKIE_NAME } from "@/server/lib/jwt";
import { handleRouteError } from "@/server/lib/api-error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
    }

    const user = await authService.register(parsed.data);
    const token = await signToken({ userId: user.id, email: user.email });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, getCookieOptions());

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
