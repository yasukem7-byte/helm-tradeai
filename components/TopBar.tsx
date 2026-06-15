"use client";

import { useState } from "react";
import { Indicators } from "@/app/page";

const INTERVALS = [
  { label: "1", value: "1min" },
  { label: "5", value: "5min" },
  { label: "15", value: "15min" },
  { label: "30", value: "30min" },
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "日", value: "1day" },
  { label: "週", value: "1week" },
  { label: "月", value: "1month" },
  { label: "年", value: "12month" },
];

const IND_GROUPS: { group: string; items: { key: keyof Indicators; label: string }[] }[] = [
  {
    group: "トレンド",
    items: [
      { key: "ma20", label: "MA 20" },
      { key: "ma50", label: "MA 50" },
      { key: "ma200", label: "MA 200" },
      { key: "bb", label: "ボリンジャーバンド" },
      { key: "ichimoku", label: "一目均衡表" },
      { key: "fib", label: "フィボナッチ" },
    ],
  },
  {
    group: "オシレーター",
    items: [
      { key: "rsi", label: "RSI" },
      { key: "macd", label: "MACD" },
      { key: "stoch", label: "ストキャスティクス" },
      { key: "adx", label: "DMI / ADX" },
    ],
  },
  {
    group: "その他",
    items: [
      { key: "volume", label: "出来高" },
      { key: "atr", label: "ATR" },
    ],
  },
];

const SYMBOLS = [
  "XAU/USD","XAG/USD","EUR/USD","GBP/USD","USD/JPY","AUD/USD",
  "BTC/USD","ETH/USD","AAPL","NVDA","TSLA","SPY","QQQ","NQ1!","CL1!",
];

type Props = {
  symbol: string;
  interval: string;
  indicators: Indicators;
  onSymbolChange: (s: string) => void;
  onIntervalChange: (i: string) => void;
  onToggleIndicator: (k: keyof Indicators) => void;
  onShare: () => void;
  onOpenSettings: () => void;
  onAddWatch: (s: string) => void;
};

export default function TopBar({
  symbol, interval, indicators,
  onSymbolChange, onIntervalChange, onToggleIndicator,
  onShare, onOpenSettings, onAddWatch,
}: Props) {
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = SYMBOLS.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-[#1e222d] border-b border-[#2a2e39] text-sm relative z-20">
      {/* Logo */}
      <div className="flex items-center gap-1 mr-2">
        <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-xs font-bold">H</div>
        <span className="text-[#d1d4dc] font-semibold text-xs hidden lg:block">HELM.TradeAI</span>
      </div>

      <div className="w-px h-5 bg-[#2a2e39]" />

      {/* Symbol selector */}
      <div className="relative">
        <button
          onClick={() => { setShowSymbolSearch(!showSymbolSearch); setSearch(""); }}
          className="flex items-center gap-1 px-2 py-1 hover:bg-[#2a2e39] rounded text-[#d1d4dc] font-semibold"
        >
          {symbol}
          <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showSymbolSearch && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-[#1e222d] border border-[#2a2e39] rounded shadow-xl">
            <div className="p-2">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="検索..."
                className="w-full bg-[#131722] border border-[#2a2e39] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.map((s) => (
                <button
                  key={s}
                  onClick={() => { onSymbolChange(s); setShowSymbolSearch(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2a2e39] ${
                    s === symbol ? "text-blue-400" : "text-[#d1d4dc]"
                  }`}
                >
                  {s}
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddWatch(s); }}
                    className="float-right text-xs text-gray-500 hover:text-blue-400"
                  >
                    ＋Watch
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-[#2a2e39]" />

      {/* Intervals */}
      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none max-w-[40vw] md:max-w-none">
        {INTERVALS.map((i) => (
          <button
            key={i.value}
            onClick={() => onIntervalChange(i.value)}
            className={`px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${
              interval === i.value
                ? "bg-blue-600 text-white"
                : "text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39]"
            }`}
          >
            {i.label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-[#2a2e39] hidden md:block" />

      {/* Indicators */}
      <div className="relative hidden md:block">
        <button
          onClick={() => setShowIndicators(!showIndicators)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          インジケーター
        </button>
        {showIndicators && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-[#1e222d] border border-[#2a2e39] rounded shadow-xl z-50">
            {IND_GROUPS.map(({ group, items }) => (
              <div key={group}>
                <div className="px-3 py-1.5 text-[10px] text-[#434651] uppercase tracking-wider border-b border-[#2a2e39]">{group}</div>
                {items.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => onToggleIndicator(key)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#2a2e39]"
                  >
                    <span className={indicators[key] ? "text-blue-400" : "text-[#787b86]"}>{label}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      indicators[key] ? "bg-blue-600 border-blue-600" : "border-[#434651]"
                    }`}>
                      {indicators[key] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <button
        onClick={onShare}
        className="px-2 py-1 text-xs text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        共有
      </button>
      <button
        onClick={onOpenSettings}
        className="px-2 py-1 text-xs text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded"
        title="APIキー設定"
      >
        ⚙
      </button>
    </div>
  );
}
