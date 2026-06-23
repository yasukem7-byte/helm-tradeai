import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web制作の現在地 2025",
  description: "ノーコード・WordPress・Next.jsの客観的な比較ガイド。",
  icons: {
    icon: "/icon.svg",
  },
};

export default function WebTrendsPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">

      {/* Nav */}
      <nav className="border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
          <a href="/" className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-xs font-bold">H</div>
            <span className="text-[#d1d4dc] font-semibold text-sm">HELM.</span>
          </a>
          <div className="w-px h-4 bg-[#21262d]" />
          <a href="/about" className="text-xs text-[#8b949e] hover:text-white transition-colors">システム解説</a>
          <a href="/web-trends" className="text-xs text-[#26a69a] font-semibold">Webトレンド</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#21262d]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#131722] to-[#0a1628] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#26a69a]/40 bg-[#26a69a]/10 text-[#26a69a] text-xs mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#26a69a] animate-pulse" />
            Web制作 トレンドレポート 2025
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-white">Web制作の</span>
            <span className="text-[#3b82f6]">現在地</span>
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto leading-relaxed">
            ノーコードツール・WordPress・Next.js——それぞれの特性を整理し、
            プロジェクトに最適な選択肢を判断するための客観的なガイド。
          </p>
        </div>
      </section>

      {/* 3 options overview */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>制作手法の選択肢</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">3つのアプローチ</h2>
          <p className="text-[#8b949e] mb-12">
            「どれが正解」ではなく、目的・予算・運用体制に合わせた選択が重要です。
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <ToolCard
              icon="🎨"
              title="ノーコードツール"
              subtitle="Studio / Webflow など"
              badge="スピード重視"
              badgeColor="green"
              pros={["コード不要で直感的に制作", "デザインの自由度が高い", "立ち上げが速い", "クライアントが自分で更新しやすい"]}
              cons={["複雑な機能には限界がある", "表示速度が遅くなりやすい", "プラットフォームへの依存リスク", "継続コストがかかる"]}
            />
            <ToolCard
              icon="📝"
              title="WordPress"
              subtitle="世界シェア43%"
              badge="実績・安定"
              badgeColor="yellow"
              pros={["膨大なプラグイン資産", "ブログ・メディアに最適", "エンジニア確保がしやすい", "クライアントが更新しやすい"]}
              cons={["定期的なセキュリティ更新が必要", "表示速度の最適化に工数", "設計が古くなりつつある", "攻撃対象になりやすい"]}
            />
            <ToolCard
              icon="⚡"
              title="Next.js + Vercel"
              subtitle="モダンWebスタンダード"
              badge="パフォーマンス重視"
              badgeColor="blue"
              pros={["表示速度が圧倒的に速い（SEO有利）", "制限なく何でも作れる", "サーバー費用を低コストに抑えられる", "AIツールとの相性が抜群"]}
              cons={["エンジニアの知識が必要", "デザイン実装にコーディングが必要", "トラブル時の自己解決が必要", "初期学習コストがある"]}
            />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>比較表</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-12">6つの観点で比較</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#21262d]">
                  <th className="text-left py-3 pr-6 text-[#8b949e] font-medium">観点</th>
                  <th className="text-center py-3 px-4 text-[#26a69a] font-bold">ノーコード</th>
                  <th className="text-center py-3 px-4 text-[#f59e0b] font-bold">WordPress</th>
                  <th className="text-center py-3 px-4 text-[#3b82f6] font-bold">Next.js</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "制作速度", nc: "◎", wp: "○", nx: "△" },
                  { label: "デザイン自由度", nc: "○", wp: "○", nx: "◎" },
                  { label: "表示速度・SEO", nc: "△", wp: "△", nx: "◎" },
                  { label: "コンテンツ更新", nc: "◎", wp: "◎", nx: "○" },
                  { label: "月額運用コスト", nc: "中", wp: "中", nx: "低〜中" },
                  { label: "将来性", nc: "△", wp: "○", nx: "◎" },
                ].map(({ label, nc, wp, nx }) => (
                  <tr key={label} className="border-b border-[#21262d]">
                    <td className="py-4 pr-6 text-[#e6edf3]">{label}</td>
                    <td className="py-4 px-4 text-center text-[#26a69a]">{nc}</td>
                    <td className="py-4 px-4 text-center text-[#f59e0b]">{wp}</td>
                    <td className="py-4 px-4 text-center text-[#3b82f6]">{nx}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ecosystem diagram */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>新トレンドの仕組み</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Next.js エコシステムの役割分担</h2>
          <p className="text-[#8b949e] mb-12">
            Next.js・GitHub・Vercelはそれぞれ異なる役割を持ち、連携して動作します。
          </p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="p-1 rounded-xl bg-[#161b22] border border-[#21262d]">
              <div className="text-xs text-[#8b949e] px-4 pt-3 pb-1 font-semibold tracking-widest">STEP 1 — 制作・デザイン</div>
              <div className="grid md:grid-cols-3 gap-2 p-2">
                {[
                  { icon: "🎨", name: "Figma", desc: "デザインの設計図を作る" },
                  { icon: "🤖", name: "Claude Code / AI", desc: "デザインをコードに変換する" },
                  { icon: "⚡", name: "Next.js", desc: "Webアプリの本体（コードの集まり）" },
                ].map(({ icon, name, desc }) => (
                  <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="font-semibold text-sm text-[#e6edf3]">{name}</div>
                      <div className="text-xs text-[#8b949e]">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center text-[#30363d] text-2xl">↓</div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
              <div className="text-xs text-[#8b949e] mb-2 font-semibold tracking-widest">STEP 2 — コード管理・バックアップ</div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                <span className="text-3xl">🐙</span>
                <div>
                  <div className="font-bold text-[#e6edf3]">GitHub</div>
                  <div className="text-sm text-[#8b949e]">コードの保存・バージョン管理・バックアップ。変更履歴がすべて残る</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-2">
              <div className="text-[#3b82f6] text-2xl">↓</div>
              <span className="text-xs text-[#3b82f6] font-semibold">pushで自動デプロイ（約90秒）</span>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-[#1e2535] border border-[#3b82f6]/30">
              <div className="text-xs text-[#3b82f6] mb-2 font-semibold tracking-widest">STEP 3 — 公開・配信</div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-[#0d1117] border border-[#3b82f6]/20">
                <span className="text-3xl">🚀</span>
                <div>
                  <div className="font-bold text-[#e6edf3]">Vercel</div>
                  <div className="text-sm text-[#8b949e]">世界中に高速配信・SSL証明書自動発行・サーバー管理不要。GitHubへのpushを検知して自動で公開</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center text-[#30363d] text-2xl">↓</div>

            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#161b22] border border-[#21262d] text-[#e6edf3] text-sm font-semibold">
                🌍　インターネット公開
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Headless CMS */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>コンテンツ管理の新標準</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Headless CMS とは</h2>
          <p className="text-[#8b949e] mb-12">
            コンテンツ管理と表示デザインを分離する新しい仕組み。
            WordPressの「自分で更新できる」利点を保ちながら、デザインの自由度を最大化できます。
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-xl bg-[#161b22] border border-[#21262d]">
              <div className="text-xs text-[#8b949e] mb-3 font-semibold tracking-widest">従来型（WordPress）</div>
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-center text-sm text-[#e6edf3]">
                  コンテンツ管理
                </div>
                <div className="text-center text-[#484f58] text-xs">一体型（分離不可）</div>
                <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-center text-sm text-[#e6edf3]">
                  デザイン・表示
                </div>
              </div>
              <p className="text-xs text-[#8b949e] mt-4">デザインを変えるとCMS側にも影響が出ることがある</p>
            </div>

            <div className="p-6 rounded-xl bg-[#161b22] border border-[#26a69a]/30]">
              <div className="text-xs text-[#26a69a] mb-3 font-semibold tracking-widest">Headless CMS + Next.js</div>
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-lg bg-[#0d1117] border border-[#26a69a]/30 text-center text-sm text-[#26a69a]">
                  Headless CMS（記事管理）
                </div>
                <div className="text-center text-[#3b82f6] text-xs font-semibold">↕ API連携（完全分離）</div>
                <div className="p-3 rounded-lg bg-[#0d1117] border border-[#3b82f6]/30 text-center text-sm text-[#3b82f6]">
                  Next.js（デザイン・表示）
                </div>
              </div>
              <p className="text-xs text-[#8b949e] mt-4">クライアントは使い慣れた管理画面で更新。デザインは完全自由</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: "🇯🇵", name: "MicroCMS", desc: "国産・日本語サポート充実。シンプルで使いやすい" },
              { icon: "🇯🇵", name: "Newt", desc: "国産・日本語対応が良い。Next.jsとの相性が良い" },
              { icon: "🌐", name: "Contentful", desc: "世界標準の高機能CMS。大規模サイトに向く" },
              { icon: "🌐", name: "Sanity", desc: "カスタマイズ性が高い。エンジニア向け" },
            ].map(({ icon, name, desc }) => (
              <div key={name} className="flex items-center gap-3 p-4 rounded-xl bg-[#161b22] border border-[#21262d]">
                <span className="text-xl">{icon}</span>
                <div>
                  <div className="font-semibold text-sm text-[#e6edf3]">{name}</div>
                  <div className="text-xs text-[#8b949e]">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>セキュリティの違い</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">なぜ静的サイトは安全なのか</h2>
          <p className="text-[#8b949e] mb-12">
            攻撃の入口の数がセキュリティリスクを左右します。
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[#161b22] border border-[#21262d]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">⚠️</span>
                <h3 className="font-bold text-[#e6edf3]">WordPressの構造</h3>
              </div>
              <div className="space-y-2 text-sm text-[#8b949e]">
                <div className="flex items-start gap-2">
                  <span className="text-[#ef4444] mt-0.5">✕</span>
                  <span>PHPがリクエストのたびに実行される</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ef4444] mt-0.5">✕</span>
                  <span>データベースに常時接続している</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ef4444] mt-0.5">✕</span>
                  <span>プラグインの脆弱性が攻撃対象になる</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ef4444] mt-0.5">✕</span>
                  <span>定期的なアップデートが必須</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#161b22] border border-[#26a69a]/30]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🔐</span>
                <h3 className="font-bold text-[#e6edf3]">Next.js静的サイトの構造</h3>
              </div>
              <div className="space-y-2 text-sm text-[#8b949e]">
                <div className="flex items-start gap-2">
                  <span className="text-[#26a69a] mt-0.5">✓</span>
                  <span>HTMLファイルをそのまま配信するだけ</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#26a69a] mt-0.5">✓</span>
                  <span>データベースが存在しない</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#26a69a] mt-0.5">✓</span>
                  <span>PHPが動いていない</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#26a69a] mt-0.5">✓</span>
                  <span>Vercelがセキュリティ管理を肩代わり</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section>
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <SectionLabel>まとめ</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black mb-8">
            <span className="text-white">正解は</span>
            <span className="text-[#3b82f6]">目的によって異なる</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-4 text-left mb-12">
            {[
              { icon: "⚡", title: "スピード・コスト重視", desc: "ノーコードツール（Studio・Webflow）が最適。小〜中規模サイト、クライアント自身が更新する案件に向く。", color: "#26a69a" },
              { icon: "📝", title: "実績・安定性重視", desc: "WordPressは世界シェア43%の実績。ブログ・メディア・情報量の多いコーポレートサイトに向く。", color: "#f59e0b" },
              { icon: "🚀", title: "パフォーマンス・将来性重視", desc: "Next.js + Vercelは表示速度・SEO・拡張性で優位。長期運用・高機能なWebアプリに向く。", color: "#3b82f6" },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className="p-6 rounded-xl bg-[#161b22] border border-[#21262d]">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-bold text-[#e6edf3] mt-3 mb-2" style={{ color }}>{title}</h3>
                <p className="text-sm text-[#8b949e] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-xs text-[#484f58]">
            Web Trends Report 2025 · HELM.TradeAI
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

function ToolCard({
  icon, title, subtitle, badge, badgeColor, pros, cons,
}: {
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: "blue" | "green" | "yellow";
  pros: string[];
  cons: string[];
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
      <h3 className="font-bold text-[#e6edf3] mb-1">{title}</h3>
      <div className="text-xs text-[#8b949e] mb-4">{subtitle}</div>
      <div className="space-y-1.5 flex-1">
        {pros.map((p) => (
          <div key={p} className="flex items-start gap-2 text-xs text-[#8b949e]">
            <span className="text-[#26a69a] flex-shrink-0 mt-0.5">＋</span>{p}
          </div>
        ))}
        {cons.map((c) => (
          <div key={c} className="flex items-start gap-2 text-xs text-[#8b949e]">
            <span className="text-[#ef4444] flex-shrink-0 mt-0.5">－</span>{c}
          </div>
        ))}
      </div>
    </div>
  );
}
