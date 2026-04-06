import { NextRequest, NextResponse } from "next/server";
import { getTransactionsByTab } from "@/lib/server/transactions";

const ALLOWED_TYPES = new Set([
  "all",
  "deposit",
  "withdraw",
  "lotto_bet",
  "lotto_refund",
  "referral",
  "cashback",
  "ic",
  "bonus",
  "game",
  "admin_adjust",
  "rollback",
  "other",
]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ success: false, message: "invalid type" }, { status: 400 });
  }

  const sp        = req.nextUrl.searchParams;
  const dateStart = sp.get("date_start") ?? undefined;
  const dateStop  = sp.get("date_stop")  ?? undefined;
  const page      = Number(sp.get("page") ?? 1);

  try {
    const result = await getTransactionsByTab("", type, { dateStart, dateStop, page });
    return NextResponse.json({
      success:    true,
      data:       result.rows,
      summary:    result.summary,
      pagination: result.pagination,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
