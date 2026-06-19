import { NextResponse } from "next/server";
import { handleRouteError } from "@/server/lib/api-error";
import * as txnService from "@/server/modules/transactions/transactions.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function GET() {
  try {
    const userId = await getUserIdFromCookies();
    const history = await txnService.getMonthlyHistory(userId);
    return NextResponse.json({ data: history });
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
