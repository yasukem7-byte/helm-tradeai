"use client";

type Tab = "chart" | "watch" | "ai";

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: "chart",
    label: "チャート",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 17 9 11 13 15 21 7" />
        <line x1="3" y1="21" x2="21" y2="21" />
      </svg>
    ),
  },
  {
    key: "watch",
    label: "銘柄",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="3" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="3" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "ai",
    label: "AI相談",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 4-3 6-4 8H9c-1-2-4-4-4-8a7 7 0 0 1 7-7z" />
        <line x1="9" y1="21" x2="15" y2="21" />
        <line x1="10" y1="17" x2="14" y2="17" />
      </svg>
    ),
  },
];

export default function MobileTabBar({ active, onChange }: Props) {
  return (
    <div className="md:hidden flex-shrink-0 flex border-t border-[#2a2e39] bg-[#1e222d] pb-safe relative z-50">
      {TABS.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
            active === key ? "text-blue-400" : "text-[#787b86]"
          }`}
        >
          {icon}
          <span className="text-[10px]">{label}</span>
          {active === key && <div className="absolute bottom-0 h-0.5 w-10 bg-blue-400 rounded-t" />}
        </button>
      ))}
    </div>
  );
}
