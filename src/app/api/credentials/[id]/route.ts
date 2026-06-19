import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { CredentialUpdateSchema } from "@/server/modules/credentials/credentials.validation";
import * as credentialsService from "@/server/modules/credentials/credentials.service";

const USER_ID = process.env["WARDIA_USER_ID"] ?? "default-user";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const credential = await credentialsService.getCredentialById(id, USER_ID);
    return res.ok(credential);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    if (statusCode === 404) return res.notFound(message);
    return res.serverError(message);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = CredentialUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const credential = await credentialsService.updateCredential(id, USER_ID, parsed.data);
    return res.ok(credential);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    if (statusCode === 404) return res.notFound(message);
    return res.serverError(message);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await credentialsService.deleteCredential(id, USER_ID);
    return res.noContent();
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    if (statusCode === 404) return res.notFound(message);
    return res.serverError(message);
  }
}

