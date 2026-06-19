import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/modules/auth/auth.service";
import { resetPasswordSchema } from "@/server/modules/auth/auth.validation";
import { handleRouteError } from "@/server/lib/api-error";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
    }

    await authService.resetPassword(parsed.data.token, parsed.data.password);
    return NextResponse.json({ data: null });
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
