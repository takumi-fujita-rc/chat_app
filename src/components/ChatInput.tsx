"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text || disabled) return;
    onSend(text);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="メッセージを入力... (Enterで送信、Shift+Enterで改行)"
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none max-h-32 overflow-y-auto"
        style={{ height: "auto" }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
      >
        送信
      </button>
    </div>
  );
}
