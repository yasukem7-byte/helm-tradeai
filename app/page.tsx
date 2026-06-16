"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ApiKeyModal from "@/components/ApiKeyModal";
import TopBar from "@/components/TopBar";
import RightPanel from "@/components/RightPanel";
import MobileTabBar from "@/components/MobileTabBar";

const TradingChart = dynamic(() => import("@/components/TradingChart"), {
  ssr: false,
});

export type Indicators = {
  ma20: boolean;
  ma50: boolean;
  ma200: boolean;
  rsi: boolean;
  macd: boolean;
  bb: boolean;
  atr: boolean;
  stoch: boolean;
  volume: boolean;
  fib: boolean;
  adx: boolean;
  ichimoku: boolean;
};

export type WatchItem = {
  symbol: string;
  price?: number;
  change?: number;
  changePct?: number;
  group?: string;
};

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [twelveDataKey, setTwelveDataKey] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [symbol, setSymbol] = useState("XAU/USD");
  const [interval, setInterval] = useState("1h");
  const [indicators, setIndicators] = useState<Indicators>({
    ma20: true, ma50: true, ma200: false,
    rsi: false, macd: false,
    bb: false, atr: false, stoch: false,
    volume: false, fib: false, adx: false, ichimoku: false,
  });
  const [range, setRange] = useState("3M");
  const [watchlist, setWatchlist] = useState<WatchItem[]>([]);
  const [rightTab, setRightTab] = useState<"watch" | "ai">("watch");
  const [mobileTab, setMobileTab] = useState<"chart" | "watch" | "ai">("chart");
  const [screenshotImage, setScreenshotImage] = useState<string | null>(null);
  const takeScreenshotRef = useRef<(() => void) | null>(null);
  const takeScreenshotMobileRef = useRef<(() => void) | null>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    const savedApiKey = localStorage.getItem("claude_api_key") || "";
    const savedTwelveKey = localStorage.getItem("twelve_data_key") || "";
    setApiKey(savedApiKey);
    setTwelveDataKey(savedTwelveKey);
    if (!savedApiKey) setShowModal(true);

    // ウォッチリストをlocalStorageから復元（バージョンが変わったらリセット）
    const WL_VERSION = "v5";
    const savedVersion = localStorage.getItem("watchlist_version");
    if (savedVersion !== WL_VERSION) {
      localStorage.removeItem("watchlist");
      localStorage.setItem("watchlist_version", WL_VERSION);
    }
    const savedWl = savedVersion === WL_VERSION ? localStorage.getItem("watchlist") : null;
    const defaultWl: WatchItem[] = [
      // 主要指数
      { symbol: "SPX",    group: "主要指数" },
      { symbol: "NDX",    group: "主要指数" },
      { symbol: "DJI",    group: "主要指数" },
      { symbol: "NI225",  group: "主要指数" },
      { symbol: "VIX",    group: "主要指数" },
      { symbol: "T10Y2Y", group: "主要指数" },
      // コモディティ
      { symbol: "XAU/USD", group: "コモディティ" },
      { symbol: "XAG/USD", group: "コモディティ" },
      { symbol: "XPT/USD", group: "コモディティ" },
      { symbol: "425A",    group: "コモディティ" },
      { symbol: "424A",    group: "コモディティ" },
      { symbol: "GLDM",    group: "コモディティ" },
      // 為替
      { symbol: "EUR/USD", group: "為替" },
      { symbol: "USD/JPY", group: "為替" },
      // 仮想通貨
      { symbol: "BTC/USD", group: "仮想通貨" },
      { symbol: "ETH/USD", group: "仮想通貨" },
      // 米国株 AI・半導体
      { symbol: "NVDA",  group: "米国株 AI・半導体" },
      { symbol: "AMD",   group: "米国株 AI・半導体" },
      { symbol: "MU",    group: "米国株 AI・半導体" },
      { symbol: "LRCX",  group: "米国株 AI・半導体" },
      { symbol: "AVGO",  group: "米国株 AI・半導体" },
      { symbol: "IBM",   group: "米国株 AI・半導体" },
      { symbol: "INTC",  group: "米国株 AI・半導体" },
      // 米国株 テック・プラットフォーム
      { symbol: "MSFT",  group: "米国株 テック・プラットフォーム" },
      { symbol: "GOOG",  group: "米国株 テック・プラットフォーム" },
      { symbol: "META",  group: "米国株 テック・プラットフォーム" },
      { symbol: "AMZN",  group: "米国株 テック・プラットフォーム" },
      { symbol: "PLTR",  group: "米国株 テック・プラットフォーム" },
      // 米国株 防衛・インフラ・宇宙
      { symbol: "KTOS",  group: "米国株 防衛・インフラ・宇宙" },
      { symbol: "STRL",  group: "米国株 防衛・インフラ・宇宙" },
      { symbol: "TTAN",  group: "米国株 防衛・インフラ・宇宙" },
      { symbol: "SPCX",  group: "米国株 防衛・インフラ・宇宙" },
      // 米国株 その他
      { symbol: "TSLA",  group: "米国株 その他" },
      { symbol: "ONDS",  group: "米国株 その他" },
      { symbol: "ONON",  group: "米国株 その他" },
      { symbol: "V",     group: "米国株 その他" },
      { symbol: "JEPQ",  group: "米国株 その他" },
      { symbol: "BRKB",  group: "米国株 その他" },
      { symbol: "ABBV",  group: "米国株 その他" },
      // 日本株 AI関連
      { symbol: "285A",  group: "日本株 AI関連" },
      { symbol: "5803",  group: "日本株 AI関連" },
      { symbol: "6976",  group: "日本株 AI関連" },
      { symbol: "5805",  group: "日本株 AI関連" },
      { symbol: "6701",  group: "日本株 AI関連" },
      // 日本株 防衛・宇宙
      { symbol: "7011",  group: "日本株 防衛・宇宙" },
      { symbol: "7013",  group: "日本株 防衛・宇宙" },
      { symbol: "186A",  group: "日本株 防衛・宇宙" },
      { symbol: "485A",  group: "日本株 防衛・宇宙" },
      // 日本株 商社・金融
      { symbol: "8306",  group: "日本株 商社・金融" },
      { symbol: "8001",  group: "日本株 商社・金融" },
      { symbol: "8058",  group: "日本株 商社・金融" },
      { symbol: "9432",  group: "日本株 商社・金融" },
      { symbol: "8593",  group: "日本株 商社・金融" },
      // 日本株 金・資源
      { symbol: "2036",  group: "日本株 金・資源" },
      { symbol: "1540",  group: "日本株 金・資源" },
      // 日本株 素材・電線
      { symbol: "5801",  group: "日本株 素材・電線" },
      { symbol: "4004",  group: "日本株 素材・電線" },
      // 日本株 その他
      { symbol: "7974",  group: "日本株 その他" },
      // 2倍レバレッジ ETF
      { symbol: "SSO",   group: "2倍レバレッジ" },
      { symbol: "QLD",   group: "2倍レバレッジ" },
      { symbol: "USD",   group: "2倍レバレッジ" },
      { symbol: "ROM",   group: "2倍レバレッジ" },
      { symbol: "UGL",   group: "2倍レバレッジ" },
      { symbol: "AGQ",   group: "2倍レバレッジ" },
      { symbol: "1570",  group: "2倍レバレッジ" },
      { symbol: "1358",  group: "2倍レバレッジ" },
      // 3倍レバレッジ ETF
      { symbol: "SOXL",  group: "3倍レバレッジ" },
      { symbol: "TECL",  group: "3倍レバレッジ" },
      { symbol: "TQQQ",  group: "3倍レバレッジ" },
    ];
    setWatchlist(savedWl ? JSON.parse(savedWl) : defaultWl);

    const params = new URLSearchParams(window.location.search);
    if (params.get("symbol")) setSymbol(params.get("symbol")!);
    if (params.get("interval")) setInterval(params.get("interval")!);
    const ind = params.get("indicators");
    if (ind) {
      const active = ind.split(",");
      setIndicators({
        ma20: active.includes("ma20"), ma50: active.includes("ma50"), ma200: active.includes("ma200"),
        rsi: active.includes("rsi"), macd: active.includes("macd"),
        bb: active.includes("bb"), atr: active.includes("atr"), stoch: active.includes("stoch"),
        volume: active.includes("volume"), fib: active.includes("fib"), adx: active.includes("adx"),
        ichimoku: active.includes("ichimoku"),
      });
    }
  }, []);

  const syncUrl = (
    sym: string,
    intv: string,
    ind: Indicators,
    wl: WatchItem[]
  ) => {
    const active = Object.entries(ind)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",");
    const params = new URLSearchParams();
    params.set("symbol", sym);
    params.set("interval", intv);
    if (active) params.set("indicators", active);
    params.set("watchlist", wl.map((w) => w.symbol).join(","));
    window.history.replaceState({}, "", `?${params.toString()}`);
  };

  const handleSymbolChange = (s: string) => {
    setSymbol(s);
    syncUrl(s, interval, indicators, watchlist);
  };

  const handleIntervalChange = (i: string) => {
    setInterval(i);
    syncUrl(symbol, i, indicators, watchlist);
  };

  const toggleIndicator = (key: keyof Indicators) => {
    const next = { ...indicators, [key]: !indicators[key] };
    setIndicators(next);
    syncUrl(symbol, interval, next, watchlist);
  };

  const clearAllIndicators = () => {
    const next: Indicators = {
      ma20: false, ma50: false, ma200: false,
      rsi: false, macd: false, bb: false, atr: false,
      stoch: false, volume: false, fib: false, adx: false, ichimoku: false,
    };
    setIndicators(next);
    syncUrl(symbol, interval, next, watchlist);
  };

  const saveWatchlist = (wl: WatchItem[]) => {
    localStorage.setItem("watchlist", JSON.stringify(wl.map((w) => ({ symbol: w.symbol, group: w.group }))));
  };

  const addToWatchlist = (sym: string) => {
    if (watchlist.find((w) => w.symbol === sym)) return;
    const next = [...watchlist, { symbol: sym }];
    setWatchlist(next);
    saveWatchlist(next);
    syncUrl(symbol, interval, indicators, next);
  };

  const removeFromWatchlist = (sym: string) => {
    const next = watchlist.filter((w) => w.symbol !== sym);
    setWatchlist(next);
    saveWatchlist(next);
    syncUrl(symbol, interval, indicators, next);
  };

  const updateWatchPrice = (sym: string, price: number, change: number, changePct: number) => {
    setWatchlist((prev) =>
      prev.map((w) => (w.symbol === sym ? { ...w, price, change, changePct } : w))
    );
  };

  const handleSaveKeys = (claude: string, twelve: string) => {
    localStorage.setItem("claude_api_key", claude);
    localStorage.setItem("twelve_data_key", twelve);
    setApiKey(claude);
    setTwelveDataKey(twelve);
    setShowModal(false);
  };

  const shareUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URLをコピーしました！");
  };

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleSwipeEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    const tabs = ["chart", "watch", "ai"] as const;
    const idx = tabs.indexOf(mobileTab);
    if (delta < -60 && idx < tabs.length - 1) setMobileTab(tabs[idx + 1]);
    if (delta > 60 && idx > 0) setMobileTab(tabs[idx - 1]);
  };

  const rightPanelTab = mobileTab === "ai" ? "ai" : "watch";

  return (
    <div className="flex flex-col h-[100dvh] bg-[#131722] text-white select-none">
      {showModal && (
        <ApiKeyModal onSave={handleSaveKeys} onClose={() => setShowModal(false)} />
      )}

      <TopBar
        symbol={symbol}
        interval={interval}
        indicators={indicators}
        onSymbolChange={handleSymbolChange}
        onIntervalChange={handleIntervalChange}
        onToggleIndicator={toggleIndicator}
        onClearIndicators={clearAllIndicators}
        onOpenSettings={() => setShowModal(true)}
        onAddWatch={addToWatchlist}
      />

      {/* ── Desktop layout ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <TradingChart
            symbol={symbol} interval={interval} range={range}
            onRangeChange={setRange} indicators={indicators}
            twelveDataKey={twelveDataKey}
            onPriceUpdate={(price, change, changePct) => updateWatchPrice(symbol, price, change, changePct)}
            onScreenshot={(base64) => { setScreenshotImage(base64); setRightTab("ai"); }}
            onReadyToScreenshot={(fn) => { takeScreenshotRef.current = fn; }}
          />
        </div>
        <RightPanel
          tab={rightTab} onTabChange={setRightTab}
          watchlist={watchlist} activeSymbol={symbol}
          onSelectSymbol={handleSymbolChange} onRemoveSymbol={removeFromWatchlist}
          apiKey={apiKey} symbol={symbol} interval={interval} indicators={indicators}
          onAddWatch={addToWatchlist}
          screenshotImage={screenshotImage} onScreenshotConsumed={() => setScreenshotImage(null)}
          onTakeScreenshot={() => { setRightTab("ai"); takeScreenshotRef.current?.(); }}
          onReorder={(newList) => { setWatchlist(newList); saveWatchlist(newList); }}
        />
      </div>

      {/* ── Mobile layout ── */}
      <div
        className="md:hidden flex-1 overflow-hidden relative"
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
      >
        {/* Chart tab — 常にレンダリング維持（スクリーンショットのため） */}
        <div className={`w-full h-full flex flex-col ${mobileTab === "chart" ? "relative z-10" : "absolute inset-0 opacity-0 pointer-events-none -z-10"}`}>
          <TradingChart
            symbol={symbol} interval={interval} range={range}
            onRangeChange={setRange} indicators={indicators}
            twelveDataKey={twelveDataKey}
            onPriceUpdate={(price, change, changePct) => updateWatchPrice(symbol, price, change, changePct)}
            onScreenshot={(base64) => { setScreenshotImage(base64); setMobileTab("ai"); }}
            onReadyToScreenshot={(fn) => { takeScreenshotMobileRef.current = fn; }}
          />
        </div>

        {/* Watch / AI tab */}
        <div className={`w-full h-full ${mobileTab !== "chart" ? "block" : "hidden"}`}>
          <RightPanel
            tab={rightPanelTab} onTabChange={(t) => { setRightTab(t); setMobileTab(t); }}
            watchlist={watchlist} activeSymbol={symbol}
            onSelectSymbol={(s) => { handleSymbolChange(s); setMobileTab("chart"); }}
            onRemoveSymbol={removeFromWatchlist}
            apiKey={apiKey} symbol={symbol} interval={interval} indicators={indicators}
            onAddWatch={addToWatchlist}
            screenshotImage={screenshotImage} onScreenshotConsumed={() => setScreenshotImage(null)}
            onTakeScreenshot={() => { setMobileTab("ai"); takeScreenshotMobileRef.current?.(); }}
            onReorder={(newList) => { setWatchlist(newList); saveWatchlist(newList); }}
          />
        </div>
      </div>

      <MobileTabBar
        active={mobileTab}
        onChange={(tab) => {
          setMobileTab(tab);
          if (tab === "ai") setRightTab("ai");
          if (tab === "watch") setRightTab("watch");
        }}
      />
    </div>
  );
}
