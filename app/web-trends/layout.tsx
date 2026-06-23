import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web制作の現在地 2025",
  description: "ノーコード・WordPress・Next.jsの客観的な比較ガイド。",
  icons: {
    icon: "/icon.svg",
  },
};

export default function WebTrendsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
