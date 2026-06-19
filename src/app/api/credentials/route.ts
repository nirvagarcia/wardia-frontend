import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { CredentialCreateSchema } from "@/server/modules/credentials/credentials.validation";
import * as credentialsService from "@/server/modules/credentials/credentials.service";

const USER_ID = process.env["WARDIA_USER_ID"] ?? "default-user";

export async function GET() {
  try {
    const credentials = await credentialsService.getCredentials(USER_ID);
    return res.ok(credentials);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CredentialCreateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const credential = await credentialsService.createCredential(USER_ID, parsed.data);
    return res.created(credential);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}
