"use client";

import { useState } from "react";
import { Indicators } from "@/app/page";

const GLOSSARY: { term: string; reading: string; desc: string }[] = [
  {
    term: "デッドクロス",
    reading: "Dead Cross",
    desc: "短期移動平均線（20MA）が長期移動平均線（50MA）を上から下に突き抜けるサイン。下落トレンドへの転換シグナルとされ、売りのタイミングの目安になる。",
  },
  {
    term: "ゴールデンクロス",
    reading: "Golden Cross",
    desc: "短期移動平均線（20MA）が長期移動平均線（50MA）を下から上に突き抜けるサイン。上昇トレンドへの転換シグナルとされ、買いのタイミングの目安になる。デッドクロスの逆。",
  },
  {
    term: "サポートライン",
    reading: "Support Line",
    desc: "価格が下落する際に何度も跳ね返される「床」となる水平線。需要が集中するため売りが止まりやすい。このラインを大きく割り込むとさらなる下落が加速しやすい。",
  },
  {
    term: "レジスタンスライン",
    reading: "Resistance Line",
    desc: "価格が上昇する際に何度も跳ね返される「天井」となる水平線。売りが集中するため上昇が止まりやすい。このラインを大きく突破すると上昇が加速しやすい（ブレイクアウト）。",
  },
  {
    term: "RSI",
    reading: "Relative Strength Index",
    desc: "過買い・過売りを0〜100の数値で示すオシレーター系指標。一般的に70以上で「買われすぎ（売りサイン）」、30以下で「売られすぎ（買いサイン）」とされる。期間は14日が標準。",
  },
  {
    term: "MACD",
    reading: "Moving Average Convergence Divergence",
    desc: "短期EMA（12）と長期EMA（26）の差（MACDライン）と、その9日平均（シグナル）を使うトレンド系指標。MACDがシグナルを上抜けると買いサイン、下抜けると売りサイン。ヒストグラムで勢いを確認できる。",
  },
  {
    term: "ボリンジャーバンド",
    reading: "Bollinger Bands",
    desc: "移動平均線の上下に標準偏差×2の帯を描いた指標。価格はバンド内に約95%収まる統計的性質を利用する。バンドが収縮（スクイーズ）すると大きな値動きの前兆、拡張（エクスパンション）するとトレンド継続を示す。",
  },
  {
    term: "フィボナッチリトレースメント",
    reading: "Fibonacci Retracement",
    desc: "高値・安値間を黄金比（23.6%・38.2%・50%・61.8%・78.6%）で分割した水平線。相場の反発・押し目の目安として使われる。特に38.2%・61.8%が強いサポート/レジスタンスになりやすい。",
  },
  {
    term: "出来高",
    reading: "Volume",
    desc: "一定期間に売買が成立した株数や契約数。価格変動に「信頼性」を与える指標。出来高が多い状態での価格上昇は本物のトレンドである可能性が高く、出来高が少ない上昇は継続しにくい。",
  },
  {
    term: "VIX指数",
    reading: "Volatility Index（恐怖指数）",
    desc: "S&P500オプションから算出される市場の「恐怖度」を示す指数。20以下は安定、20〜30は警戒、30以上はパニック状態の目安。急上昇すると株式市場の急落と連動することが多い。逆張りの買い指標にも使われる。",
  },
  {
    term: "一目均衡表",
    reading: "Ichimoku Cloud",
    desc: "日本発のテクニカル指標。転換線・基準線・雲（先行スパンA・B）・遅行スパンで構成される。価格が雲の上にあれば上昇トレンド、下にあれば下降トレンド。雲の厚さが抵抗力の強さを示す。",
  },
  {
    term: "損切り（ストップロス）",
    reading: "Stop Loss",
    desc: "あらかじめ決めた価格まで下落したら損失を確定して売る手法。「損小利大」の原則に基づき、想定外の大損を防ぐために必須のリスク管理。一般的にエントリー価格から2〜5%下を目安に設定する。",
  },
];

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

