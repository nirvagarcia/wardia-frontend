import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { CredentialCreateSchema } from "@/server/modules/credentials/credentials.validation";
import * as credentialsService from "@/server/modules/credentials/credentials.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function GET() {
  try {
    const userId = await getUserIdFromCookies();
    const credentials = await credentialsService.getCredentials(userId);
    return res.ok(credentials);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookies();
    const body = await req.json();
    const parsed = CredentialCreateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const credential = await credentialsService.createCredential(userId, parsed.data);
    return res.created(credential);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}
