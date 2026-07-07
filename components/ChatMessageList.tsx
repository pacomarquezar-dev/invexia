import type { StoredChatMessage } from "@/lib/chatHistoryStorage";

interface ChatMessageListProps {
  messages: StoredChatMessage[];
}

export default function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
    <ol className="flex flex-col gap-3">
      {messages.map((message, index) => (
        <li
          key={index}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <p
            className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
              message.role === "user"
                ? "bg-foreground text-background"
                : "bg-foreground/10 text-foreground"
            }`}
          >
            <span className="sr-only">{message.role === "user" ? "Tú: " : "Asistente: "}</span>
            {message.content}
          </p>
        </li>
      ))}
    </ol>
  );
}
