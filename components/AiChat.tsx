"use client";

import { useState, useRef, useEffect } from "react";
import { Indicators } from "@/app/page";

type ImageContent = { type: "image"; data: string; mediaType: string };
type Message = { role: "user" | "assistant"; content: string; image?: ImageContent };
type Thread = { id: string; createdAt: number; title: string; messages: Message[] };

type Props = {
  apiKey: string;
  symbol: string;
  interval: string;
  indicators: Indicators;
  screenshotImage?: string | null;
  onScreenshotConsumed?: () => void;
  onTakeScreenshot?: () => void;
};

const WELCOME = (symbol: string, interval: string) =>
  `こんにちは！投資アドバイザーAIです。\n現在 **${symbol}** の${interval}チャートを表示中です。\nチャート画像を貼り付けて分析を依頼することもできます。`;

const threadKey = (symbol: string) => `chat_threads_${symbol}`;
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

const loadThreads = (symbol: string, interval: string): Thread[] => {
  try {
    const raw = localStorage.getItem(threadKey(symbol));
    if (raw) {
      const threads = JSON.parse(raw) as Thread[];
      if (threads.length > 0) return threads;
    }
  } catch { /* ignore */ }
  return [{ id: genId(), createdAt: Date.now(), title: "新しい相談", messages: [{ role: "assistant", content: WELCOME(symbol, interval) }] }];
};

const saveThreads = (symbol: string, threads: Thread[]) => {
  try {
    const toSave = threads.map(t => ({
      ...t,
      messages: t.messages.map(m => ({ ...m, image: undefined })),
    }));
    localStorage.setItem(threadKey(symbol), JSON.stringify(toSave));
  } catch { /* ignore */ }
};

const formatDate = (ts: number) => {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
};

