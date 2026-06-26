import { NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { getUserIdFromCookies } from "@/server/lib/jwt";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env["NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"],
  api_key: process.env["CLOUDINARY_API_KEY"],
  api_secret: process.env["CLOUDINARY_API_SECRET"],
});

export async function GET() {
  try {
    await getUserIdFromCookies();
    const usage = await cloudinary.api.usage();
    const usedBytes = usage.storage.used as number;
    const limitBytes = usage.storage.limit as number;
    const usedPercent = Math.round((usedBytes / limitBytes) * 100);

    return res.ok({
      usedMB: Math.round(usedBytes / 1024 / 1024),
      totalMB: Math.round(limitBytes / 1024 / 1024),
      usedPercent,
    });
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
