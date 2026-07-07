"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  clearChatHistory,
  loadChatHistory,
  saveChatHistory,
  type StoredChatMessage,
} from "@/lib/chatHistoryStorage";
import { useSuggestedInvestorProfile } from "@/lib/useSuggestedInvestorProfile";
import ChatMessageList from "./ChatMessageList";

const WELCOME_MESSAGE: StoredChatMessage = {
  role: "assistant",
  content:
    "¡Hola! Soy el asistente educativo de Invexia. Puedo explicarte conceptos financieros y ayudarte a encontrar la calculadora que necesitas. Esto es contenido educativo, no asesoramiento financiero regulado.",
};

/**
 * Solo se monta en cliente (ver ChatWidgetLoader, que usa next/dynamic con
 * ssr:false), así que leer localStorage de forma síncrona aquí es seguro.
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<StoredChatMessage[]>(() => loadChatHistory());
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const investorProfile = useSuggestedInvestorProfile();

  const headingId = useId();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [history, isOpen]);

  function handleToggle() {
    setIsOpen((open) => !open);
  }

  function handleClose() {
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  }

  function handleReset() {
    clearChatHistory();
    setHistory([]);
    setStatusMessage(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextHistory: StoredChatMessage[] = [...history, { role: "user", content: trimmed }];
    setHistory(nextHistory);
    saveChatHistory(nextHistory);
    setInput("");
    setStatusMessage(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory,
          investorProfile,
        }),
      });

      const data = (await response.json()) as { reply?: string; message?: string };

      if (!response.ok) {
        setStatusMessage(data.message ?? "Ha ocurrido un error. Inténtalo de nuevo.");
        return;
      }

      const updatedHistory: StoredChatMessage[] = [
        ...nextHistory,
        { role: "assistant", content: data.reply ?? "" },
      ];
      setHistory(updatedHistory);
      saveChatHistory(updatedHistory);
    } catch {
      setStatusMessage("No se ha podido conectar con el asistente. Comprueba tu conexión e inténtalo de nuevo.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby={headingId}
          className="mb-3 flex h-[70vh] max-h-[32rem] w-[calc(100vw-2rem)] flex-col rounded-lg border border-foreground/20 bg-background shadow-xl sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
            <h2 id={headingId} className="text-sm font-semibold">
              Asistente educativo de Invexia
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md px-2 py-1 text-sm text-foreground/60 hover:text-foreground"
            >
              <span aria-hidden="true">✕</span>
              <span className="sr-only">Cerrar chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <ChatMessageList messages={[WELCOME_MESSAGE, ...history]} />
            <div ref={messagesEndRef} />
          </div>

          <div aria-live="polite" className="px-4 text-xs text-foreground/70 empty:hidden">
            {isSending ? "El asistente está escribiendo…" : statusMessage}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-foreground/10 p-3">
            <label htmlFor={`${headingId}-input`} className="sr-only">
              Escribe tu mensaje
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id={`${headingId}-input`}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Pregúntame sobre finanzas personales…"
                className="flex-1 rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="self-start text-xs text-foreground/50 hover:text-foreground/80 hover:underline"
              >
                Borrar conversación
              </button>
            )}
          </form>
        </div>
      )}

      <button
        ref={toggleButtonRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
      >
        <span aria-hidden="true">{isOpen ? "✕" : "💬"}</span>
        <span className="sr-only">{isOpen ? "Cerrar chat educativo" : "Abrir chat educativo"}</span>
      </button>
    </div>
  );
}
