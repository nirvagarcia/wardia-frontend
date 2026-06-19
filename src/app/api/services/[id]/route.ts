import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { ServiceUpdateSchema } from "@/server/modules/services/services.validation";
import * as servicesService from "@/server/modules/services/services.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { id } = await params;
    const body = await req.json();
    const parsed = ServiceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const service = await servicesService.updateService(id, userId, parsed.data);
    return res.ok(service);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { id } = await params;
    await servicesService.deleteService(id, userId);
    return res.noContent();
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
