import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { getUserIdFromCookies } from "@/server/lib/jwt";
import * as periodsService from "@/server/modules/transactions/periods.service";

export async function GET() {
  try {
    const userId = await getUserIdFromCookies();
    const period = await periodsService.getOrCreateCurrentPeriod(userId);
    return res.ok({
      id: period.id,
      label: period.label,
      startDate: period.startDate.toISOString(),
      endDate: period.endDate?.toISOString() ?? null,
    });
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}
