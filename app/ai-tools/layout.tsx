import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI×コード制作の現在地 2025",
  description: "Claude Code・Codex・Obsidianなど、AIとコードツールの最新トレンドをわかりやすく解説。",
  icons: {
    icon: "/icon.svg",
  },
};

export default function AiToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
