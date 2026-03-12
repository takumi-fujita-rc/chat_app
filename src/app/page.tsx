"use client";

import { useState, useRef, useEffect } from "react";
import type { Message } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        signal: abortControllerRef.current.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "エラーが発生しました");
      }

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">AIチャット</h1>
          <p className="text-xs text-gray-400">Powered by OpenAI gpt-4o</p>
        </div>
        <button
          onClick={handleReset}
          disabled={messages.length === 0}
          className="text-xs text-gray-500 hover:text-red-500 disabled:opacity-30 transition-colors px-3 py-1 rounded-lg border border-gray-200 hover:border-red-200"
        >
          会話をリセット
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm">AIとの会話を始めましょう</p>
            <p className="text-xs mt-1">メッセージを入力して送信してください</p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && <LoadingIndicator />}

        {error && (
          <div className="flex justify-center mb-4">
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">
              ⚠️ {error}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <footer className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </footer>
    </div>
  );
}
