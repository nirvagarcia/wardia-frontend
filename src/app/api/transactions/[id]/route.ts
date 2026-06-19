import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { TransactionUpdateSchema } from "@/server/modules/transactions/transactions.validation";
import * as txnService from "@/server/modules/transactions/transactions.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getUserIdFromCookies();
    const { id } = await params;
    const body = await req.json();
    const parsed = TransactionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const transaction = await txnService.updateTransaction(id, userId, parsed.data);
    return res.ok(transaction);
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
    await txnService.deleteTransaction(id, userId);
    return res.noContent();
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    if (statusCode === 404) return res.notFound(message);
    return res.serverError(message);
  }
}
