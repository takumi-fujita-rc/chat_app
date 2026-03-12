import type { Message } from "@/types/chat";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? "text-blue-100" : "text-gray-400"}`}>
          {message.createdAt.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