const IND_GROUPS: { group: string; items: { key: keyof Indicators; label: string; color?: string | string[] }[] }[] = [
  {
    group: "トレンド",
    items: [
      { key: "ma20",     label: "MA 20",           color: "#eab308" },
      { key: "ma50",     label: "MA 50",            color: "#60a5fa" },
      { key: "ma200",    label: "MA 200",           color: "#f87171" },
      { key: "bb",       label: "ボリンジャーバンド" },
      { key: "ichimoku", label: "一目均衡表" },
      { key: "fib",      label: "フィボナッチ" },
    ],
  },
  {
    group: "オシレーター",
    items: [
      { key: "rsi",   label: "RSI" },
      { key: "macd",  label: "MACD" },
      { key: "stoch", label: "ストキャスティクス" },
      { key: "adx",   label: "DMI / ADX" },
    ],
  },
  {
    group: "その他",
    items: [
      { key: "volume", label: "出来高" },
      { key: "atr",    label: "ATR" },
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
  onClearIndicators: () => void;
  onOpenSettings: () => void;
  onAddWatch: (s: string) => void;
};

export default function TopBar({
  symbol, interval, indicators,
  onSymbolChange, onIntervalChange, onToggleIndicator, onClearIndicators,
  onOpenSettings, onAddWatch,
}: Props) {
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = SYMBOLS.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-[#1e222d] border-b border-[#2a2e39] text-sm relative z-20">
      {/* Logo */}
      <div className="flex items-center gap-1 mr-2">
        <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-xs font-bold">H</div>
        <span className="text-[#d1d4dc] font-semibold text-xs hidden lg:block">TradeAI</span>
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

      <div className="w-px h-5 bg-[#2a2e39]" />

      {/* Indicators */}
      <div className="relative">
        <button
          onClick={() => setShowIndicators(!showIndicators)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded"
        >
          <svg className="w-4 h-4 text-blue-400 md:text-[#787b86] md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <line x1="12" y1="8" x2="12" y2="8" strokeWidth={3} strokeLinecap="round" />
            <line x1="12" y1="12" x2="12" y2="16" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <span className="hidden md:inline">インジケーター</span>
        </button>
        {showIndicators && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-[#1e222d] border border-[#2a2e39] rounded shadow-xl z-50 max-h-[70vh] overflow-y-auto">
            <div className="p-2 border-b border-[#2a2e39]">
              <button
                onClick={() => { onClearIndicators(); setShowIndicators(false); }}
                className="w-full text-xs text-[#787b86] hover:text-orange-400 hover:bg-[#2a2e39] rounded px-2 py-1.5 text-left"
              >
                全OFF
              </button>
            </div>
            {IND_GROUPS.map(({ group, items }) => (
              <div key={group}>
                <div className="px-3 py-1.5 text-[10px] text-[#434651] uppercase tracking-wider border-b border-[#2a2e39]">{group}</div>
                {items.map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => onToggleIndicator(key)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#2a2e39]"
                  >
                    <span className="flex items-center gap-2">
                      {/* color swatch */}
                      {color && (
                        <span className="flex items-center gap-0.5 flex-shrink-0">
                          {(Array.isArray(color) ? color.slice(0, 3) : [color]).map((c, i) => (
                            <span key={i} style={{ backgroundColor: c }} className="inline-block w-4 h-[3px] rounded-full" />
                          ))}
                        </span>
                      )}
                      <span className={indicators[key] ? "text-blue-400" : "text-[#787b86]"}>{label}</span>
                    </span>
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

      <div className="w-px h-5 bg-[#2a2e39]" />

      {/* Glossary */}
      <div className="relative">
        <button
          onClick={() => { setShowGlossary(!showGlossary); setShowIndicators(false); }}
          className="flex items-center gap-1 px-2 py-1 text-xs text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="hidden md:inline">用語集</span>
        </button>
        {showGlossary && (
          <div className="absolute top-full left-0 mt-1 w-72 bg-[#1e222d] border border-[#2a2e39] rounded shadow-xl z-50 max-h-[70vh] overflow-y-auto">
            <div className="px-3 py-2 border-b border-[#2a2e39] text-[10px] text-[#434651] uppercase tracking-wider">
              トレード用語集
            </div>
            {GLOSSARY.map(({ term, reading, desc }) => (
              <div key={term} className="px-3 py-3 border-b border-[#2a2e39] last:border-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-[#d1d4dc]">{term}</span>
                  <span className="text-[10px] text-[#434651]">{reading}</span>
                </div>
                <p className="text-[11px] text-[#787b86] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Right actions */}
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
