import { NextRequest, NextResponse } from "next/server";
import * as res from "@/server/lib/api-response";
import { handleRouteError } from "@/server/lib/api-error";
import { PurchaseItemSchema } from "@/server/modules/planning/planning.validation";
import * as planningService from "@/server/modules/planning/planning.service";
import { getUserIdFromCookies } from "@/server/lib/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string; listId: string; itemId: string }> }
) {
  try {
    const userId = await getUserIdFromCookies();
    const { itemId } = await params;
    const body = await req.json();
    const parsed = PurchaseItemSchema.safeParse(body);
    if (!parsed.success) return res.badRequest(parsed.error.message);

    const item = await planningService.purchaseItem(itemId, userId, parsed.data);

    if (parsed.data.createTransaction && parsed.data.transactionData) {
      const tx = parsed.data.transactionData;
      const appUrl = process.env["NEXT_PUBLIC_APP_URL"];
      if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL is not set");
      await fetch(`${appUrl}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({
          type: "expense",
          status: "completed",
          amountValue: parsed.data.priceValue ?? item.priceValue ?? 0,
          amountCurrency: parsed.data.priceCurrency ?? item.priceCurrency,
          description: item.title,
          category: tx.category,
          date: parsed.data.purchasedAt,
          notes: tx.notes ?? "",
          accountId: tx.accountId,
          cardId: tx.cardId,
        }),
      });
    }

    return res.ok(item);
  } catch (err) {
    const { message, statusCode } = handleRouteError(err);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
