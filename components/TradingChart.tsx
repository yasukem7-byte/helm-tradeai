"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from "lightweight-charts";
import { Indicators } from "@/app/page";

const RANGES = [
  { label: "1日", value: "1D" },
  { label: "1週", value: "1W" },
  { label: "1ヶ月", value: "1M" },
  { label: "3ヶ月", value: "3M" },
  { label: "6ヶ月", value: "6M" },
  { label: "1年", value: "1Y" },
  { label: "全期間", value: "ALL" },
];

function outputsizeForRange(range: string, interval: string): number {
  const perDay: Record<string, number> = {
    "1min": 390, "5min": 78, "15min": 26, "30min": 13,
    "1h": 7, "4h": 2, "1day": 1, "1week": 0.2, "1month": 0.033, "12month": 0.003,
  };
  const days: Record<string, number> = {
    "1D": 1, "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365, "ALL": 5000,
  };
  const d = days[range] ?? 90;
  const ppd = perDay[interval] ?? 1;
  return Math.min(5000, Math.max(50, Math.ceil(d * ppd)));
}

type Props = {
  symbol: string;
  interval: string;
  range: string;
  onRangeChange: (r: string) => void;
  indicators: Indicators;
  twelveDataKey: string;
  onPriceUpdate?: (price: number, change: number, changePct: number) => void;
  onScreenshot?: (base64: string) => void;
  onReadyToScreenshot?: (fn: () => void) => void;
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

function calcMA(data: Candle[], period: number) {
  return data
    .map((_, i) => {
      if (i < period - 1) return null;
      const slice = data.slice(i - period + 1, i + 1);
      const avg = slice.reduce((s, c) => s + c.close, 0) / period;
      return { time: data[i].time, value: avg };
    })
    .filter(Boolean) as { time: number; value: number }[];
}

function calcRSI(data: Candle[], period = 14) {
  const result: { time: number; value: number }[] = [];
  for (let i = period; i < data.length; i++) {
    let gains = 0,
      losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = data[j].close - data[j - 1].close;
      if (diff > 0) gains += diff;
      else losses -= diff;
    }
    const rs = gains / (losses || 0.0001);
    result.push({ time: data[i].time, value: 100 - 100 / (1 + rs) });
  }
  return result;
}

function calcBB(data: Candle[], period = 20, mult = 2) {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    const slice = data.slice(i - period + 1, i + 1);
    const avg = slice.reduce((s, c) => s + c.close, 0) / period;
    const std = Math.sqrt(slice.reduce((s, c) => s + (c.close - avg) ** 2, 0) / period);
    return { time: data[i].time, upper: avg + mult * std, middle: avg, lower: avg - mult * std };
  }).filter(Boolean) as { time: number; upper: number; middle: number; lower: number }[];
}

function calcStoch(data: Candle[], kPeriod = 14, dPeriod = 3) {
  const kArr: { time: number; value: number }[] = [];
  for (let i = kPeriod - 1; i < data.length; i++) {
    const slice = data.slice(i - kPeriod + 1, i + 1);
    const low = Math.min(...slice.map(c => c.low));
    const high = Math.max(...slice.map(c => c.high));
    const k = high === low ? 50 : ((data[i].close - low) / (high - low)) * 100;
    kArr.push({ time: data[i].time, value: k });
  }
  const dArr = kArr.map((_, i) => {
    if (i < dPeriod - 1) return null;
    const avg = kArr.slice(i - dPeriod + 1, i + 1).reduce((s, v) => s + v.value, 0) / dPeriod;
    return { time: kArr[i].time, value: avg };
  }).filter(Boolean) as { time: number; value: number }[];
  return { k: kArr, d: dArr };
}

function calcATR(data: Candle[], period = 14) {
  const trs = data.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prev = data[i - 1].close;
    return Math.max(c.high - c.low, Math.abs(c.high - prev), Math.abs(c.low - prev));
  });
  return data.map((c, i) => {
    if (i < period) return null;
    const atr = trs.slice(i - period + 1, i + 1).reduce((s, v) => s + v, 0) / period;
    return { time: c.time, value: atr };
  }).filter(Boolean) as { time: number; value: number }[];
}

