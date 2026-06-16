"use client";

import React, { useState, useRef } from "react";
import { Indicators, WatchItem } from "@/app/page";
import AiChat from "@/components/AiChat";

const SYMBOL_NAMES: Record<string, string> = {
  // 主要指数
  "SPX": "S&P 500", "NDX": "Nasdaq 100", "DJI": "Dow Jones",
  "NI225": "日経平均", "VIX": "恐怖指数 VIX",
  "T10Y2Y": "逆イールド 10Y-2Y",
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
  // 2倍レバレッジ ETF
  "SSO": "S&P500 2×", "QLD": "Nasdaq100 2×",
  "USD": "半導体セクター 2×", "ROM": "米テクノロジー株 2×",
  "UGL": "金価格 2×", "AGQ": "銀価格 2×",
  "1570": "日経平均 約2×", "1358": "日経平均 約2×",
  // 3倍レバレッジ ETF
  "SOXL": "半導体株 3×", "TECL": "テクノロジー株 3×", "TQQQ": "Nasdaq100 3×",
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

const SYMBOL_INFO: Record<string, string> = {
  // 主要指数
  "SPX": "S&P 500指数。米国大型株500社の時価総額加重平均。米国株市場全体の動きを示す代表的な指標。",
  "NDX": "Nasdaq 100指数。ナスダック上場の主要テック100社。AAPL・MSFT・NVDAなど大型IT株が中心。",
  "DJI": "ダウ工業株30種平均。米国の優良大型株30社の株価平均。歴史ある代表的な株価指数。",
  "NI225": "日経平均株価。東証プライム上場の代表的な225銘柄の平均株価。日本株市場の指標。",
  "VIX": "恐怖指数とも呼ばれる市場の変動率指数。20以上で警戒、30以上でパニック相場とされる。",
  "T10Y2Y": "10年債と2年債の利回り差。マイナス（逆イールド）になると景気後退の前兆とされる。",
  // コモディティ
  "XAU/USD": "金（ゴールド）の対ドル価格。有事の安全資産。インフレヘッジとして機能する実物資産。",
  "XAG/USD": "銀（シルバー）の対ドル価格。工業用需要と投資需要の両面を持つ。金より値動きが大きい。",
  "XPT/USD": "プラチナの対ドル価格。自動車触媒・水素燃料電池向け需要。金より希少で産出量が少ない。",
  "425A": "国内ETF。金価格に連動するGXゴールド（為替ヘッジなし）。円建てで金投資ができる。",
  "424A": "国内ETF。金価格に連動するGXゴールド（為替ヘッジあり）。為替リスクを抑えた金投資。",
  "GLDM": "米国ETF。SPDRゴールド・ミニシェアーズ。低コストで金価格に連動する米国上場ETF。",
  // 為替
  "EUR/USD": "ユーロ対米ドル。世界で最も取引量の多い通貨ペア。欧米の金利差が相場に影響。",
  "USD/JPY": "米ドル対円。日米金利差に敏感。円安・円高が日本株や輸出企業業績に直結する。",
  // 仮想通貨
  "BTC/USD": "ビットコイン。世界最大の暗号通貨。デジタルゴールドとも呼ばれ機関投資家も参入。",
  "ETH/USD": "イーサリアム。スマートコントラクト基盤。DeFi・NFT・Web3の基軸通貨的存在。",
  // 米国株
  "NVDA": "NVIDIA。AIチップ（GPU）世界最大手。データセンター向けH100が爆発的需要。AI相場の中心銘柄。",
  "AMD": "Advanced Micro Devices。CPUとGPUを開発。IntelとNVIDIAの両方と競合するチップメーカー。",
  "MU": "マイクロン・テクノロジー。DRAM・NANDフラッシュ大手。AI向けHBMメモリで注目。",
  "LRCX": "ラム・リサーチ。半導体製造装置メーカー。エッチング装置で世界シェアトップクラス。",
  "AVGO": "ブロードコム。半導体とインフラソフトウェア。AIネットワーク向けチップで急成長。",
  "IBM": "IBM。エンタープライズAI・量子コンピュータ・ハイブリッドクラウドに注力する老舗IT企業。",
  "INTC": "インテル。CPU最大手だったが競争激化で苦戦。製造部門（ファウンドリ）再建中。",
  "MSFT": "マイクロソフト。Windows・Azure・Office 365。OpenAIに大規模出資しAI事業を強化。",
  "GOOG": "Alphabet（Google）。検索・YouTube・GCP。Gemini AIでOpenAIに対抗。広告収益が柱。",
  "META": "Meta Platforms。Facebook・Instagram・WhatsApp運営。VR（Quest）とAI Llamaにも注力。",
  "AMZN": "Amazon。Eコマース＋クラウド（AWS）。AWSは世界最大のクラウドで高利益率事業。",
  "PLTR": "Palantir。政府・企業向けAIデータ分析プラットフォーム。米軍との契約でも有名。",
  "TSLA": "テスラ。EV世界最大手。自動運転・エネルギー貯蔵・ロボタクシー事業も展開。",
  "V": "Visa。世界最大の決済ネットワーク。カード取引手数料ビジネスで安定的な収益を稼ぐ。",
  "JEPQ": "JPMorganのNasdaq100カバードコールETF。毎月分配型。高配当が特徴の米国ETF。",
  "BRKB": "バークシャー・ハサウェイB株。ウォーレン・バフェット率いる投資持株会社。多業種に分散。",
  "ABBV": "アッヴィ。製薬大手。ヒュミラ（関節リウマチ薬）が主力。がん・免疫領域も強化。",
  "KTOS": "クラトス・ディフェンス。ドローン・無人機・極超音速兵器を開発する米国防衛企業。",
  "STRL": "スターリング・インフラ。インフラ建設大手。データセンター・電力インフラ需要で成長。",
  "ONDS": "オンダス・ホールディングス。産業用ドローン・鉄道通信システムを手掛ける中小型株。",
  "ONON": "On Running（オン）。スイス発スポーツシューズブランド。アスリートからカジュアルまで人気拡大。",
  // 日本株
  "7974": "任天堂。Switch・マリオ・ゼルダ等のゲーム機・ソフト。IP（知的財産）ビジネスも強化。",
  "8306": "三菱UFJフィナンシャル・グループ。日本最大のメガバンク。金利上昇で収益改善期待。",
  "8001": "伊藤忠商事。繊維・食料・エネルギー等幅広い総合商社。非資源分野に強み。",
  "8058": "三菱商事。資源・エネルギー・インフラ・食料の総合商社。バフェットが投資で注目。",
  "9432": "NTT。日本最大の通信キャリア。IOWN（次世代光通信）プロジェクトを推進。",
  "8593": "三菱HCキャピタル。リース・ファイナンス大手。航空機・インフラ・再生可能エネルギーに投資。",
  "5803": "フジクラ。電線・光ファイバーケーブル大手。AI向けデータセンター需要で急成長中。",
  "6976": "太陽誘電。セラミックコンデンサー大手。スマホ・EV・AI基板向けに需要拡大。",
  "285A": "キオクシア。NANDフラッシュメモリ大手。スマホ・SSD・データセンター向けに供給。",
  "6701": "NEC。ITシステム・ネットワーク・生体認証。政府・企業向けDXソリューションを展開。",
  "7011": "三菱重工業。防衛・航空・エネルギー。防衛費増額と脱炭素の恩恵を両方受ける大手。",
  "7013": "IHI。航空エンジン・防衛・橋梁。次世代戦闘機エンジン開発でも注目される重工業大手。",
  "186A": "アストロスケール。宇宙デブリ（ゴミ）除去ビジネスの先駆者。宇宙清掃衛星を開発。",
  "485A": "パワーエックス。蓄電池・EV充電インフラ。再生可能エネルギーの普及を支えるインフラ企業。",
  "5801": "古河電工。電線・光ファイバー・自動車部品。AIデータセンター向け光ケーブル需要で注目。",
  "4004": "レゾナック（旧昭和電工）。半導体材料・化学品大手。CMP研磨材・フォトレジストを供給。",
  "2036": "NN金ダブルブルETN。金価格の2倍の値動きを目指す国内上場証券（ETN）。レバレッジ型。",
  "1540": "純金上場信託。現物の金地金に裏付けられた国内ETF。実物ゴールドと同等の価値を持つ。",
  // レバレッジETF
  "SSO": "ProShares Ultra S&P500。S&P500の日次2倍の値動きを目指す米国レバレッジETF。",
  "QLD": "ProShares Ultra QQQ。Nasdaq100の日次2倍の値動きを目指す米国レバレッジETF。",
  "USD": "ProShares Ultra Semiconductors。半導体セクターの日次2倍連動を目指すレバレッジETF。",
  "ROM": "ProShares Ultra Technology。米テクノロジーセクターの日次2倍連動レバレッジETF。",
  "UGL": "ProShares Ultra Gold。金価格の日次2倍の値動きを目指す米国レバレッジETF。",
  "AGQ": "ProShares Ultra Silver。銀価格の日次2倍の値動きを目指す米国レバレッジETF。",
  "1570": "NEXT FUNDS 日経平均レバレッジ・インデックス連動型ETF。日経平均の約2倍の値動き。",
  "1358": "上場インデックスファンド日経レバレッジ2倍。日経平均の2倍を目指す国内レバレッジETF。",
  "SOXL": "Direxion Daily Semiconductor Bull 3X ETF。SOX半導体指数の3倍連動。高リスク高リターン。",
  "TECL": "Direxion Daily Technology Bull 3X ETF。テクノロジーセクターの3倍連動レバレッジETF。",
  "TQQQ": "ProShares UltraPro QQQ。Nasdaq100の3倍連動。米国で最も取引量の多いレバレッジETF。",
};

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
  const collapseAllRef = useRef<(() => void) | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  const toggleAllRef = useRef<((open: boolean) => void) | null>(null);

  const filteredAdd = ALL_SYMBOLS.filter(
    (s) =>
      s.toLowerCase().includes(addSearch.toLowerCase()) &&
      !watchlist.find((w) => w.symbol === s)
  );

  return (
    <div className={`w-full ${tab === "ai" ? "md:w-96" : "md:w-64"} bg-[#1e222d] md:border-l border-[#2a2e39] flex flex-col h-full transition-all duration-200`}>
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
            <div className="flex-1" />
            <span className="text-[10px] text-[#787b86] w-20 text-right">現在値</span>
            <span className="text-[10px] text-[#787b86] w-16 text-right">変動率</span>
            <button
              onClick={() => {
                const next = !allOpen;
                setAllOpen(next);
                toggleAllRef.current?.(next);
              }}
              className="ml-3 flex items-center gap-0.5 text-[10px] text-[#787b86] hover:text-blue-400 flex-shrink-0 border border-[#2a2e39] rounded px-1.5 py-0.5 hover:border-blue-400 transition-colors"
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {allOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                }
              </svg>
              {allOpen ? "全閉" : "全開"}
            </button>
          </div>

          {/* Watchlist items with groups */}
          <div className="flex-1 overflow-y-auto">
            <WatchlistWithGroups
              watchlist={watchlist}
              activeSymbol={activeSymbol}
              onSelectSymbol={onSelectSymbol}
              onRemoveSymbol={onRemoveSymbol}
              onReorder={(newList) => onReorder?.(newList)}
              collapseAllRef={collapseAllRef}
              toggleAllRef={toggleAllRef}
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
  watchlist, activeSymbol, onSelectSymbol, onRemoveSymbol, onReorder, collapseAllRef, toggleAllRef,
}: {
  watchlist: WatchItem[];
  activeSymbol: string;
  onSelectSymbol: (s: string) => void;
  onRemoveSymbol: (s: string) => void;
  onReorder: (newList: WatchItem[]) => void;
  collapseAllRef: React.MutableRefObject<(() => void) | null>;
  toggleAllRef: React.MutableRefObject<((open: boolean) => void) | null>;
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const groupNames = [...new Set(watchlist.filter(w => w.group).map(w => w.group!))];
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // 新しいグループは常に閉じた状態で追加
  const effectiveCollapsed: Record<string, boolean> = {};
  groupNames.forEach(g => { effectiveCollapsed[g] = collapsed[g] !== false; });

  collapseAllRef.current = () =>
    setCollapsed(Object.fromEntries(groupNames.map(g => [g, true])));
  toggleAllRef.current = (open: boolean) =>
    setCollapsed(Object.fromEntries(groupNames.map(g => [g, !open])));
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
    setCollapsed((prev) => ({ ...prev, [name]: !effectiveCollapsed[name] }));

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
              className={`w-3 h-3 text-[#787b86] transition-transform flex-shrink-0 ${effectiveCollapsed[groupName] ? "-rotate-90" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-[10px] text-[#787b86] uppercase tracking-wider font-medium">{groupName}</span>
            <span className="text-[10px] text-[#434651] ml-auto">{items.length}</span>
          </button>
          {!effectiveCollapsed[groupName] && items.map((item) => (
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
  const [showInfo, setShowInfo] = useState(false);
  const isUp = (item.changePct ?? 0) >= 0;
  const info = SYMBOL_INFO[item.symbol];
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

      {/* Info button */}
      {info && (
        <div className="relative flex-shrink-0 ml-1">
          <button
            onClick={(e) => { e.stopPropagation(); setShowInfo((v) => !v); }}
            className={`w-4 h-4 flex items-center justify-center rounded-full border text-[9px] font-bold transition-colors ${
              showInfo
                ? "bg-[#3b82f6] border-[#3b82f6] text-white"
                : "border-[#434651] text-[#434651] hover:border-[#787b86] hover:text-[#787b86]"
            }`}
          >
            i
          </button>
          {showInfo && (
            <div
              className="absolute right-0 top-6 z-50 w-56 p-3 rounded-lg bg-[#1e222d] border border-[#3b82f6]/40 shadow-xl text-[11px] text-[#c9d1d9] leading-relaxed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-bold text-[#3b82f6] mb-1">{item.symbol}</div>
              {JP_NAMES[item.symbol] && (
                <div className="text-[#787b86] text-[10px] mb-1.5">{JP_NAMES[item.symbol]}</div>
              )}
              {info}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
