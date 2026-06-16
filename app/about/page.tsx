"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#21262d]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#131722] to-[#0a1628] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6] text-xs mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
            HELM.TradeAI — システム解説
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-white">AIと</span>
            <span className="text-[#26a69a]">リアルタイムデータ</span>
            <span className="text-white">で</span>
            <br />
            <span className="text-[#3b82f6]">投資判断</span>
            <span className="text-white">を加速する</span>
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto leading-relaxed">
            株・コモディティ・為替・仮想通貨のチャートを一画面に集約し、
            Claude AIが投資相談に即答するWebアプリケーション。
            ゼロコストのインフラで世界中どこからでもアクセス可能。
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <a href="/" className="px-6 py-3 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold transition-colors text-sm">
              アプリを開く →
            </a>
            <a href="#architecture" className="px-6 py-3 rounded-lg border border-[#30363d] hover:border-[#8b949e] text-[#8b949e] hover:text-white font-semibold transition-colors text-sm">
              仕組みを見る ↓
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "60+", label: "監視銘柄数" },
            { num: "12", label: "テクニカル指標" },
            { num: "¥0", label: "サーバー費用/月" },
            { num: "∞", label: "スケール上限" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-[#3b82f6]">{num}</div>
              <div className="text-[#8b949e] text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Flow */}
      <section id="architecture" className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>データフロー</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">どこからデータを取得しているか</h2>
          <p className="text-[#8b949e] mb-12">複数の無料・低コストAPIを組み合わせて全資産クラスをカバー</p>

          <div className="grid md:grid-cols-3 gap-4">
            <DataCard
              icon="📡"
              title="Twelve Data API"
              badge="メイン"
              badgeColor="blue"
              items={[
                "米国株（NVDA, TSLA など）",
                "日本株（7011, 8306 など）",
                "為替（USD/JPY, EUR/USD）",
                "仮想通貨（BTC, ETH）",
                "コモディティ（XAU/USD, XAG）",
                "1分〜月足の時系列OHLCV",
              ]}
              note="月5,000リクエスト無料枠"
            />
            <DataCard
              icon="📈"
              title="Yahoo Finance"
              badge="フォールバック"
              badgeColor="green"
              items={[
                "S&P 500（^GSPC）",
                "Nasdaq 100（^IXIC）",
                "Dow Jones（^DJI）",
                "日経平均（^N225）",
                "VIX 恐怖指数（^VIX）",
                "Twelve Dataにない銘柄を補完",
              ]}
              note="APIキー不要・完全無料"
            />
            <DataCard
              icon="🏦"
              title="FRED（米連邦準備制度）"
              badge="経済指標"
              badgeColor="yellow"
              items={[
                "10年-2年債利回りスプレッド",
                "逆イールドカーブの可視化",
                "景気後退シグナルの把握",
                "CSVを直接取得・変換",
                "APIキー不要・完全無料",
              ]}
              note="米セントルイス連銀が公開"
            />
          </div>

          {/* Flow diagram */}
          <div className="mt-10 p-6 rounded-xl bg-[#161b22] border border-[#21262d]">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-center">
              {["Twelve Data\nAPI", "Yahoo Finance\n(無料)", "FRED\n(米連邦準備制度)"].map((src, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="px-3 py-2 rounded-lg bg-[#0d1117] border border-[#30363d] text-[#8b949e] whitespace-pre-line leading-tight text-xs">
                    {src}
                  </div>
                  <span className="text-[#30363d]">→</span>
                </div>
              ))}
              <div className="px-3 py-2 rounded-lg bg-[#1e2535] border border-[#3b82f6]/40 text-[#3b82f6] text-xs font-semibold">
                Next.js API Route<br/>(サーバーサイド)
              </div>
              <span className="text-[#30363d]">→</span>
              <div className="px-3 py-2 rounded-lg bg-[#1a2e1a] border border-[#26a69a]/40 text-[#26a69a] text-xs font-semibold">
                ブラウザ<br/>lightweight-charts
              </div>
            </div>
            <p className="text-[#8b949e] text-xs text-center mt-4">
              APIキーはサーバーサイドで管理するため、ブラウザには一切露出しない安全設計
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>技術スタック</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">使用技術一覧</h2>
          <p className="text-[#8b949e] mb-12">モダンなWebスタックで高速・軽量・保守性の高い設計</p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                category: "フロントエンド",
                icon: "⚛️",
                techs: [
                  { name: "Next.js 16 (App Router)", desc: "React フレームワーク。サーバー/クライアント両対応" },
                  { name: "TypeScript", desc: "型安全な開発。バグを事前に検出" },
                  { name: "Tailwind CSS", desc: "ユーティリティCSS。デザインを高速実装" },
                  { name: "lightweight-charts", desc: "TradingViewと同じエンジン。高性能チャート描画" },
                ],
              },
              {
                category: "バックエンド / API",
                icon: "🖥️",
                techs: [
                  { name: "Next.js API Routes", desc: "サーバーレス関数。別途サーバー不要" },
                  { name: "Claude API (Anthropic)", desc: "AI投資相談エンジン。claude-sonnet-4モデル使用" },
                  { name: "FRED CSV API", desc: "経済指標をCSV直取得。APIキー不要" },
                  { name: "Yahoo Finance スクレイピング", desc: "指数データのフォールバック取得" },
                ],
              },
              {
                category: "インフラ / デプロイ",
                icon: "☁️",
                techs: [
                  { name: "Vercel", desc: "GitHubプッシュで自動デプロイ。無料枠で運用可能" },
                  { name: "GitHub", desc: "ソースコード管理。pushするだけでWeb反映" },
                  { name: "CDN（Vercel Edge Network）", desc: "全世界のエッジサーバーから配信。超高速" },
                  { name: "PWA対応", desc: "スマホのホーム画面にアプリとして追加可能" },
                ],
              },
              {
                category: "データ保存",
                icon: "💾",
                techs: [
                  { name: "localStorage（ブラウザ）", desc: "ウォッチリスト・AI会話履歴をユーザー端末に保存" },
                  { name: "URLパラメータ", desc: "チャート状態をURLで共有可能" },
                  { name: "サーバーDB なし", desc: "個人情報を一切サーバーに保存しない設計" },
                  { name: "APIキーはローカル管理", desc: "ユーザーが自身のAPIキーを使用。課金も自己管理" },
                ],
              },
            ].map(({ category, icon, techs }) => (
              <div key={category} className="p-6 rounded-xl bg-[#161b22] border border-[#21262d]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{icon}</span>
                  <h3 className="font-bold text-[#e6edf3]">{category}</h3>
                </div>
                <div className="space-y-3">
                  {techs.map(({ name, desc }) => (
                    <div key={name}>
                      <div className="text-sm font-semibold text-[#e6edf3]">{name}</div>
                      <div className="text-xs text-[#8b949e] mt-0.5">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Flow */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>デプロイフロー</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">コードの変更がWebに反映されるまで</h2>
          <p className="text-[#8b949e] mb-12">GitHubへのプッシュから約90秒で世界中に公開される</p>

          <div className="flex flex-col md:flex-row gap-0">
            {[
              {
                step: "1",
                title: "コードを編集",
                desc: "Claude Codeでコード修正。TypeScriptで型チェック済み",
                icon: "✏️",
                color: "#3b82f6",
              },
              {
                step: "2",
                title: "git push",
                desc: "GitHubリポジトリへプッシュ。1コマンドで完了",
                icon: "📤",
                color: "#8b5cf6",
              },
              {
                step: "3",
                title: "Vercel 自動検知",
                desc: "GitHub連携でpushを検知。ビルドを自動開始",
                icon: "⚡",
                color: "#f59e0b",
              },
              {
                step: "4",
                title: "ビルド & デプロイ",
                desc: "Next.jsアプリをビルド。エッジCDNへ自動配信",
                icon: "🚀",
                color: "#26a69a",
              },
              {
                step: "5",
                title: "全世界に公開",
                desc: "世界中のユーザーがhttpsでアクセス可能に",
                icon: "🌏",
                color: "#ec4899",
              },
            ].map(({ step, title, desc, icon, color }, i, arr) => (
              <div key={step} className="flex md:flex-col flex-1 items-start md:items-center">
                <div className="flex md:flex-col items-center md:items-center gap-3 md:gap-0 flex-1">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: color + "22", border: `2px solid ${color}55` }}
                  >
                    {icon}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="md:hidden w-px h-6 bg-[#30363d] mx-6" />
                  )}
                  <div className="md:mt-3 md:text-center flex-1">
                    <div className="text-xs font-bold mb-1" style={{ color }}>{step}</div>
                    <div className="font-semibold text-sm text-[#e6edf3]">{title}</div>
                    <div className="text-xs text-[#8b949e] mt-1 md:max-w-[120px]">{desc}</div>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:block text-[#30363d] text-2xl mx-2 mt-[-24px]">→</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-xl bg-[#161b22] border border-[#21262d] flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="text-3xl">⏱️</div>
            <div>
              <div className="font-bold text-[#e6edf3]">push から公開まで 約90秒</div>
              <div className="text-sm text-[#8b949e] mt-1">
                Vercelの無料プランでも本番環境が即座に更新される。専用サーバーの管理・SSH・Docker一切不要。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>コスト構造</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">月額運用コスト</h2>
          <p className="text-[#8b949e] mb-12">インフラはほぼ無料。コストはAI利用分のみ</p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                service: "Vercel",
                cost: "¥0",
                desc: "Webホスティング・CDN・SSL証明書すべて無料",
                detail: "商用利用も無料枠あり。月100GBまで転送無料",
                color: "#26a69a",
              },
              {
                service: "GitHub",
                cost: "¥0",
                desc: "ソースコード管理・CI/CD連携",
                detail: "パブリック/プライベートリポジトリ無料",
                color: "#3b82f6",
              },
              {
                service: "Claude API",
                cost: "従量課金",
                desc: "AI投資相談の利用分のみ課金",
                detail: "1回の相談 約$0.01〜0.05（~1〜7円）\nユーザーが自分のAPIキーを使用",
                color: "#8b5cf6",
              },
            ].map(({ service, cost, desc, detail, color }) => (
              <div key={service} className="p-6 rounded-xl bg-[#161b22] border border-[#21262d]">
                <div className="text-sm text-[#8b949e] mb-1">{service}</div>
                <div className="text-3xl font-black mb-3" style={{ color }}>{cost}</div>
                <div className="text-sm font-semibold text-[#e6edf3] mb-2">{desc}</div>
                <div className="text-xs text-[#8b949e] whitespace-pre-line">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>セキュリティ設計</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">個人情報を持たない設計</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              { icon: "🔐", title: "APIキーはローカル保存", desc: "ClaudeのAPIキーはユーザーのブラウザにのみ保存。サーバーには送信・記録しない" },
              { icon: "🗄️", title: "サーバーDBなし", desc: "会話履歴・ウォッチリストはブラウザのlocalStorageに保存。個人情報サーバー管理ゼロ" },
              { icon: "🔒", title: "HTTPS強制", desc: "Vercelが自動でSSL/TLS証明書を発行。全通信が暗号化" },
              { icon: "👤", title: "ログイン不要", desc: "アカウント作成・個人情報入力なしで即利用可能。プライバシーリスク最小化" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl bg-[#161b22] border border-[#21262d]">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-semibold text-[#e6edf3] mb-1">{title}</div>
                  <div className="text-sm text-[#8b949e]">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="text-[#3b82f6]">HELM.TradeAI</span> を試す
          </h2>
          <p className="text-[#8b949e] mb-8 max-w-xl mx-auto">
            Claude APIキーを用意するだけで、すぐに使い始められます。
            登録不要・月額固定費ゼロ。
          </p>
          <a href="/" className="inline-block px-8 py-4 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-lg transition-colors">
            アプリを開く →
          </a>
          <div className="mt-6 text-xs text-[#484f58]">
            Built with Next.js · Deployed on Vercel · Powered by Claude AI
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#30363d] text-[#8b949e] text-xs mb-3">
      {children}
    </div>
  );
}

function DataCard({
  icon, title, badge, badgeColor, items, note,
}: {
  icon: string;
  title: string;
  badge: string;
  badgeColor: "blue" | "green" | "yellow";
  items: string[];
  note: string;
}) {
  const colors = {
    blue: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30",
    green: "bg-[#26a69a]/10 text-[#26a69a] border-[#26a69a]/30",
    yellow: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30",
  };
  return (
    <div className="p-6 rounded-xl bg-[#161b22] border border-[#21262d] flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[badgeColor]}`}>{badge}</span>
      </div>
      <h3 className="font-bold text-[#e6edf3] mb-3">{title}</h3>
      <ul className="space-y-1.5 flex-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-[#8b949e]">
            <span className="text-[#26a69a] mt-0.5 flex-shrink-0">✓</span>
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-[#21262d] text-xs text-[#484f58]">{note}</div>
    </div>
  );
}
