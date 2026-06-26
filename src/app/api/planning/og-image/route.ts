import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError, ApiError } from "@/server/lib/api-error";
import { getUserIdFromCookies } from "@/server/lib/jwt";
import { z } from "zod";

const OgImageSchema = z.object({
  url: z.string().url("Invalid URL"),
});

const OG_IMAGE_RE = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i;
const OG_IMAGE_RE2 = /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i;

export async function POST(req: NextRequest) {
  try {
    await getUserIdFromCookies();

    const body = await req.json();
    const parsed = OgImageSchema.safeParse(body);
    if (!parsed.success) return res.badRequest(parsed.error.message);

    const { url } = parsed.data;

    if (!/^https?:\/\//i.test(url)) throw new ApiError("Only HTTP(S) URLs are allowed", 400);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Wardia/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return res.ok({ imageUrl: null });

    const html = await response.text();
    const match = OG_IMAGE_RE.exec(html) ?? OG_IMAGE_RE2.exec(html);
    const imageUrl = match?.[1] ?? null;

    return res.ok({ imageUrl });
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
