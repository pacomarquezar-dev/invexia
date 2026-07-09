import type { Ref } from "react";
import type { StoredChatMessage } from "@/lib/chatHistoryStorage";

interface ChatMessageListProps {
  messages: StoredChatMessage[];
  lastMessageRef?: Ref<HTMLLIElement>;
}

export default function ChatMessageList({ messages, lastMessageRef }: ChatMessageListProps) {
  return (
    <ol className="flex flex-col gap-3">
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        const isLast = index === messages.length - 1;

        return (
          <li
            key={index}
            ref={isLast ? lastMessageRef : undefined}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                isUser
                  ? "bg-surface text-foreground"
                  : "border border-accent-secondary/30 bg-accent-secondary/10 text-foreground"
              }`}
            >
              <span className="sr-only">{isUser ? "Tú: " : "Asistente: "}</span>
              {message.content}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
