import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { TransactionCreateSchema } from "@/server/modules/transactions/transactions.validation";
import * as txnService from "@/server/modules/transactions/transactions.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookies();
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const monthParam = searchParams.get("month");

    if (startDateParam) {
      const [sy, sm, sd] = startDateParam.split("-").map(Number);
      const start = new Date(sy!, sm! - 1, sd!);
      const end = endDateParam
        ? (() => { const [ey, em, ed] = endDateParam.split("-").map(Number); return new Date(ey!, em! - 1, ed!); })()
        : null;
      const transactions = await txnService.getTransactionsByDateRange(userId, start, end);
      return res.ok(transactions);
    }

    let year: number;
    let month: number;

    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split("-").map(Number);
      year = y!;
      month = m!;
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth() + 1;
    }

    const transactions = await txnService.getTransactionsByMonth(userId, year, month);
    return res.ok(transactions);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookies();
    const body = await req.json();
    const parsed = TransactionCreateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const transaction = await txnService.createTransaction(userId, parsed.data);
    return res.created(transaction);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}
