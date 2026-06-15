"use client";

import { useState, useRef } from "react";
import { Indicators, WatchItem } from "@/app/page";
import AiChat from "@/components/AiChat";

const SYMBOL_NAMES: Record<string, string> = {
  // コモディティ
  "XAU/USD": "Gold", "XAG/USD": "Silver", "XPT/USD": "Platinum",
  // 為替
  "EUR/USD": "Euro / Dollar", "USD/JPY": "Dollar / Yen",
  "GBP/USD": "Pound / Dollar", "AUD/USD": "Aussie / Dollar",
  // 仮想通貨
  "BTC/USD": "Bitcoin", "ETH/USD": "Ethereum",
  // 米国株 AI・半導体
  "NVDA": "NVIDIA", "AMD": "Advanced Micro Devices", "MU": "Micron Technology",
  "LRCX": "Lam Research", "AVGO": "Broadcom", "IBM": "IBM", "INTC": "Intel",
  // 米国株 テック・プラットフォーム
  "MSFT": "Microsoft", "GOOG": "Alphabet (Google)", "META": "Meta Platforms",
  "AMZN": "Amazon", "PLTR": "Palantir", "AAPL": "Apple",
  // 米国株 防衛・インフラ・宇宙
  "KTOS": "Kratos Defense", "STRL": "Sterling Infrastructure",
  "TTAN": "Titan Machinery", "SPCX": "SpaceX",
  // 米国株 その他
  "TSLA": "Tesla", "ONDS": "Ondas Holdings", "ONON": "On Running",
  "V": "Visa", "JEPQ": "JPMorgan Nasdaq ETF", "BRKB": "Berkshire Hathaway",
  "ABBV": "AbbVie", "GLDM": "SPDR Gold MiniShares",
  "SPY": "S&P 500 ETF", "QQQ": "Nasdaq 100 ETF",
  // 日本株
  "7203": "トヨタ", "6758": "ソニー", "9984": "ソフトバンクG",
  "6861": "キーエンス", "7974": "任天堂", "8306": "三菱UFJ",
  "9432": "NTT", "6902": "デンソー", "4063": "信越化学", "8035": "東京エレクトロン",
  "5803": "フジクラ", "6976": "太陽誘電", "285A": "キオクシア",
  "7011": "三菱重工業", "5801": "古河電工", "8001": "伊藤忠",
  "425A": "GXゴールド", "4004": "レゾナック", "424A": "GXゴールドH",
  "6701": "NEC", "8593": "三菱HCキャピタル", "485A": "パワーエックス",
  "5805": "SWCC", "7013": "IHI", "8058": "三菱商事",
  "186A": "アストロスケール", "2036": "NN金ダブルブルETN", "1540": "純金上場信託",
};
const JP_NAMES = SYMBOL_NAMES; // 後方互換

const ALL_SYMBOLS = [
  // コモディティ・FX
  "XAU/USD","XAG/USD","EUR/USD","GBP/USD","USD/JPY","AUD/USD",
  // 暗号資産
  "BTC/USD","ETH/USD",
  // 米国株 AI・半導体
  "NVDA","AMD","MU","LRCX","AVGO","IBM","INTC",
  // 米国株 テック・プラットフォーム
  "MSFT","GOOG","META","AMZN","PLTR","AAPL",
  // 米国株 防衛・インフラ・宇宙
  "KTOS","STRL","TTAN","SPCX",
  // 米国株 その他
  "TSLA","ONDS","ONON","V","JEPQ","BRKB","ABBV","GLDM","SPY","QQQ",
  // 日本株
  "7203","6758","9984","6861","7974","8306","9432","6902","4063","8035",
  "5803","6976","285A","7011","5801","8001","425A","4004","424A",
  "6701","8593","485A","5805","7013","8058","186A","2036","1540",
];

