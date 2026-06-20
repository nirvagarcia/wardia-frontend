import { NextRequest } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { getUserIdFromCookies } from "@/server/lib/jwt";
import * as periodsService from "@/server/modules/transactions/periods.service";

export async function GET() {
  try {
    const userId = await getUserIdFromCookies();
    const periods = await periodsService.getAllPeriods(userId);
    return res.ok(
      periods.map((p) => ({
        id: p.id,
        label: p.label,
        startDate: p.startDate.toISOString(),
        endDate: p.endDate?.toISOString() ?? null,
      }))
    );
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookies();
    const body = (await req.json()) as { paymentDate: string; label: string };
    if (!body.paymentDate || !body.label) {
      return res.badRequest("paymentDate and label are required");
    }

    const [y, m, d] = body.paymentDate.split("-").map(Number);
    const paymentDate = new Date(Date.UTC(y!, m! - 1, d!));

    const newPeriod = await periodsService.startNewPeriod(userId, paymentDate, body.label);
    return res.ok({
      id: newPeriod.id,
      label: newPeriod.label,
      startDate: newPeriod.startDate.toISOString(),
      endDate: newPeriod.endDate?.toISOString() ?? null,
    });
  } catch (err) {
    const { message } = handleRouteError(err);
    return res.serverError(message);
  }
}
