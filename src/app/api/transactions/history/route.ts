import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import * as txnService from "@/server/modules/transactions/transactions.service";

const USER_ID = process.env["WARDIA_USER_ID"] ?? "default-user";

export async function GET() {
  try {
    const history = await txnService.getMonthlyHistory(USER_ID);
    return res.ok(history);
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}
