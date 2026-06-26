import { NextResponse } from "next/server";
import { handleRouteError } from "@/server/lib/api-error";
import { getUserIdFromCookies } from "@/server/lib/jwt";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env["NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"],
  api_key: process.env["CLOUDINARY_API_KEY"],
  api_secret: process.env["CLOUDINARY_API_SECRET"],
});

const STORAGE_WARNING_PERCENT = 80;

export async function POST() {
  try {
    await getUserIdFromCookies();

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "wardia/planning";
    const paramsToSign = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env["CLOUDINARY_API_SECRET"]!);

    let storageWarning = false;
    try {
      const usage = await cloudinary.api.usage();
      const usedPercent = (usage.storage.used / usage.storage.limit) * 100;
      if (usedPercent >= STORAGE_WARNING_PERCENT) storageWarning = true;
    } catch (usageErr) {
      console.error("[upload-url] storage usage check failed:", usageErr);
    }

    const response = NextResponse.json({
      data: {
        signature,
        timestamp,
        folder,
        cloudName: process.env["NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"],
        apiKey: process.env["CLOUDINARY_API_KEY"],
        storageWarning,
      },
    });

    if (storageWarning) response.headers.set("X-Storage-Warning", "true");
    return response;
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
