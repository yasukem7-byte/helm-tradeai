import { NextRequest, NextResponse } from "next/server";

// FRED公開CSVエンドポイント（APIキー不要）
const FRED_SERIES: Record<string, string> = {
  "T10Y2Y": "T10Y2Y", // 10年債-2年債スプレッド（逆イールド判断）
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "";

  const seriesId = FRED_SERIES[symbol];
  if (!seriesId) {
    return NextResponse.json({ error: "Unknown FRED symbol" }, { status: 400 });
  }

  try {
    const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });
    const text = await res.text();

    const lines = text.trim().split("\n").slice(1); // ヘッダー除去
    const seen = new Set<number>();
    const candles = lines
      .map((line) => {
        const [dateStr, valueStr] = line.split(",");
        if (!dateStr || !valueStr || valueStr.trim() === ".") return null;
        const time = Math.floor(new Date(dateStr.trim()).getTime() / 1000);
        const value = parseFloat(valueStr.trim());
        if (isNaN(value) || isNaN(time)) return null;
        return { time, open: value, high: value, low: value, close: value };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .sort((a, b) => a.time - b.time)
      .filter((c) => { if (seen.has(c.time)) return false; seen.add(c.time); return true; });

    if (candles.length === 0) {
      return NextResponse.json({ error: "No data" }, { status: 404 });
    }

    const latest = candles[candles.length - 1];
    const prev = candles[candles.length - 2];
    const change = prev ? latest.close - prev.close : 0;

    return NextResponse.json({
      candles,
      regularMarketPrice: latest.close,
      change,
      changePct: prev ? (change / Math.abs(prev.close)) * 100 : 0,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