function calcADX(data: Candle[], period = 14) {
  const result: { time: number; adx: number; pdi: number; mdi: number }[] = [];
  if (data.length < period * 2) return result;
  const trArr: number[] = [], pdmArr: number[] = [], mdmArr: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const c = data[i], p = data[i - 1];
    trArr.push(Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close)));
    const upMove = c.high - p.high, downMove = p.low - c.low;
    pdmArr.push(upMove > downMove && upMove > 0 ? upMove : 0);
    mdmArr.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }
  const smooth = (arr: number[], p: number) => {
    const out = [arr.slice(0, p).reduce((s, v) => s + v, 0)];
    for (let i = p; i < arr.length; i++) out.push(out[out.length - 1] - out[out.length - 1] / p + arr[i]);
    return out;
  };
  const sTR = smooth(trArr, period), sPDM = smooth(pdmArr, period), sMDM = smooth(mdmArr, period);
  const diArr: { pdi: number; mdi: number }[] = sTR.map((tr, i) => ({
    pdi: tr === 0 ? 0 : (sPDM[i] / tr) * 100,
    mdi: tr === 0 ? 0 : (sMDM[i] / tr) * 100,
  }));
  const dxArr = diArr.map(d => {
    const sum = d.pdi + d.mdi;
    return sum === 0 ? 0 : (Math.abs(d.pdi - d.mdi) / sum) * 100;
  });
  const adxSmooth = smooth(dxArr, period);
  adxSmooth.forEach((adx, i) => {
    const di = diArr[i + period] ?? diArr[diArr.length - 1];
    const dataIdx = i + period * 2;
    if (dataIdx < data.length) result.push({ time: data[dataIdx].time, adx, pdi: di.pdi, mdi: di.mdi });
  });
  return result;
}

function calcIchimoku(data: Candle[]) {
  const midVal = (arr: Candle[], from: number, period: number) => {
    const sl = arr.slice(from - period + 1, from + 1);
    return (Math.max(...sl.map(c => c.high)) + Math.min(...sl.map(c => c.low))) / 2;
  };
  const result = [];
  for (let i = 51; i < data.length; i++) {
    const tenkan = midVal(data, i, 9);
    const kijun = midVal(data, i, 26);
    const senkouA = (tenkan + kijun) / 2;
    const senkouB = midVal(data, i, 52);
    result.push({ time: data[i].time, tenkan, kijun, senkouA, senkouB });
  }
  return result;
}

function calcFib(data: Candle[]) {
  if (data.length === 0) return [];
  const high = Math.max(...data.map(c => c.high));
  const low = Math.min(...data.map(c => c.low));
  const diff = high - low;
  const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  return levels.map(l => ({ level: l, price: high - diff * l }));
}

function calcMACD(data: Candle[]) {
  const ema = (d: number[], period: number) => {
    const k = 2 / (period + 1);
    const result = [d[0]];
    for (let i = 1; i < d.length; i++) result.push(d[i] * k + result[i - 1] * (1 - k));
    return result;
  };
  const closes = data.map((c) => c.close);
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signal = ema(macdLine.slice(25), 9);
  return data.slice(25 + 8).map((c, i) => ({
    time: c.time,
    macd: macdLine[25 + 8 + i],
    signal: signal[i],
    hist: macdLine[25 + 8 + i] - signal[i],
  }));
}

type DrawPoint = { x: number; y: number };
type DrawLine = { p1: DrawPoint; p2: DrawPoint; color: string };