type Props = {
  tab: "watch" | "ai";
  onTabChange: (t: "watch" | "ai") => void;
  watchlist: WatchItem[];
  activeSymbol: string;
  onSelectSymbol: (s: string) => void;
  onRemoveSymbol: (s: string) => void;
  onAddWatch: (s: string) => void;
  apiKey: string;
  symbol: string;
  interval: string;
  indicators: Indicators;
  screenshotImage?: string | null;
  onScreenshotConsumed?: () => void;
  onTakeScreenshot?: () => void;
  onReorder?: (newList: WatchItem[]) => void;
};

export default function RightPanel({
  tab, onTabChange,
  watchlist, activeSymbol, onSelectSymbol, onRemoveSymbol, onAddWatch,
  apiKey, symbol, interval, indicators,
  screenshotImage, onScreenshotConsumed, onTakeScreenshot, onReorder,
}: Props) {
  const [showAddSearch, setShowAddSearch] = useState(false);
  const [addSearch, setAddSearch] = useState("");

  const filteredAdd = ALL_SYMBOLS.filter(
    (s) =>
      s.toLowerCase().includes(addSearch.toLowerCase()) &&
      !watchlist.find((w) => w.symbol === s)
  );

  return (
    <div className="w-full md:w-64 bg-[#1e222d] md:border-l border-[#2a2e39] flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#2a2e39]">
        <button
          onClick={() => onTabChange("watch")}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            tab === "watch"
              ? "text-[#d1d4dc] border-b-2 border-blue-500"
              : "text-[#787b86] hover:text-[#d1d4dc]"
          }`}
        >
          ウォッチリスト
        </button>
        <button
          onClick={() => onTabChange("ai")}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            tab === "ai"
              ? "text-[#d1d4dc] border-b-2 border-blue-500"
              : "text-[#787b86] hover:text-[#d1d4dc]"
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
            <path d="M12 2a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2z"/>
            <circle cx="9" cy="11" r="1.2" fill="#3b82f6" stroke="none"/>
            <circle cx="15" cy="11" r="1.2" fill="#3b82f6" stroke="none"/>
            <path d="M9 15.5c.8.8 2 1 3 1s2.2-.2 3-1"/>
            <line x1="12" y1="2" x2="12" y2="4"/>
          </svg>AI相談
        </button>
      </div>

      {tab === "watch" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* List header */}
          <div className="flex items-center px-3 py-1.5 border-b border-[#2a2e39]">
            <div className="w-5 flex-shrink-0" />
            <span className="text-[10px] text-[#787b86] flex-1">シンボル</span>
            <span className="text-[10px] text-[#787b86] w-20 text-right">現在値</span>
            <span className="text-[10px] text-[#787b86] w-16 text-right">変動率</span>
          </div>

          {/* Watchlist items with groups */}
          <div className="flex-1 overflow-y-auto">
            <WatchlistWithGroups
              watchlist={watchlist}
              activeSymbol={activeSymbol}
              onSelectSymbol={onSelectSymbol}
              onRemoveSymbol={onRemoveSymbol}
              onReorder={(newList) => onReorder?.(newList)}
            />
          </div>

          {/* Add button */}
          <div className="p-2 border-t border-[#2a2e39]">
            {showAddSearch ? (
              <div>
                <div className="flex gap-1 mb-1">
                  <input
                    autoFocus
                    type="text"
                    value={addSearch}
                    onChange={(e) => setAddSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && addSearch.trim()) {
                        onAddWatch(addSearch.trim().toUpperCase());
                        setShowAddSearch(false);
                        setAddSearch("");
                      }
                      if (e.key === "Escape") setShowAddSearch(false);
                    }}
                    placeholder="例: XAU/USD, AAPL, BTC..."
                    className="flex-1 bg-[#131722] border border-blue-500 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={() => setShowAddSearch(false)}
                    className="px-2 text-[#787b86] hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
                {/* Suggestions */}
                <div className="rounded border border-[#2a2e39] overflow-hidden">
                  {filteredAdd.slice(0, 6).map((s) => (
                    <button
                      key={s}
                      onClick={() => { onAddWatch(s); setShowAddSearch(false); setAddSearch(""); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#d1d4dc] hover:bg-[#2a2e39] border-b border-[#2a2e39] last:border-0 flex items-center justify-between"
                    >
                      <span>{s}</span>
                      {JP_NAMES[s] && <span className="text-[10px] text-[#787b86]">{JP_NAMES[s]}</span>}
                    </button>
                  ))}
                  {addSearch.trim() && !filteredAdd.includes(addSearch.trim().toUpperCase()) && (
                    <button
                      onClick={() => { onAddWatch(addSearch.trim().toUpperCase()); setShowAddSearch(false); setAddSearch(""); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-blue-400 hover:bg-[#2a2e39]"
                    >
                      ＋ 「{addSearch.trim().toUpperCase()}」を追加
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-[#434651] mt-1 text-center">Enterキーで追加</p>
              </div>
            ) : (
              <button
                onClick={() => setShowAddSearch(true)}
                className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded transition-colors border border-dashed border-[#2a2e39] hover:border-[#434651]"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                銘柄を追加
              </button>
            )}
          </div>
        </div>
      )}

      {tab === "ai" && (
        <div className="flex-1 overflow-hidden">
          <AiChat
            apiKey={apiKey}
            symbol={symbol}
            interval={interval}
            indicators={indicators}
            screenshotImage={screenshotImage}
            onScreenshotConsumed={onScreenshotConsumed}
            onTakeScreenshot={onTakeScreenshot}
          />
        </div>
      )}
    </div>
  );
}

function WatchlistWithGroups({
  watchlist, activeSymbol, onSelectSymbol, onRemoveSymbol, onReorder,
}: {
  watchlist: WatchItem[];
  activeSymbol: string;
  onSelectSymbol: (s: string) => void;
  onRemoveSymbol: (s: string) => void;
  onReorder: (newList: WatchItem[]) => void;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const groupNames = [...new Set(watchlist.filter(w => w.group).map(w => w.group!))];
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(
    () => Object.fromEntries(groupNames.map(g => [g, true]))
  );
  const dragSymbol = useRef<string | null>(null);
  const dragGroup = useRef<string | null>(null);

  const ungrouped = watchlist.filter((w) => !w.group);
  const groupMap: Record<string, WatchItem[]> = {};
  watchlist.filter((w) => w.group).forEach((w) => {
    const g = w.group!;
    if (!groupMap[g]) groupMap[g] = [];
    groupMap[g].push(w);
  });

  const toggleGroup = (name: string) =>
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleDragStart = (symbol: string, group: string | undefined) => {
    dragSymbol.current = symbol;
    dragGroup.current = group ?? null;
  };

  const handleDrop = (targetSymbol: string, targetGroup: string | undefined) => {
    if (!dragSymbol.current || dragSymbol.current === targetSymbol) return;

    const newList = [...watchlist];
    const fromIdx = newList.findIndex((w) => w.symbol === dragSymbol.current);
    const toIdx = newList.findIndex((w) => w.symbol === targetSymbol);
    if (fromIdx === -1 || toIdx === -1) return;

    // グループをまたぐ場合はgroupを更新
    newList[fromIdx] = { ...newList[fromIdx], group: targetGroup };
    const [moved] = newList.splice(fromIdx, 1);
    const newToIdx = newList.findIndex((w) => w.symbol === targetSymbol);
    newList.splice(newToIdx, 0, moved);
    onReorder(newList);
    dragSymbol.current = null;
  };

  const handleDropOnGroup = (groupName: string) => {
    if (!dragSymbol.current) return;
    const newList = watchlist.map((w) =>
      w.symbol === dragSymbol.current ? { ...w, group: groupName } : w
    );
    onReorder(newList);
    dragSymbol.current = null;
  };

  return (
    <>
      {ungrouped.map((item) => (
        <WatchRow
          key={item.symbol}
          item={item}
          isActive={item.symbol === activeSymbol}
          onClick={() => onSelectSymbol(item.symbol)}
          onRemove={() => onRemoveSymbol(item.symbol)}
          onDragStart={() => handleDragStart(item.symbol, undefined)}
          onDrop={() => handleDrop(item.symbol, undefined)}
        />
      ))}
      {Object.entries(groupMap).map(([groupName, items]) => (
        <div key={groupName}>
          <button
            onClick={() => toggleGroup(groupName)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleDropOnGroup(groupName); }}
            className="w-full flex items-center gap-1 px-3 py-2.5 md:py-1.5 bg-[#161b27] hover:bg-[#1e2535] border-t border-b border-[#2a2e39] transition-colors"
          >
            <svg
              className={`w-3 h-3 text-[#787b86] transition-transform flex-shrink-0 ${collapsed[groupName] ? "-rotate-90" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-[10px] text-[#787b86] uppercase tracking-wider font-medium">{groupName}</span>
            <span className="text-[10px] text-[#434651] ml-auto">{items.length}</span>
          </button>
          {!collapsed[groupName] && items.map((item) => (
            <WatchRow
              key={item.symbol}
              item={item}
              isActive={item.symbol === activeSymbol}
              onClick={() => onSelectSymbol(item.symbol)}
              onRemove={() => onRemoveSymbol(item.symbol)}
              onDragStart={() => handleDragStart(item.symbol, groupName)}
              onDrop={() => handleDrop(item.symbol, groupName)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function WatchRow({
  item,
  isActive,
  onClick,
  onRemove,
  onDragStart,
  onDrop,
}: {
  item: WatchItem;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
  onDragStart?: () => void;
  onDrop?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const isUp = (item.changePct ?? 0) >= 0;
  const priceStr = item.price !== undefined
    ? item.price >= 1000 ? item.price.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : item.price >= 1 ? item.price.toFixed(3)
    : item.price.toFixed(5)
    : null;

  return (
    <div
      draggable
      onDragStart={(e) => { e.stopPropagation(); onDragStart?.(); }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); onDrop?.(); }}
      className={`flex items-center px-2 py-2.5 md:py-1.5 cursor-pointer transition-colors group border-t-2 ${
        dragOver ? "border-blue-500" : "border-transparent"
      } ${isActive ? "bg-[#2a2e39]" : "hover:bg-[#252830]"}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ドラッグハンドル */}
      <div className={`w-3 flex-shrink-0 flex flex-col gap-0.5 mr-1 cursor-grab ${hovered ? "opacity-40" : "opacity-0"}`}>
        <div className="w-2.5 h-px bg-[#787b86]" />
        <div className="w-2.5 h-px bg-[#787b86]" />
        <div className="w-2.5 h-px bg-[#787b86]" />
      </div>

      {/* 削除ボタン */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className={`w-4 h-4 flex-shrink-0 flex items-center justify-center rounded text-[10px] transition-all ${
          hovered ? "text-red-400 hover:bg-red-400/20" : "text-transparent"
        }`}
      >✕</button>

      {/* Symbol + name */}
      <div className="flex-1 min-w-0 ml-0.5">
        <div className={`text-xs font-semibold truncate leading-tight ${isActive ? "text-blue-400" : "text-[#d1d4dc]"}`}>
          {item.symbol}
        </div>
        {JP_NAMES[item.symbol] && (
          <div className="text-[10px] text-[#787b86] truncate leading-tight">{JP_NAMES[item.symbol]}</div>
        )}
      </div>

      {/* Price */}
      <div className="w-20 text-right flex-shrink-0">
        {priceStr
          ? <span className="text-xs text-[#d1d4dc] font-mono">{priceStr}</span>
          : <span className="text-xs text-[#434651]">--</span>
        }
      </div>

      {/* Change% */}
      <div className={`w-16 text-right flex-shrink-0 text-xs font-mono ${isUp ? "text-[#26a69a]" : "text-[#ef5350]"}`}>
        {item.changePct !== undefined
          ? `${isUp ? "+" : ""}${item.changePct.toFixed(2)}%`
          : <span className="text-[#434651]">--</span>
        }
      </div>
    </div>
  );
}
