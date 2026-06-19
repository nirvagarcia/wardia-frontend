import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { TransactionCreateSchema } from "@/server/modules/transactions/transactions.validation";
import * as txnService from "@/server/modules/transactions/transactions.service";

const USER_ID = process.env["WARDIA_USER_ID"] ?? "default-user";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get("month");

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

    const transactions = await txnService.getTransactionsByMonth(USER_ID, year, month);
    return res.ok(transactions);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TransactionCreateSchema.safeParse(body);
    if (!parsed.success) {
      return res.badRequest(parsed.error.message);
    }
    const transaction = await txnService.createTransaction(USER_ID, parsed.data);
    return res.created(transaction);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}
