import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/server/modules/auth/auth.service";
import { forgotPasswordSchema } from "@/server/modules/auth/auth.validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
    }

    const baseUrl = process.env["NEXT_PUBLIC_BASE_URL"] ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    await authService.forgotPassword(parsed.data.email, baseUrl);

    return NextResponse.json({ data: null });
  } catch {
    return NextResponse.json({ data: null });
  }
}
