import { apiGet } from "@/lib/api/client";
import { getApiToken, getLangCookie } from "@/lib/session/cookies";

export interface TxRow {
  id: number;
  title: string;
  detail: string;
  typeLabel: string;
  direction: "CREDIT" | "DEBIT";
  signedAmount: number;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  date: string;
  status: "SUCCESS" | "PENDING" | "CANCELLED" | "FAILED";
}

export interface TxSummary {
  count: number;
  totalCredit: number;
  totalDebit: number;
  netAmount: number;
}

export interface TxPagination {
  page: number;
  limit: number;
  count: number;
  total: number;
  hasMore: boolean;
}

interface WalletTxItem {
  id?: number | string;
  created_at?: string;
  type?: string;
  type_label?: string;
  direction?: string;
  direction_label?: string;
  amount?: number | string;
  signed_amount?: number | string;
  balance_before?: number | string;
  balance_after?: number | string;
  status?: string;
  title?: string;
  detail?: string;
}

interface WalletTxResponse {
  success?: boolean;
  message?: string;
  data?: {
    items?: WalletTxItem[];
    summary?: {
      count?: number;
      total_credit_amount?: number;
      total_debit_amount?: number;
      net_amount?: number;
    };
    pagination?: {
      page?: number;
      limit?: number;
      count?: number;
      total?: number;
      has_more?: boolean;
    };
  };
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function mapStatus(raw: unknown): TxRow["status"] {
  const s = String(raw ?? "").toUpperCase();
  if (s === "SUCCESS" || s === "COMPLETED" || s === "1") return "SUCCESS";
  if (s === "PENDING" || s === "WAIT" || s === "0")      return "PENDING";
  if (s === "FAILED")                                    return "FAILED";
  return "CANCELLED";
}

function mapItem(row: WalletTxItem, idx: number): TxRow {
  const direction = String(row.direction ?? "").toUpperCase() === "CREDIT" ? "CREDIT" : "DEBIT";
  const amount     = toNumber(row.amount, 0);
  const signed     = toNumber(row.signed_amount, direction === "CREDIT" ? amount : -amount);
  return {
    id:           toNumber(row.id, idx + 1),
    title:        String(row.title ?? row.type_label ?? row.type ?? ""),
    detail:       String(row.detail ?? ""),
    typeLabel:    String(row.type_label ?? row.type ?? ""),
    direction,
    signedAmount: signed,
    amount:       Math.abs(amount),
    balanceBefore: toNumber(row.balance_before, 0),
    balanceAfter:  toNumber(row.balance_after, 0),
    date:         String(row.created_at ?? ""),
    status:       mapStatus(row.status),
  };
}

export interface TransactionsResult {
  rows:       TxRow[];
  summary:    TxSummary;
  pagination: TxPagination;
}

interface TxFilter {
  dateStart?: string;
  dateStop?: string;
  page?: number;
}

export async function getTransactionsByTab(
  _userId: string,
  tabId: string,
  filter?: TxFilter
): Promise<TransactionsResult> {
  const empty: TransactionsResult = {
    rows: [],
    summary: { count: 0, totalCredit: 0, totalDebit: 0, netAmount: 0 },
    pagination: { page: 1, limit: 20, count: 0, total: 0, hasMore: false },
  };

  const [token, lang] = await Promise.all([getApiToken(), getLangCookie()]);
  if (!token) return empty;

  const qs = new URLSearchParams({ type: tabId });
  if (filter?.dateStart) qs.set("date_start", filter.dateStart);
  if (filter?.dateStop)  qs.set("date_stop", filter.dateStop);
  if (filter?.page && filter.page > 1) qs.set("page", String(filter.page));

  try {
    const res = await apiGet<WalletTxResponse>(`/wallet/transactions?${qs.toString()}`, token, lang);
    const d   = res?.data;
    const items = Array.isArray(d?.items) ? d.items : [];
    const s   = d?.summary;
    const p   = d?.pagination;
    return {
      rows: items.map((r, i) => mapItem(r, i)),
      summary: {
        count:       toNumber(s?.count, 0),
        totalCredit: toNumber(s?.total_credit_amount, 0),
        totalDebit:  toNumber(s?.total_debit_amount, 0),
        netAmount:   toNumber(s?.net_amount, 0),
      },
      pagination: {
        page:    toNumber(p?.page, 1),
        limit:   toNumber(p?.limit, 20),
        count:   toNumber(p?.count, 0),
        total:   toNumber(p?.total, 0),
        hasMore: Boolean(p?.has_more),
      },
    };
  } catch {
    return empty;
  }
}
