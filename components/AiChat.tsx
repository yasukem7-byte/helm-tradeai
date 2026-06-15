"use client";

import { useState, useRef, useEffect } from "react";
import { Indicators } from "@/app/page";

type ImageContent = { type: "image"; data: string; mediaType: string };
type Message = {
  role: "user" | "assistant";
  content: string;
  image?: ImageContent;
};

type Props = {
  apiKey: string;
  symbol: string;
  interval: string;
  indicators: Indicators;
  screenshotImage?: string | null;
  onScreenshotConsumed?: () => void;
  onTakeScreenshot?: () => void;
};

export default function AiChat({ apiKey, symbol, interval, indicators, screenshotImage, onScreenshotConsumed, onTakeScreenshot }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `こんにちは！投資アドバイザーAIです。\n現在 **${symbol}** の${interval}チャートを表示中です。\nチャート画像を貼り付けて分析を依頼することもできます。`,
    },
  ]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<ImageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `こんにちは！投資アドバイザーAIです。\n現在 **${symbol}** の${interval}チャートを表示中です。\nチャート画像を貼り付けて分析を依頼することもできます。`,
      },
    ]);
  }, [symbol, interval]);

  useEffect(() => {
    if (screenshotImage) {
      setPendingImage({ type: "image", data: screenshotImage, mediaType: "image/png" });
      onScreenshotConsumed?.();
    }
  }, [screenshotImage]);

  // Paste image from clipboard
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of Array.from(items)) {
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
      // result = "data:image/png;base64,XXXX"
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"));
    if (file) readImageFile(file);
  };

  const send = async () => {
    if ((!input.trim() && !pendingImage) || !apiKey || loading) return;

    const activeIndicators = Object.entries(indicators)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", ");

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
      content: input || (pendingImage ? "このチャートを分析してください。" : ""),
      image: pendingImage ?? undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPendingImage(null);
    setLoading(true);

    try {
      // Build messages for API — support image content blocks
      const apiMessages = [...messages, userMessage].map((m) => {
        if (m.image) {
          return {
            role: m.role,
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: m.image.mediaType, data: m.image.data },
              },
              { type: "text", text: m.content },
            ],
          };
        }
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
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `エラー: ${e instanceof Error ? e.message : "不明なエラー"}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-[#1e222d] relative transition-colors ${dragging ? "bg-blue-900/30" : ""}`}
      onPaste={handlePaste}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
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
          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-xs whitespace-pre-wrap leading-relaxed ${
                    m.role === "user" ? "bg-blue-600 text-white" : "bg-[#2a2e39] text-[#d1d4dc]"
                  }`}
                >
                  {m.image && (
                    <img
                      src={`data:${m.image.mediaType};base64,${m.image.data}`}
                      alt="添付画像"
                      className="rounded mb-2 max-w-full"
                    />
                  )}
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2e39] rounded-lg px-3 py-2 text-xs text-[#787b86] flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{animationDelay:"0.1s"}}>●</span>
                  <span className="animate-bounce" style={{animationDelay:"0.2s"}}>●</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Pending image preview */}
          {pendingImage && (
            <div className="px-2 pt-2 border-t border-[#2a2e39]">
              <div className="relative inline-block">
                <img
                  src={`data:${pendingImage.mediaType};base64,${pendingImage.data}`}
                  alt="添付予定"
                  className="h-20 rounded border border-[#2a2e39]"
                />
                <button
                  onClick={() => setPendingImage(null)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Quick suggestions */}
          <div className="px-2 py-1.5 flex gap-1 flex-wrap border-t border-[#2a2e39]">
            {["今の相場どう思う？", "買いサイン？", "リスクは？", "このチャート分析して"].map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-[10px] bg-[#2a2e39] hover:bg-[#363a45] text-[#787b86] hover:text-[#d1d4dc] rounded px-2 py-1 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-[#2a2e39] flex gap-1.5 items-center">
            {/* Screenshot button */}
            <button
              onClick={onTakeScreenshot}
              className="p-1.5 text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#2a2e39] rounded transition-colors flex-shrink-0"
              title="チャートをキャプチャしてAIに送る"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
              }}
              placeholder={"質問を入力...\nEnter→改行  Command+Enter→送信"}
              className="flex-1 bg-[#131722] border border-[#2a2e39] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-[#434651] resize-none"
              rows={3}
            />
            <button
              onClick={send}
              disabled={(!input.trim() && !pendingImage) || loading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded text-xs transition-colors"
            >
              ↑
            </button>
          </div>
        </>
      )}
    </div>
  );
}
