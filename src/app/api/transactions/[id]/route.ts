import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { TransactionUpdateSchema } from "@/server/modules/transactions/transactions.validation";
import * as txnService from "@/server/modules/transactions/transactions.service";

const USER_ID = process.env["WARDIA_USER_ID"] ?? "default-user";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = TransactionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const transaction = await txnService.updateTransaction(id, USER_ID, parsed.data);
    return res.ok(transaction);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    if (statusCode === 404) return res.notFound(message);
    return res.serverError(message);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await txnService.deleteTransaction(id, USER_ID);
    return res.noContent();
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    if (statusCode === 404) return res.notFound(message);
    return res.serverError(message);
  }
}
