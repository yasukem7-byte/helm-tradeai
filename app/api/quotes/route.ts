import { NextRequest, NextResponse } from "next/server";

const YAHOO_MAP: Record<string, string> = {
  "XAU/USD": "GC=F", "XAG/USD": "SI=F", "XPT/USD": "PL=F",
  "EUR/USD": "EURUSD=X", "USD/JPY": "JPY=X", "GBP/USD": "GBPUSD=X", "AUD/USD": "AUDUSD=X",
  "BTC/USD": "BTC-USD", "ETH/USD": "ETH-USD",
  "SPX": "^GSPC", "NDX": "^IXIC", "DJI": "^DJI", "NI225": "^N225", "VIX": "^VIX",
};

const isJP = (s: string) => /^\d{4}$/.test(s.trim()) || /^\d{3}[A-Z]$/.test(s.trim());

async function fetchYahooPrice(yahooSym: string) {
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=2d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 30 } });
  const data = await res.json();
  const r = data?.chart?.result?.[0];
  if (!r) return null;
  const closes = r.indicators?.quote?.[0]?.close || [];
  const last = closes[closes.length - 1];
  const prev = closes[closes.length - 2];
  if (last == null || prev == null) return null;
  const change = last - prev;
  return { price: last, change, changePct: (change / prev) * 100 };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = searchParams.get("symbols") || "";
  const apikey = searchParams.get("apikey") || "";

  if (!symbols) return NextResponse.json({ error: "symbols required" }, { status: 400 });

  const symList = symbols.split(",");
  const result: Record<string, { price: number; change: number; changePct: number }> = {};

  // FREDシンボル（T10Y2Y等）
  const FRED_SYMS = ["T10Y2Y"];
  for (const sym of symList.filter(s => FRED_SYMS.includes(s))) {
    try {
      const res = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${sym}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 3600 },
      });
      const text = await res.text();
      const lines = text.trim().split("\n").slice(1).filter(l => !l.includes("."));
      if (lines.length >= 2) {
        const last = parseFloat(lines[lines.length - 1].split(",")[1]);
        const prev = parseFloat(lines[lines.length - 2].split(",")[1]);
        if (!isNaN(last) && !isNaN(prev)) {
          result[sym] = { price: last, change: last - prev, changePct: ((last - prev) / Math.abs(prev)) * 100 };
        }
      }
    } catch { /* continue */ }
  }

  const jpSyms = symList.filter((s) => isJP(s));
  const otherSyms = symList.filter((s) => !isJP(s));

  // Twelve Data batch quote（失敗した銘柄はYahooへフォールバック）
  const failedSyms: string[] = [];
  if (otherSyms.length > 0 && apikey) {
    try {
      const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(otherSyms.join(","))}&apikey=${apikey}`;
      const res = await fetch(url, { next: { revalidate: 30 } });
      const data = await res.json();
      const entries = otherSyms.length === 1 ? { [otherSyms[0]]: data } : data;
      for (const [sym, q] of Object.entries(entries)) {
        const quote = q as Record<string, string>;
        if (quote.close && quote.status !== "error") {
          result[sym] = {
            price: parseFloat(quote.close),
            change: parseFloat(quote.change || "0"),
            changePct: parseFloat(quote.percent_change || "0"),
          };
        } else {
          failedSyms.push(sym); // Twelve Dataで取得できなかった銘柄
        }
      }
    } catch {
      failedSyms.push(...otherSyms); // 全部失敗 → 全部Yahoo
    }
  } else {
    failedSyms.push(...otherSyms); // APIキーなし → Yahoo
  }

  // Yahoo Financeフォールバック（Twelve Data失敗分）
  for (const sym of failedSyms) {
    try {
      const yahooSym = YAHOO_MAP[sym] ?? sym;
      const r = await fetchYahooPrice(yahooSym);
      if (r) result[sym] = r;
    } catch { /* continue */ }
  }

  // Yahoo Finance for Japanese stocks
  for (const sym of jpSyms) {
    try {
      const r = await fetchYahooPrice(`${sym.trim()}.T`);
      if (r) result[sym] = r;
    } catch { /* continue */ }
  }

  return NextResponse.json(result);
}
