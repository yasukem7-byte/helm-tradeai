import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = searchParams.get("symbols") || "";
  const apikey = searchParams.get("apikey") || "";

  if (!symbols || !apikey) {
    return NextResponse.json({ error: "symbols and apikey required" }, { status: 400 });
  }

  const symList = symbols.split(",");
  const result: Record<string, { price: number; change: number; changePct: number }> = {};

  // Yahoo Financeで取得するシンボルの判定
  const yahooFuturesMap: Record<string, string> = { "XAG/USD": "SI=F", "XPT/USD": "PL=F" };
  const isJP = (s: string) => /^\d{4}$/.test(s.trim()) || /^\d{3}[A-Z]$/.test(s.trim());
  const useYahoo = (s: string) => isJP(s) || s in yahooFuturesMap;
  const jpSyms = symList.filter((s) => isJP(s));
  const yahooFuturesSyms = symList.filter((s) => s in yahooFuturesMap);
  const otherSyms = symList.filter((s) => !useYahoo(s));

  // Twelve Data batch quote for non-Japanese
  if (otherSyms.length > 0) {
    try {
      const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(otherSyms.join(","))}&apikey=${apikey}`;
      const res = await fetch(url, { next: { revalidate: 30 } });
      const data = await res.json();

      // If single symbol, response is not nested
      const entries = otherSyms.length === 1 ? { [otherSyms[0]]: data } : data;
      for (const [sym, q] of Object.entries(entries)) {
        const quote = q as Record<string, string>;
        if (quote.close) {
          result[sym] = {
            price: parseFloat(quote.close),
            change: parseFloat(quote.change || "0"),
            changePct: parseFloat(quote.percent_change || "0"),
          };
        }
      }
    } catch {
      // continue
    }
  }

  // Yahoo Finance for commodities (XAG/USD → SI=F, XPT/USD → PL=F)
  for (const sym of yahooFuturesSyms) {
    try {
      const yahooSym = yahooFuturesMap[sym];
      const url = `https://query2.finance.yahoo.com/v8/finance/chart/${yahooSym}?interval=1d&range=2d`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 30 } });
      const data = await res.json();
      const r = data?.chart?.result?.[0];
      if (r) {
        const closes = r.indicators?.quote?.[0]?.close || [];
        const last = closes[closes.length - 1];
        const prev = closes[closes.length - 2];
        if (last != null && prev != null) {
          const change = last - prev;
          result[sym] = { price: last, change, changePct: (change / prev) * 100 };
        }
      }
    } catch { /* continue */ }
  }

  // Yahoo Finance for Japanese stocks
  for (const sym of jpSyms) {
    try {
      const url = `https://query2.finance.yahoo.com/v8/finance/chart/${sym}.T?interval=1d&range=2d`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 30 },
      });
      const data = await res.json();
      const r = data?.chart?.result?.[0];
      if (r) {
        const closes = r.indicators?.quote?.[0]?.close || [];
        const last = closes[closes.length - 1];
        const prev = closes[closes.length - 2];
        if (last != null && prev != null) {
          const change = last - prev;
          result[sym] = {
            price: last,
            change,
            changePct: (change / prev) * 100,
          };
        }
      }
    } catch {
      // continue
    }
  }

  return NextResponse.json(result);
}
