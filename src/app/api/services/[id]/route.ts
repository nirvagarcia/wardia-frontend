import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { ServiceUpdateSchema } from "@/server/modules/services/services.validation";
import * as servicesService from "@/server/modules/services/services.service";

const USER_ID = process.env["WARDIA_USER_ID"] ?? "default-user";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = ServiceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const service = await servicesService.updateService(id, USER_ID, parsed.data);
    return res.ok(service);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await servicesService.deleteService(id, USER_ID);
    return res.noContent();
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}