export default function AiChat({ apiKey, symbol, interval, indicators, screenshotImage, onScreenshotConsumed, onTakeScreenshot }: Props) {
  const [threads, setThreads] = useState<Thread[]>(() => loadThreads(symbol, interval));
  const [activeId, setActiveId] = useState<string>(() => loadThreads(symbol, interval)[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<ImageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingQuickRef = useRef<string | null>(null);
  const currentSymbol = useRef(symbol);

  const activeThread = threads.find(t => t.id === activeId) ?? threads[0];
  const messages = activeThread?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 銘柄切替
  useEffect(() => {
    if (currentSymbol.current !== symbol) {
      currentSymbol.current = symbol;
      const loaded = loadThreads(symbol, interval);
      setThreads(loaded);
      setActiveId(loaded[0]?.id ?? "");
    }
  }, [symbol, interval]);

  // 保存
  useEffect(() => {
    if (threads.length > 0) saveThreads(symbol, threads);
  }, [threads, symbol]);

  const updateMessages = (id: string, msgs: Message[]) => {
    setThreads(prev => prev.map(t => {
      if (t.id !== id) return t;
      // タイトルは最初のユーザーメッセージから生成
      const firstUser = msgs.find(m => m.role === "user");
      const title = firstUser ? firstUser.content.slice(0, 20) + (firstUser.content.length > 20 ? "…" : "") : t.title;
      return { ...t, messages: msgs, title };
    }));
  };

  const newThread = () => {
    const t: Thread = {
      id: genId(),
      createdAt: Date.now(),
      title: "新しい相談",
      messages: [{ role: "assistant", content: WELCOME(symbol, interval) }],
    };
    setThreads(prev => [t, ...prev]);
    setActiveId(t.id);
    setInput("");
    setPendingImage(null);
  };

  const deleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => {
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0) {
        const t: Thread = { id: genId(), createdAt: Date.now(), title: "新しい相談", messages: [{ role: "assistant", content: WELCOME(symbol, interval) }] };
        setActiveId(t.id);
        return [t];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  useEffect(() => {
    if (screenshotImage) {
      const img: ImageContent = { type: "image", data: screenshotImage, mediaType: "image/png" };
      setPendingImage(img);
      onScreenshotConsumed?.();
      if (pendingQuickRef.current) {
        const question = pendingQuickRef.current;
        pendingQuickRef.current = null;
        setInput(question);
        setTimeout(() => sendWithContext(question, img), 50);
      }
    }
  }, [screenshotImage]);

  const handlePaste = (e: React.ClipboardEvent) => {
    for (const item of Array.from(e.clipboardData.items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) readImageFile(file);
        break;
      }
    }
  };

  const readImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const [header, data] = result.split(",");
      const mediaType = header.match(/:(.*?);/)?.[1] || "image/png";
      setPendingImage({ type: "image", data, mediaType });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readImageFile(file);
    e.target.value = "";
  };

  const sendWithContext = async (overrideText?: string, overrideImage?: ImageContent) => {
    const text = overrideText ?? input;
    const image = overrideImage ?? pendingImage;
    if ((!text.trim() && !image) || !apiKey || loading || !activeThread) return;

    const activeIndicators = Object.entries(indicators).filter(([, v]) => v).map(([k]) => k).join(", ");
    const systemPrompt = `あなたは経験豊富な投資アドバイザーAIです。
現在のチャート情報:
- 銘柄: ${symbol}
- 時間足: ${interval}
- 表示中のインジケーター: ${activeIndicators || "なし"}

ユーザーがチャート画像を添付した場合は、チャートパターン・トレンド・サポート/レジスタンス・インジケーターの状態を詳しく分析してください。
注意: 投資判断は最終的にはユーザー自身が行うものです。アドバイスは参考情報として提供してください。
日本語で回答してください。`;

    const userMessage: Message = {
      role: "user",
      content: text || (image ? "このチャートを分析してください。" : ""),
      image: image ?? undefined,
    };

    const newMessages = [...messages, userMessage];
    updateMessages(activeThread.id, newMessages);
    setInput("");
    setPendingImage(null);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => {
        if (m.image) return { role: m.role, content: [{ type: "image", source: { type: "base64", media_type: m.image.mediaType, data: m.image.data } }, { type: "text", text: m.content }] };
        return { role: m.role, content: m.content };
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, messages: apiMessages, system: systemPrompt }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "エラーが発生しました");
      }

      const data = await response.json();
      updateMessages(activeThread.id, [...newMessages, { role: "assistant", content: data.content }]);
    } catch (e) {
      updateMessages(activeThread.id, [...newMessages, { role: "assistant", content: `エラー: ${e instanceof Error ? e.message : "不明なエラー"}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex h-full bg-[#1e222d] relative transition-colors ${dragging ? "bg-blue-900/30" : ""}`}
      onPaste={handlePaste}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = Array.from(e.dataTransfer.files).find(f => f.type.startsWith("image/")); if (f) readImageFile(f); }}
    >
      {dragging && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded pointer-events-none">
          <span className="text-3xl">🖼</span>
          <span className="text-blue-300 text-sm mt-2">ここにドロップ</span>
        </div>
      )}

      {!apiKey && (
        <div className="flex-1 flex flex-col items-center justify-center text-[#787b86] text-xs p-4 text-center gap-2">
          <span className="text-2xl">🤖</span>
          <p>Claude APIキーを設定するとAI投資相談が使えます</p>
          <p className="text-[10px] text-[#434651]">⚙ ボタンから設定できます</p>
        </div>
      )}

      {apiKey && (
        <>
          {/* ── スレッドサイドバー ── */}
          {sidebarOpen && (
            <div className="w-24 flex-shrink-0 flex flex-col border-r border-[#2a2e39] bg-[#161b27]">
              {/* 新規ボタン */}
              <button
                onClick={newThread}
                className="flex items-center justify-center gap-1 py-2.5 px-1 text-[10px] text-blue-400 hover:bg-[#1e2535] border-b border-[#2a2e39] transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                新規相談
              </button>
              {/* スレッド一覧 */}
              <div className="flex-1 overflow-y-auto">
                {threads.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className={`group relative px-2 py-2.5 cursor-pointer border-b border-[#2a2e39] transition-colors ${
                      t.id === activeId ? "bg-[#2a2e39]" : "hover:bg-[#1e2535]"
                    }`}
                  >
                    <div className={`text-[10px] font-medium leading-tight truncate ${t.id === activeId ? "text-blue-400" : "text-[#787b86]"}`}>
                      {t.title}
                    </div>
                    <div className="text-[9px] text-[#434651] mt-0.5">{formatDate(t.createdAt)}</div>
                    {/* 削除ボタン */}
                    <button
                      onClick={(e) => deleteThread(t.id, e)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-[#434651] hover:text-red-400 transition-opacity"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── チャットエリア ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* チャットヘッダー */}
            <div className="flex items-center gap-2 px-2 py-1.5 border-b border-[#2a2e39]">
              <button
                onClick={() => setSidebarOpen(v => !v)}
                className="p-1 text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded transition-colors flex-shrink-0"
                title="スレッド一覧"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="text-[10px] text-[#787b86] truncate flex-1">{activeThread?.title ?? ""}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] rounded-lg px-3 py-2 text-xs whitespace-pre-wrap leading-relaxed ${
                    m.role === "user" ? "bg-blue-600 text-white" : "bg-[#2a2e39] text-[#d1d4dc]"
                  }`}>
                    {m.image && <img src={`data:${m.image.mediaType};base64,${m.image.data}`} alt="添付画像" className="rounded mb-2 max-w-full" />}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#2a2e39] rounded-lg px-3 py-2 text-xs text-[#787b86] flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {pendingImage && (
              <div className="px-2 pt-2 border-t border-[#2a2e39]">
                <div className="relative inline-block">
                  <img src={`data:${pendingImage.mediaType};base64,${pendingImage.data}`} alt="添付予定" className="h-16 rounded border border-[#2a2e39]" />
                  <button onClick={() => setPendingImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">✕</button>
                </div>
              </div>
            )}

            {/* クイック質問 */}
            <div className="px-2 py-1 flex gap-1 flex-wrap border-t border-[#2a2e39]">
              {["今の相場どう思う？", "買いサイン？", "リスクは？", "このチャート分析して"].map(s => (
                <button key={s} onClick={() => { pendingQuickRef.current = s; onTakeScreenshot?.(); }}
                  className="text-[10px] bg-[#2a2e39] hover:bg-[#363a45] text-[#787b86] hover:text-[#d1d4dc] rounded px-2 py-1 transition-colors">
                  {s}
                </button>
              ))}
            </div>

            {/* 入力エリア */}
            <div className="p-2 border-t border-[#2a2e39] flex gap-1.5 items-center">
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={onTakeScreenshot} className="p-1.5 text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded transition-colors" title="チャートをキャプチャ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded transition-colors" title="画像を添付">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendWithContext(); }}
                placeholder={"質問を入力...\nCmd+Enter→送信"}
                className="flex-1 bg-[#131722] border border-[#2a2e39] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-[#434651] resize-none"
                rows={3}
              />
              <button
                onClick={() => sendWithContext()}
                disabled={(!input.trim() && !pendingImage) || loading}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded text-xs transition-colors"
              >
                ↑
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
