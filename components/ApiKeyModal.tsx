"use client";

import { useState } from "react";

type Props = {
  onSave: (claude: string, twelve: string) => void;
  onClose: () => void;
};

export default function ApiKeyModal({ onSave, onClose }: Props) {
  const [claude, setClaude] = useState(
    typeof window !== "undefined" ? localStorage.getItem("claude_api_key") || "" : ""
  );
  const [twelve, setTwelve] = useState(
    typeof window !== "undefined" ? localStorage.getItem("twelve_data_key") || "" : ""
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-white text-xl font-bold mb-1">APIキー設定</h2>
        <p className="text-gray-400 text-sm mb-4">
          各自のAPIキーを使用します。キーはこのブラウザにのみ保存されます。
        </p>

        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-1">
            Claude APIキー（AI相談用）
          </label>
          <input
            type="password"
            value={claude}
            onChange={(e) => setClaude(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full bg-[#0f0f0f] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <p className="text-gray-500 text-xs mt-1">
            取得先: console.anthropic.com
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-1">
            Twelve Data APIキー（チャートデータ用）
            <span className="text-gray-500 ml-1">※任意</span>
          </label>
          <input
            type="password"
            value={twelve}
            onChange={(e) => setTwelve(e.target.value)}
            placeholder="your_twelve_data_key（省略可）"
            className="w-full bg-[#0f0f0f] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <p className="text-gray-500 text-xs mt-1">
            取得先: twelvedata.com（無料プランあり）。未入力でもチャートは表示されます。
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSave(claude, twelve)}
            disabled={!claude}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded py-2 text-sm font-medium"
          >
            保存して開始
          </button>
          <button
            onClick={onClose}
            className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded py-2 text-sm"
          >
            後で
          </button>
        </div>
      </div>
    </div>
  );
}
