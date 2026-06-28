export default function AiToolsPage() {
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
          <a href="/web-trends" className="text-xs text-[#8b949e] hover:text-white transition-colors">Webトレンド</a>
          <a href="/ai-tools" className="text-xs text-[#26a69a] font-semibold">AI×コード</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#21262d]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#131722] to-[#0a1628] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
            AI×コード制作 トレンドレポート 2025
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-white">AIと</span>
            <span className="text-[#8b5cf6]">コード</span>
            <span className="text-white">の</span>
            <br />
            <span className="text-[#3b82f6]">現在地</span>
          </h1>
          <p className="text-[#8b949e] text-lg max-w-2xl mx-auto leading-relaxed">
            Claude Code・Codex・Obsidianなど、AIとコードツールの組み合わせが
            Web制作の現場をどう変えているか。客観的に整理します。
          </p>
        </div>
      </section>

      {/* What changed */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>何が変わったのか</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">コードを「書く」から「伝える」へ</h2>
          <p className="text-[#8b949e] mb-12">
            2024年以前は「コードが書けない＝Web制作できない」でした。
            AIの登場でこの常識が根本から変わりつつあります。
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[#161b22] border border-[#21262d]">
              <div className="text-xs text-[#8b949e] mb-3 font-semibold tracking-widest">2024年以前</div>
              <div className="space-y-3">
                {["デザイン → エンジニアに依頼 → 時間とコストがかかる", "コードの修正 → エンジニアに都度依頼", "アイデアを実現するまでに数週間", "技術的な制約でデザインを妥協"].map((t) => (
                  <div key={t} className="flex items-start gap-2 text-sm text-[#8b949e]">
                    <span className="text-[#ef4444] mt-0.5 flex-shrink-0">✕</span>{t}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-xl bg-[#161b22] border border-[#8b5cf6]/30]">
              <div className="text-xs text-[#8b5cf6] mb-3 font-semibold tracking-widest">2025年現在</div>
              <div className="space-y-3">
                {["デザインの意図を日本語で伝える → AIがコードを生成", "「ここをこう直して」で即修正", "アイデアを数時間で形にできる", "技術的な制約をAIが解決してくれる"].map((t) => (
                  <div key={t} className="flex items-start gap-2 text-sm text-[#8b949e]">
                    <span className="text-[#26a69a] mt-0.5 flex-shrink-0">✓</span>{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>主要AIツール</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">それぞれの役割と特徴</h2>
          <p className="text-[#8b949e] mb-12">
            ツールごとに得意な領域が異なります。組み合わせて使うのが現在のトレンドです。
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <ToolCard
              icon="🤖"
              name="Claude Code"
              maker="Anthropic"
              badge="コード生成・実装"
              badgeColor="purple"
              desc="自然な日本語でコードの生成・修正・デバッグができるAI。ファイルの読み書きからGitの操作まで、開発作業全体をサポート。デザイナーがエンジニアなしでWeb実装できる環境を実現。"
              strengths={["日本語での指示でコード生成", "ファイル・フォルダを直接操作", "エラーを自動で発見・修正", "Next.js・Vercelとの相性が抜群"]}
            />
            <ToolCard
              icon="⚡"
              name="Codex / ChatGPT"
              maker="OpenAI"
              badge="コード補完・質問"
              badgeColor="green"
              desc="OpenAIが提供するコード特化モデル。GitHub Copilotの基盤技術。コードの補完・説明・変換が得意。Claude Codeと並ぶ主要AIコーディングアシスタント。"
              strengths={["GitHub Copilotとして統合", "コードの説明・解説が得意", "多言語対応", "IDE（VS Code）との連携"]}
            />
            <ToolCard
              icon="🔮"
              name="Cursor"
              maker="Anysphere"
              badge="AIエディター"
              badgeColor="blue"
              desc="AIが組み込まれたコードエディター。VS Codeをベースに、AIとの対話でコードを書く新しいスタイルを実現。エンジニアの間で急速に普及している。"
              strengths={["AIと会話しながらコーディング", "コードベース全体を理解して提案", "Claude・GPT両方を利用可能", "VS Codeの操作感そのまま"]}
            />
            <ToolCard
              icon="📝"
              name="Obsidian"
              maker="Obsidian MD"
              badge="知識管理・メモ"
              badgeColor="yellow"
              desc="マークダウンベースのノートアプリ。AIとの連携プラグインで、蓄積した知識をAIに参照させながら作業できる。設計メモ・アイデア整理・クライアント情報管理に活用されている。"
              strengths={["ローカル保存でプライバシー安全", "AIプラグインで知識をRAG活用", "リンクで情報を網のように繋げる", "Vaultで案件ごとに管理"]}
            />
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>現在のトレンドワークフロー</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">ツールの組み合わせ方</h2>
          <p className="text-[#8b949e] mb-12">
            2025年現在、最も効率的とされているWeb制作の流れです。
          </p>

          <div className="space-y-3">
            {[
              { step: "1", icon: "🎨", tool: "Figma", role: "デザイン設計", desc: "ページ構成・ビジュアルデザインを作る。AIプラグインで素材生成も可能。", color: "#f59e0b" },
              { step: "2", icon: "📝", tool: "Obsidian", role: "情報・要件整理", desc: "クライアントの要件・コンテンツ・参考資料をVaultに整理。AIに渡す情報をまとめる。", color: "#8b5cf6" },
              { step: "3", icon: "🤖", tool: "Claude Code", role: "コード生成・実装", desc: "Figmaのデザインを見せて「このデザインをNext.jsで実装して」と指示。コードを自動生成。", color: "#26a69a" },
              { step: "4", icon: "🐙", tool: "GitHub", role: "コード保存・管理", desc: "生成されたコードを保存。変更履歴が残るので安心してやり直しができる。", color: "#3b82f6" },
              { step: "5", icon: "🚀", tool: "Vercel", role: "公開・配信", desc: "GitHubにpushすると自動でサイトが更新される。約90秒で世界中に公開。", color: "#ec4899" },
            ].map(({ step, icon, tool, role, desc, color }, i, arr) => (
              <div key={step}>
                <div className="flex gap-4 p-4 rounded-xl bg-[#161b22] border border-[#21262d]">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: color + "22", border: `2px solid ${color}55` }}
                  >
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold" style={{ color }}>{step}</span>
                      <span className="font-bold text-[#e6edf3]">{tool}</span>
                      <span className="text-xs text-[#8b949e] px-2 py-0.5 rounded-full bg-[#0d1117] border border-[#30363d]">{role}</span>
                    </div>
                    <p className="text-sm text-[#8b949e]">{desc}</p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex justify-center my-1 text-[#30363d]">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who benefits */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>誰が恩恵を受けるのか</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-12">職種別・AIツールの影響</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "🎨",
                role: "デザイナー",
                impact: "最も恩恵が大きい",
                color: "#26a69a",
                desc: "コードが書けなくてもWeb実装ができるようになった。デザインの意図をそのままコードに反映できる。",
                items: ["Figma → Next.jsの直接変換", "修正指示を日本語で出せる", "エンジニアへの依頼が不要に"],
              },
              {
                icon: "💼",
                role: "経営者・ディレクター",
                impact: "コスト削減の機会",
                color: "#3b82f6",
                desc: "制作コストと時間が大幅に削減。アイデアを素早く形にして検証できる。",
                items: ["制作期間が短縮される", "修正コストが下がる", "小規模なら内製化も可能"],
              },
              {
                icon: "⚙️",
                role: "エンジニア",
                impact: "生産性が向上",
                color: "#f59e0b",
                desc: "単純なコーディング作業はAIに任せ、設計・アーキテクチャなど高度な判断に集中できる。",
                items: ["定型コードはAIが生成", "レビュー・設計に集中できる", "より複雑な案件をこなせる"],
              },
            ].map(({ icon, role, impact, color, desc, items }) => (
              <div key={role} className="p-6 rounded-xl bg-[#161b22] border border-[#21262d]">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-bold text-[#e6edf3] mt-3 mb-1">{role}</h3>
                <div className="text-xs font-semibold mb-3" style={{ color }}>{impact}</div>
                <p className="text-xs text-[#8b949e] mb-4 leading-relaxed">{desc}</p>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-[#8b949e]">
                      <span style={{ color }} className="mt-0.5 flex-shrink-0">✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caution */}
      <section className="border-b border-[#21262d]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <SectionLabel>注意点</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-12">AIツールの限界と課題</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "⚠️", title: "コードの品質管理", desc: "AIが生成したコードは必ずしも最適とは限りません。動くが非効率なコードが生まれることも。定期的な見直しが必要です。" },
              { icon: "🔒", title: "セキュリティリスク", desc: "機密情報・クライアント情報をAIに入力することはリスクがあります。何をAIに渡すか判断が必要です。" },
              { icon: "📐", title: "微妙なデザイン表現", desc: "「もう少しこのニュアンスで」という微妙な調整はまだAIが苦手な領域。デザイナーの目での確認が必須です。" },
              { icon: "💡", title: "AIへの依存リスク", desc: "ツールが変わると作業フローが崩れるリスクがあります。特定のAIに過度に依存しない設計が重要です。" },
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

      {/* Summary */}
      <section>
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <SectionLabel>まとめ</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            <span className="text-white">AIは</span>
            <span className="text-[#8b5cf6]">道具</span>
            <span className="text-white">であり</span>
            <span className="text-[#3b82f6]">パートナー</span>
          </h2>
          <p className="text-[#8b949e] max-w-2xl mx-auto leading-relaxed mb-12">
            AIツールは制作の「手間」を減らしますが、「何を作るか」「どう見せるか」という
            判断はまだ人間にしかできません。AIを使いこなす人と使えない人の差は、今後さらに広がっていきます。
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { icon: "🤖", label: "Claude Code", use: "コード生成・実装・修正" },
              { icon: "📝", label: "Obsidian", use: "情報整理・知識管理" },
              { icon: "⚡", label: "Cursor / Codex", use: "コード補完・IDE連携" },
            ].map(({ icon, label, use }) => (
              <div key={label} className="p-4 rounded-xl bg-[#161b22] border border-[#21262d] flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="font-semibold text-sm text-[#e6edf3]">{label}</div>
                  <div className="text-xs text-[#8b949e]">{use}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-xs text-[#484f58]">
            AI×Code Trends Report 2025 · HELM.
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
  icon, name, maker, badge, badgeColor, desc, strengths,
}: {
  icon: string;
  name: string;
  maker: string;
  badge: string;
  badgeColor: "purple" | "green" | "blue" | "yellow";
  desc: string;
  strengths: string[];
}) {
  const colors = {
    purple: "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/30",
    green: "bg-[#26a69a]/10 text-[#26a69a] border-[#26a69a]/30",
    blue: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30",
    yellow: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30",
  };
  return (
    <div className="p-6 rounded-xl bg-[#161b22] border border-[#21262d] flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[badgeColor]}`}>{badge}</span>
      </div>
      <div className="mb-1">
        <span className="font-bold text-[#e6edf3]">{name}</span>
        <span className="text-xs text-[#484f58] ml-2">{maker}</span>
      </div>
      <p className="text-xs text-[#8b949e] mb-4 leading-relaxed flex-1">{desc}</p>
      <div className="space-y-1.5 pt-4 border-t border-[#21262d]">
        {strengths.map((s) => (
          <div key={s} className="flex items-start gap-2 text-xs text-[#8b949e]">
            <span className="text-[#26a69a] mt-0.5 flex-shrink-0">✓</span>{s}
          </div>
        ))}
      </div>
    </div>
  );
}
