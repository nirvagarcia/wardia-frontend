import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { CredentialUpdateSchema } from "@/server/modules/credentials/credentials.validation";
import * as credentialsService from "@/server/modules/credentials/credentials.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getUserIdFromCookies();
    const { id } = await params;
    const credential = await credentialsService.getCredentialById(id, userId);
    return res.ok(credential);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    if (statusCode === 404) return res.notFound(message);
    return res.serverError(message);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getUserIdFromCookies();
    const { id } = await params;
    const body = await req.json();
    const parsed = CredentialUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const credential = await credentialsService.updateCredential(id, userId, parsed.data);
    return res.ok(credential);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    if (statusCode === 404) return res.notFound(message);
    return res.serverError(message);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getUserIdFromCookies();
    const { id } = await params;
    await credentialsService.deleteCredential(id, userId);
    return res.noContent();
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    if (statusCode === 404) return res.notFound(message);
    return res.serverError(message);
  }
}

