import { NextRequest, NextResponse } from "next/server";

// interval/range mapping for Yahoo Finance
const intervalMap: Record<string, string> = {
  "1min": "1m", "5min": "5m", "15min": "15m", "30min": "30m",
  "1h": "1h", "4h": "4h", "1day": "1d", "1week": "1wk", "1month": "1mo", "12month": "1mo",
};

const rangeMap: Record<string, string> = {
  "1D": "1d", "1W": "5d", "1M": "1mo", "3M": "3mo",
  "6M": "6mo", "1Y": "1y", "2Y": "2y", "ALL": "10y",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "";
  const interval = searchParams.get("interval") || "1day";
  const range = searchParams.get("range") || "3M";

  const yahooInterval = intervalMap[interval] || "1d";
  const yahooRange = rangeMap[range] || "3mo";

  // Yahoo Finance uses 4h only for certain ranges; fall back to 1h if needed
  const safeInterval = yahooInterval === "4h" ? "1h" : yahooInterval;

  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${safeInterval}&range=${yahooRange}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 60 },
    });
    const data = await res.json();

    const result = data?.chart?.result?.[0];
    if (!result) {
      return NextResponse.json({ error: "データが見つかりません", symbol }, { status: 404 });
    }

    const timestamps: number[] = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};
    const opens: number[] = quote.open || [];
    const highs: number[] = quote.high || [];
    const lows: number[] = quote.low || [];
    const closes: number[] = quote.close || [];

    const seen = new Set<number>();
    const candles = timestamps
      .map((t, i) => ({
        time: t,
        open: opens[i],
        high: highs[i],
        low: lows[i],
        close: closes[i],
      }))
      .filter((c) => c.open != null && c.close != null)
      .sort((a, b) => a.time - b.time)
      .filter((c) => { if (seen.has(c.time)) return false; seen.add(c.time); return true; });

    const meta = result.meta;
    return NextResponse.json({
      candles,
      currency: meta?.currency,
      exchangeName: meta?.exchangeName,
      regularMarketPrice: meta?.regularMarketPrice,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
