import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { ServiceCreateSchema } from "@/server/modules/services/services.validation";
import * as servicesService from "@/server/modules/services/services.service";

const USER_ID = process.env["WARDIA_USER_ID"] ?? "default-user";

export async function GET() {
  try {
    const result = await servicesService.getServices(USER_ID);
    return res.ok(result);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ServiceCreateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const service = await servicesService.createService(USER_ID, parsed.data);
    return res.created(service);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}