export default function TradingChart({
  symbol,
  interval,
  range,
  onRangeChange,
  indicators,
  twelveDataKey,
  onPriceUpdate,
  onScreenshot,
  onReadyToScreenshot,
}: Props) {
  const mainRef = useRef<HTMLDivElement>(null);
  const rsiRef = useRef<HTMLDivElement>(null);
  const macdRef = useRef<HTMLDivElement>(null);
  const stochRef = useRef<HTMLDivElement>(null);
  const atrRef = useRef<HTMLDivElement>(null);
  const adxRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainChart = useRef<IChartApi | null>(null);
  const rsiChart = useRef<IChartApi | null>(null);
  const macdChart = useRef<IChartApi | null>(null);
  const stochChart = useRef<IChartApi | null>(null);
  const atrChart = useRef<IChartApi | null>(null);
  const adxChart = useRef<IChartApi | null>(null);
  const volumeChart = useRef<IChartApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candles, setCandles] = useState<Candle[]>([]);

  // Drawing state
  const [drawMode, setDrawMode] = useState(false);
  const [drawColor, setDrawColor] = useState("#38bdf8");
  const [lines, setLines] = useState<DrawLine[]>([]);
  const [firstPoint, setFirstPoint] = useState<DrawPoint | null>(null);
  const [mousePos, setMousePos] = useState<DrawPoint | null>(null);
  const linesRef = useRef<DrawLine[]>([]);
  linesRef.current = lines;
  const firstPointRef = useRef<DrawPoint | null>(null);
  firstPointRef.current = firstPoint;
  const drawColorRef = useRef(drawColor);
  drawColorRef.current = drawColor;
  const draggingRef = useRef<{ lineIdx: number; point: "p1" | "p2" } | null>(null);
  const didDragRef = useRef(false);

  // 日本株判定
  const isJapanese = (sym: string) => /^\d{4}$/.test(sym.trim()) || /^\d{3}[A-Z]$/.test(sym.trim());

  const toYahooSymbol = (sym: string): string => {
    if (isJapanese(sym)) return `${sym.trim()}.T`;
    const map: Record<string, string> = {
      "XAU/USD": "GC=F", "XAG/USD": "SI=F", "XPT/USD": "PL=F",
      "EUR/USD": "EURUSD=X", "USD/JPY": "JPY=X", "GBP/USD": "GBPUSD=X", "AUD/USD": "AUDUSD=X",
      "BTC/USD": "BTC-USD", "ETH/USD": "ETH-USD",
    };
    return map[sym] ?? sym;
  };

  const fetchFromYahoo = async (sym: string, intv: string, rng: string) => {
    const yahooSym = toYahooSymbol(sym);
    const yahooRange = indicators.ma200 && ["1D","1W","1M","3M","6M"].includes(rng) ? "2Y" : rng;
    const res = await fetch(`/api/yahoo?symbol=${encodeURIComponent(yahooSym)}&interval=${intv}&range=${yahooRange}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.candles as Candle[];
  };

  // Fetch data
  useEffect(() => {
    if (!twelveDataKey && !isJapanese(symbol)) return;
    setLoading(true);
    setError("");
    setCandles([]);

    const loadData = async () => {
      try {
        let values: Candle[] = [];

        if (isJapanese(symbol)) {
          // 日本株は常にYahoo Finance
          values = await fetchFromYahoo(symbol, interval, range);
        } else {
          // まずTwelve Dataを試みる、失敗したらYahoo Financeにフォールバック
          try {
            const baseSize = outputsizeForRange(range, interval);
            const outputsize = indicators.ma200 ? Math.max(baseSize, 300) : baseSize;
            const res = await fetch(
              `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${twelveDataKey}`
            );
            const data = await res.json();
            if (data.status === "error") throw new Error(data.message);
            values = (data.values || [])
              .reverse()
              .map((v: { datetime: string; open: string; high: string; low: string; close: string }) => ({
                time: Math.floor(new Date(v.datetime).getTime() / 1000),
                open: parseFloat(v.open),
                high: parseFloat(v.high),
                low: parseFloat(v.low),
                close: parseFloat(v.close),
              }));
          } catch {
            // Twelve Data失敗 → Yahoo Financeにフォールバック
            values = await fetchFromYahoo(symbol, interval, range);
          }
        }

        setCandles(values);
        if (values.length >= 2 && onPriceUpdate) {
          const last = values[values.length - 1];
          const prev = values[values.length - 2];
          const change = last.close - prev.close;
          onPriceUpdate(last.close, change, (change / prev.close) * 100);
        }
      } catch {
        setError("ネットワークエラー");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, interval, range, twelveDataKey, indicators.ma200]);

  // Build/update charts
  useEffect(() => {
    if (!mainRef.current || candles.length === 0) return;

    // Destroy old
    [mainChart, rsiChart, macdChart, stochChart, atrChart, adxChart, volumeChart].forEach(r => {
      if (r.current) { r.current.remove(); r.current = null; }
    });

    const chartOpts = {
      layout: { background: { color: "#131722" }, textColor: "#b2b5be" },
      grid: { vertLines: { color: "#1e222d" }, horzLines: { color: "#1e222d" } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#2a2e39" },
      timeScale: { borderColor: "#2a2e39", timeVisible: true },
      autoSize: true,
    };

    // Main chart
    const mc = createChart(mainRef.current, { ...chartOpts });
    mainChart.current = mc;

    const candleSeries = mc.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });
    candleSeries.setData(candles as Parameters<typeof candleSeries.setData>[0]);

    // MAs
    const addMA = (period: number, color: string) => {
      const s = mc.addSeries(LineSeries, { color, lineWidth: 1, priceLineVisible: false });
      s.setData(calcMA(candles, period) as Parameters<typeof s.setData>[0]);
      return s;
    };
    let ma20Series: ISeriesApi<"Line"> | null = null;
    let ma50Series: ISeriesApi<"Line"> | null = null;
    let ma200Series: ISeriesApi<"Line"> | null = null;
    if (indicators.ma20) ma20Series = addMA(20, "#eab308");
    if (indicators.ma50) ma50Series = addMA(50, "#60a5fa");
    if (indicators.ma200) ma200Series = addMA(200, "#f87171");
    void ma20Series; void ma50Series; void ma200Series;

    // Bollinger Bands
    if (indicators.bb) {
      const bbData = calcBB(candles);
      const addBB = (vals: {time:number;value:number}[], color: string) => {
        const s = mc.addSeries(LineSeries, { color, lineWidth: 1, priceLineVisible: false });
        s.setData(vals as Parameters<typeof s.setData>[0]);
      };
      addBB(bbData.map(d => ({ time: d.time, value: d.upper })), "#60a5fa88");
      addBB(bbData.map(d => ({ time: d.time, value: d.middle })), "#60a5fa");
      addBB(bbData.map(d => ({ time: d.time, value: d.lower })), "#60a5fa88");
    }

    // Ichimoku
    if (indicators.ichimoku) {
      const ich = calcIchimoku(candles);
      const addI = (vals: {time:number;value:number}[], color: string, width: 1|2 = 1) => {
        const s = mc.addSeries(LineSeries, { color, lineWidth: width, priceLineVisible: false });
        s.setData(vals as Parameters<typeof s.setData>[0]);
      };
      addI(ich.map(d => ({ time: d.time, value: d.tenkan })), "#ef4444");
      addI(ich.map(d => ({ time: d.time, value: d.kijun })), "#3b82f6", 2);
      addI(ich.map(d => ({ time: d.time, value: d.senkouA })), "#22c55e88");
      addI(ich.map(d => ({ time: d.time, value: d.senkouB })), "#ef444488");
    }

    // Fibonacci price lines
    if (indicators.fib) {
      const fibLevels = calcFib(candles);
      const colors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899"];
      fibLevels.forEach((f, i) => {
        const s = mc.addSeries(LineSeries, {
          color: colors[i % colors.length],
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
        });
        s.setData(candles.map(c => ({ time: c.time, value: f.price })) as Parameters<typeof s.setData>[0]);
      });
    }

    mc.timeScale().fitContent();

    const syncRange = (src: IChartApi) => {
      src.timeScale().subscribeVisibleLogicalRangeChange((r) => {
        if (!r) return;
        [rsiChart, macdChart, stochChart, atrChart, adxChart, volumeChart].forEach(ref => {
          if (ref.current && ref.current !== src) ref.current.timeScale().setVisibleLogicalRange(r);
        });
        if (mainChart.current && mainChart.current !== src) mainChart.current.timeScale().setVisibleLogicalRange(r);
      });
    };
    syncRange(mc);

    // RSI chart
    if (indicators.rsi && rsiRef.current) {
      const rc = createChart(rsiRef.current, { ...chartOpts });
      rsiChart.current = rc;
      const rsiSeries = rc.addSeries(LineSeries, { color: "#a78bfa", lineWidth: 1, priceLineVisible: false });
      rsiSeries.setData(calcRSI(candles) as Parameters<typeof rsiSeries.setData>[0]);
      // Overbought/oversold lines
      const ob = rc.addSeries(LineSeries, { color: "#ef444488", lineWidth: 1, priceLineVisible: false });
      const os = rc.addSeries(LineSeries, { color: "#22c55e88", lineWidth: 1, priceLineVisible: false });
      const rsiData = calcRSI(candles);
      if (rsiData.length > 0) {
        ob.setData(rsiData.map((d) => ({ time: d.time, value: 70 })) as Parameters<typeof ob.setData>[0]);
        os.setData(rsiData.map((d) => ({ time: d.time, value: 30 })) as Parameters<typeof os.setData>[0]);
      }
      rc.timeScale().fitContent();
      syncRange(rc);
    }

    // MACD chart
    if (indicators.macd && macdRef.current) {
      const mcc = createChart(macdRef.current, { ...chartOpts });
      macdChart.current = mcc;
      const macdData = calcMACD(candles);
      const macdSeries = mcc.addSeries(LineSeries, { color: "#34d399", lineWidth: 1, priceLineVisible: false });
      const signalSeries = mcc.addSeries(LineSeries, { color: "#f87171", lineWidth: 1, priceLineVisible: false });
      const histSeries = mcc.addSeries(HistogramSeries, { color: "#60a5fa", priceLineVisible: false });
      macdSeries.setData(macdData.map((d) => ({ time: d.time, value: d.macd })) as Parameters<typeof macdSeries.setData>[0]);
      signalSeries.setData(macdData.map((d) => ({ time: d.time, value: d.signal })) as Parameters<typeof signalSeries.setData>[0]);
      histSeries.setData(macdData.map((d) => ({ time: d.time, value: d.hist, color: d.hist >= 0 ? "#26a69a" : "#ef5350" })) as Parameters<typeof histSeries.setData>[0]);
      mcc.timeScale().fitContent();
      syncRange(mcc);
    }

    // Stochastics
    if (indicators.stoch && stochRef.current) {
      const sc = createChart(stochRef.current, { ...chartOpts });
      stochChart.current = sc;
      const { k, d } = calcStoch(candles);
      const kS = sc.addSeries(LineSeries, { color: "#3b82f6", lineWidth: 1, priceLineVisible: false });
      const dS = sc.addSeries(LineSeries, { color: "#f97316", lineWidth: 1, priceLineVisible: false });
      kS.setData(k as Parameters<typeof kS.setData>[0]);
      dS.setData(d as Parameters<typeof dS.setData>[0]);
      const ob = sc.addSeries(LineSeries, { color: "#ef444466", lineWidth: 1, priceLineVisible: false });
      const os = sc.addSeries(LineSeries, { color: "#22c55e66", lineWidth: 1, priceLineVisible: false });
      ob.setData(k.map(p => ({ time: p.time, value: 80 })) as Parameters<typeof ob.setData>[0]);
      os.setData(k.map(p => ({ time: p.time, value: 20 })) as Parameters<typeof os.setData>[0]);
      sc.timeScale().fitContent();
      syncRange(sc);
    }

    // ATR
    if (indicators.atr && atrRef.current) {
      const ac = createChart(atrRef.current, { ...chartOpts });
      atrChart.current = ac;
      const atrData = calcATR(candles);
      const atrS = ac.addSeries(LineSeries, { color: "#a78bfa", lineWidth: 1, priceLineVisible: false });
      atrS.setData(atrData as Parameters<typeof atrS.setData>[0]);
      ac.timeScale().fitContent();
      syncRange(ac);
    }

    // DMI/ADX
    if (indicators.adx && adxRef.current) {
      const dc = createChart(adxRef.current, { ...chartOpts });
      adxChart.current = dc;
      const adxData = calcADX(candles);
      const adxS = dc.addSeries(LineSeries, { color: "#f59e0b", lineWidth: 2, priceLineVisible: false });
      const pdiS = dc.addSeries(LineSeries, { color: "#22c55e", lineWidth: 1, priceLineVisible: false });
      const mdiS = dc.addSeries(LineSeries, { color: "#ef4444", lineWidth: 1, priceLineVisible: false });
      adxS.setData(adxData.map(d => ({ time: d.time, value: d.adx })) as Parameters<typeof adxS.setData>[0]);
      pdiS.setData(adxData.map(d => ({ time: d.time, value: d.pdi })) as Parameters<typeof pdiS.setData>[0]);
      mdiS.setData(adxData.map(d => ({ time: d.time, value: d.mdi })) as Parameters<typeof mdiS.setData>[0]);
      dc.timeScale().fitContent();
      syncRange(dc);
    }

    // Volume
    if (indicators.volume && volumeRef.current) {
      const vc = createChart(volumeRef.current, { ...chartOpts });
      volumeChart.current = vc;
      const volS = vc.addSeries(HistogramSeries, { priceLineVisible: false });
      volS.setData(candles.map(c => ({
        time: c.time,
        value: (c as Candle & { volume?: number }).volume ?? 0,
        color: c.close >= c.open ? "#26a69a88" : "#ef535088",
      })) as Parameters<typeof volS.setData>[0]);
      vc.timeScale().fitContent();
      syncRange(vc);
    }

    return () => {
      [mainChart, rsiChart, macdChart, stochChart, atrChart, adxChart, volumeChart].forEach(r => {
        if (r.current) { r.current.remove(); r.current = null; }
      });
    };
  }, [candles, indicators]);

  // Canvas: resize and redraw lines
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = mainRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redraw();
    };

    const redraw = (preview?: DrawPoint) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw saved lines
      linesRef.current.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.moveTo(line.p1.x, line.p1.y);
        ctx.lineTo(line.p2.x, line.p2.y);
        ctx.stroke();
        // Draw draggable endpoints
        [line.p1, line.p2].forEach((p) => {
          ctx.beginPath();
          ctx.fillStyle = line.color;
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.strokeStyle = "#131722";
          ctx.lineWidth = 1.5;
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.stroke();
        });
      });
      // Draw in-progress line preview
      const fp = firstPointRef.current;
      const dc = drawColorRef.current;
      if (fp && preview) {
        ctx.beginPath();
        ctx.strokeStyle = dc;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.moveTo(fp.x, fp.y);
        ctx.lineTo(preview.x, preview.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.fillStyle = dc;
        ctx.arc(fp.x, fp.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Re-draw when lines or firstPoint changes
    redraw(mousePos ?? undefined);

    return () => window.removeEventListener("resize", resize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, firstPoint, mousePos, drawColor]);

  const findNearPoint = (pos: DrawPoint, threshold = 10) => {
    for (let i = linesRef.current.length - 1; i >= 0; i--) {
      const line = linesRef.current[i];
      for (const pt of ["p1", "p2"] as const) {
        const p = line[pt];
        const dist = Math.sqrt((p.x - pos.x) ** 2 + (p.y - pos.y) ** 2);
        if (dist <= threshold) return { lineIdx: i, point: pt };
      }
    }
    return null;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const hit = findNearPoint(pos);
    if (hit) {
      draggingRef.current = hit;
      didDragRef.current = false;
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (draggingRef.current) {
      didDragRef.current = true;
      const { lineIdx, point } = draggingRef.current;
      setLines(prev => prev.map((l, i) => i === lineIdx ? { ...l, [point]: pos } : l));
      return;
    }

    // Update cursor
    if (canvasRef.current) {
      const hit = findNearPoint(pos);
      canvasRef.current.style.cursor = hit ? "move" : drawMode ? "crosshair" : "default";
    }

    if (drawMode && firstPoint) {
      setMousePos(pos);
    }
  };

  const handleCanvasMouseUp = () => {
    draggingRef.current = null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (didDragRef.current) { didDragRef.current = false; return; }
    if (!drawMode) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (!firstPoint) {
      setFirstPoint(p);
    } else {
      setLines((prev) => [...prev, { p1: firstPoint, p2: p, color: drawColor }]);
      setFirstPoint(null);
      setMousePos(null);
    }
  };

  const undoLine = () => setLines((prev) => prev.slice(0, -1));
  const clearLines = () => { setLines([]); setFirstPoint(null); };

  // Touch event handlers (mobile)
  const getPosFromTouch = (e: React.TouchEvent<HTMLCanvasElement>): DrawPoint => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const t = e.touches[0] ?? e.changedTouches[0];
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const pos = getPosFromTouch(e);
    const hit = findNearPoint(pos, 20); // larger threshold for touch
    if (hit) {
      e.preventDefault();
      draggingRef.current = hit;
      didDragRef.current = false;
    } else if (drawMode) {
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current && !(drawMode && firstPoint)) return;
    e.preventDefault();
    const pos = getPosFromTouch(e);
    if (draggingRef.current) {
      didDragRef.current = true;
      const { lineIdx, point } = draggingRef.current;
      setLines(prev => prev.map((l, i) => i === lineIdx ? { ...l, [point]: pos } : l));
    } else if (drawMode && firstPoint) {
      setMousePos(pos);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (draggingRef.current) {
      draggingRef.current = null;
      return;
    }
    if (!drawMode) return;
    e.preventDefault();
    const pos = getPosFromTouch(e);
    if (!firstPoint) {
      setFirstPoint(pos);
    } else {
      setLines(prev => [...prev, { p1: firstPoint, p2: pos, color: drawColor }]);
      setFirstPoint(null);
      setMousePos(null);
    }
  };

  const rsiHeight = indicators.rsi ? "h-32" : "h-0";
  const macdHeight = indicators.macd ? "h-32" : "h-0";
  const mainFlex = "flex-1";

  useEffect(() => {
    onReadyToScreenshot?.(handleScreenshot);
  }); // runs every render to keep ref fresh

  const handleScreenshot = () => {
    if (!onScreenshot) return;
    // Collect screenshots from all active charts using lightweight-charts built-in method
    const charts = [mainChart, rsiChart, macdChart, stochChart, atrChart, adxChart, volumeChart]
      .map(r => r.current)
      .filter(Boolean) as IChartApi[];

    if (charts.length === 0) return;

    const canvases = charts.map(c => c.takeScreenshot());
    const totalHeight = canvases.reduce((sum, c) => sum + c.height, 0);
    const width = canvases[0].width;

    const merged = document.createElement("canvas");
    merged.width = width;
    merged.height = totalHeight;
    const ctx = merged.getContext("2d")!;
    ctx.fillStyle = "#131722";
    ctx.fillRect(0, 0, width, totalHeight);

    let y = 0;
    for (const c of canvases) {
      ctx.drawImage(c, 0, y);
      y += c.height;
    }

    const base64 = merged.toDataURL("image/png").split(",")[1];
    onScreenshot(base64);
  };

  return (
    <div className="flex flex-col h-full">
      {!twelveDataKey && !isJapanese(symbol) && (
        <div className="flex-1 flex items-center justify-center text-[#787b86]">
          ⚙ APIキーを設定してください
        </div>
      )}
      {twelveDataKey && loading && (
        <div className="flex-1 flex items-center justify-center text-[#787b86]">
          データ読み込み中...
        </div>
      )}
      {error && (
        <div className="p-4 text-red-400 text-sm">{error}</div>
      )}
      {!loading && !error && twelveDataKey && (
        <>
          {/* Symbol label bar */}
          <div className="px-3 py-1 text-xs text-[#787b86] border-b border-[#1e222d] flex items-center gap-3">
            <span className="text-[#d1d4dc] font-semibold">{symbol}</span>
            {candles.length > 0 && (() => {
              const last = candles[candles.length - 1];
              const prev = candles[candles.length - 2];
              const isUp = last.close >= (prev?.close ?? last.close);
              const change = prev ? last.close - prev.close : 0;
              const pct = prev ? (change / prev.close) * 100 : 0;
              return (
                <>
                  <span className="text-[#787b86]">O <span className="text-[#d1d4dc]">{last.open.toFixed(2)}</span></span>
                  <span className="text-[#787b86]">H <span className="text-[#26a69a]">{last.high.toFixed(2)}</span></span>
                  <span className="text-[#787b86]">L <span className="text-[#ef5350]">{last.low.toFixed(2)}</span></span>
                  <span className="text-[#787b86]">C <span className={isUp ? "text-[#26a69a]" : "text-[#ef5350]"}>{last.close.toFixed(2)}</span></span>
                  <span className={isUp ? "text-[#26a69a]" : "text-[#ef5350]"}>
                    {isUp ? "+" : ""}{change.toFixed(2)} ({isUp ? "+" : ""}{pct.toFixed(2)}%)
                  </span>
                </>
              );
            })()}
          </div>
          {/* Drawing toolbar */}
          <div className="flex items-center gap-1 px-3 py-1 border-b border-[#1e222d]">
            <button
              onClick={() => { setDrawMode(!drawMode); setFirstPoint(null); }}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                drawMode ? "bg-orange-500 text-white" : "text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="19" x2="19" y2="5" />
                <circle cx="5" cy="19" r="2" fill="currentColor" stroke="none" />
                <circle cx="19" cy="5" r="2" fill="currentColor" stroke="none" />
              </svg>
              {drawMode ? (firstPoint ? "2点目をクリック" : "1点目をクリック") : "線を引く"}
            </button>
            {drawMode && (
              <>
                {[
                  { color: "#38bdf8", label: "青" },
                  { color: "#ffffff", label: "白" },
                  { color: "#fbbf24", label: "黄" },
                  { color: "#f97316", label: "橙" },
                ].map(({ color }) => (
                  <button
                    key={color}
                    onClick={() => setDrawColor(color)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${drawColor === color ? "border-white scale-125" : "border-transparent"}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </>
            )}
            {lines.length > 0 && (
              <>
                <button onClick={undoLine} className="px-2 py-1 text-xs text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded">
                  ↩ 戻す
                </button>
                <button onClick={clearLines} className="px-2 py-1 text-xs text-[#787b86] hover:text-red-400 hover:bg-[#2a2e39] rounded">
                  🗑 全消去
                </button>
              </>
            )}
          </div>

          {/* Chart + canvas overlay */}
          <div className={`${mainFlex} min-h-0 relative`}>
            <div ref={mainRef} className="w-full h-full" />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: (drawMode || lines.length > 0) ? "auto" : "none" }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onClick={handleCanvasClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>
          {/* Range selector bar — TradingView style */}
          <div className="flex items-center gap-0.5 px-3 py-1 border-t border-[#1e222d]">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => onRangeChange(r.value)}
                className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                  range === r.value
                    ? "bg-blue-600 text-white"
                    : "text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {indicators.rsi && (
            <div className="border-t border-[#1e222d]">
              <div className="px-2 py-0.5 text-[10px] text-[#787b86]">RSI(14)</div>
              <div className={rsiHeight} ref={rsiRef} />
            </div>
          )}
          {indicators.macd && (
            <div className="border-t border-[#1e222d]">
              <div className="px-2 py-0.5 text-[10px] text-[#787b86]">MACD(12,26,9)</div>
              <div className={macdHeight} ref={macdRef} />
            </div>
          )}
          {indicators.stoch && (
            <div className="border-t border-[#1e222d]">
              <div className="px-2 py-0.5 text-[10px] text-[#787b86]">ストキャスティクス(14,3) <span className="text-blue-400">%K</span> <span className="text-orange-400">%D</span></div>
              <div className="h-24" ref={stochRef} />
            </div>
          )}
          {indicators.adx && (
            <div className="border-t border-[#1e222d]">
              <div className="px-2 py-0.5 text-[10px] text-[#787b86]">DMI/ADX(14) <span className="text-yellow-400">ADX</span> <span className="text-green-400">+DI</span> <span className="text-red-400">-DI</span></div>
              <div className="h-24" ref={adxRef} />
            </div>
          )}
          {indicators.atr && (
            <div className="border-t border-[#1e222d]">
              <div className="px-2 py-0.5 text-[10px] text-[#787b86]">ATR(14)</div>
              <div className="h-20" ref={atrRef} />
            </div>
          )}
          {indicators.volume && (
            <div className="border-t border-[#1e222d]">
              <div className="px-2 py-0.5 text-[10px] text-[#787b86]">出来高</div>
              <div className="h-20" ref={volumeRef} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
