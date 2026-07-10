"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
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

const SCROLL_BOTTOM_THRESHOLD_PX = 24;

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9.5L5 19.5V16H6.5A2.5 2.5 0 0 1 4 13.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLLIElement>(null);
  const wasAtBottomRef = useRef(true);
  const prevHistoryLengthRef = useRef(history.length);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Sigue la posición real de scroll del usuario, para saber (antes de que
  // llegue un mensaje nuevo) si estaba al final de la conversación o si
  // había subido a leer algo anterior.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    function updateWasAtBottom() {
      if (!container) return;
      wasAtBottomRef.current =
        container.scrollHeight - container.scrollTop - container.clientHeight <=
        SCROLL_BOTTOM_THRESHOLD_PX;
    }

    updateWasAtBottom();
    container.addEventListener("scroll", updateWasAtBottom);
    return () => container.removeEventListener("scroll", updateWasAtBottom);
  }, [isOpen]);

  // Al llegar un mensaje nuevo: si el usuario ya estaba al final, lleva el
  // scroll al PRINCIPIO de ese mensaje nuevo (no al final absoluto). Si
  // había subido a leer algo anterior, no le interrumpimos.
  useEffect(() => {
    const isNewMessage = history.length > prevHistoryLengthRef.current;
    prevHistoryLengthRef.current = history.length;

    if (isNewMessage && wasAtBottomRef.current) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      lastMessageRef.current?.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [history]);

  // Al abrir el chat, salta directamente al final de la conversación.
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      wasAtBottomRef.current = true;
    }
  }, [isOpen]);

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
          className="mb-3 flex h-[70vh] max-h-[32rem] w-[calc(100vw-2rem)] flex-col rounded-3xl border border-border bg-background shadow-xl sm:w-96"
        >
          <div className="flex items-center justify-between gap-2 rounded-t-3xl border-b border-border bg-accent-secondary/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <ChatBubbleIcon className="h-4 w-4 shrink-0 text-accent-secondary" />
              <h2 id={headingId} className="text-sm font-semibold text-foreground">
                Asistente educativo de Invexia
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md px-2 py-1 text-sm text-muted hover:text-foreground"
            >
              <span aria-hidden="true">✕</span>
              <span className="sr-only">Cerrar chat</span>
            </button>
          </div>

          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-3">
            <ChatMessageList
              messages={[WELCOME_MESSAGE, ...history]}
              lastMessageRef={lastMessageRef}
            />
            {isSending && (
              <div className="mt-3 flex justify-start" aria-hidden="true">
                <div className="flex max-w-[85%] flex-col gap-2 rounded-2xl border border-accent-secondary/30 bg-accent-secondary/10 px-3 py-2.5">
                  <div className="animate-skeleton h-3 w-40 rounded-full" />
                  <div className="animate-skeleton h-3 w-24 rounded-full" />
                </div>
              </div>
            )}
          </div>

          <div aria-live="polite" className="px-4 text-xs text-muted empty:hidden">
            {isSending ? "El asistente está escribiendo…" : statusMessage}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-border p-3">
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
                className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:border-accent-secondary"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="rounded-xl bg-accent-secondary px-3 py-2 text-sm font-medium text-background transition duration-150 ease-out hover:scale-[1.04] hover:opacity-90 disabled:opacity-50 disabled:hover:scale-100"
              >
                Enviar
              </button>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="self-start text-xs text-muted hover:text-foreground hover:underline"
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
        className={`flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-accent-secondary-light/40 bg-accent-secondary/70 text-background shadow-[0_0_20px_2px_rgba(155,123,250,0.4)] backdrop-blur-md transition-transform hover:scale-105 ${
          isOpen ? "" : "animate-chat-pulse"
        }`}
      >
        {isOpen ? (
          <span aria-hidden="true" className="text-xl">✕</span>
        ) : (
          <Sparkles aria-hidden="true" className="h-8 w-8" />
        )}
        <span className="sr-only">{isOpen ? "Cerrar chat educativo" : "Abrir chat educativo"}</span>
      </button>
    </div>
  );
}
