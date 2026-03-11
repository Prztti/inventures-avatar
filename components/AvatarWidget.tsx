"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import ChatFallback from "./ChatFallback";

const AvatarVideo = dynamic(() => import("./AvatarVideo"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  ),
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_EN: Message = {
  role: "assistant",
  content:
    "Hello — I'm the InVentures AI assistant. I can explain our services, help you identify the right track (Tech & AI or Real Estate), and connect you with the team. What brings you here today?",
};

const WELCOME_DE: Message = {
  role: "assistant",
  content:
    "Guten Tag — ich bin der InVentures AI Assistent. Ich kann unsere Services erklären, Ihnen den richtigen Track (Tech & AI oder Real Estate) zeigen und Sie mit dem Team verbinden. Was führt Sie heute hierher?",
};

export default function AvatarWidget({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [language, setLanguage] = useState<"en" | "de">("en");
  const [messages, setMessages] = useState<Message[]>([WELCOME_EN]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureLoading, setLeadCaptureLoading] = useState(false);
  const [leadCaptureSuccess, setLeadCaptureSuccess] = useState(false);
  const [pendingSpeak, setPendingSpeak] = useState<string | undefined>();
  const [hasHeyGen] = useState(true); // LiveAvatar always available
  const [avatarStarted, setAvatarStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleLanguageToggle = useCallback(
    (lang: "en" | "de") => {
      if (lang === language) return;
      setLanguage(lang);
      setMessages([lang === "de" ? WELCOME_DE : WELCOME_EN]);
      setShowLeadCapture(false);
      setLeadCaptureSuccess(false);
    },
    [language]
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    abortRef.current?.abort();
  }, []);

  const checkLeadTrigger = (text: string): boolean => {
    const triggers = [
      "contact",
      "email",
      "get in touch",
      "reach out",
      "interested",
      "talk to",
      "meet",
      "schedule",
      "appointment",
      "kontakt",
      "e-mail",
      "mail",
      "sprechen",
      "termin",
      "meeting",
      "interessiert",
    ];
    const lower = text.toLowerCase();
    return triggers.some((t) => lower.includes(t));
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const historyForApi = messages.slice(-6); // last 3 pairs

    try {
      abortRef.current = new AbortController();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language,
          history: historyForApi,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error("Chat request failed");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantContent,
          };
          return updated;
        });
      }

      // Trigger HeyGen speech
      if (hasHeyGen && assistantContent) {
        setPendingSpeak(assistantContent);
      }

      // Check if we should show lead capture
      if (checkLeadTrigger(text) || checkLeadTrigger(assistantContent)) {
        setTimeout(() => setShowLeadCapture(true), 1000);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            language === "de"
              ? "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
              : "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, language, hasHeyGen]);

  const handleLeadCapture = useCallback(
    async (email: string) => {
      setLeadCaptureLoading(true);
      try {
        const lastUserMsg = messages
          .filter((m) => m.role === "user")
          .slice(-1)[0]?.content;

        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            message: lastUserMsg,
            language,
          }),
        });
        setLeadCaptureSuccess(true);
        setShowLeadCapture(false);
      } catch {
        // fail silently — success UX regardless
        setLeadCaptureSuccess(true);
        setShowLeadCapture(false);
      } finally {
        setLeadCaptureLoading(false);
      }
    },
    [messages, language]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-near-black border-2 border-gold/60 shadow-2xl shadow-gold/10 flex items-center justify-center group hover:border-gold transition-all duration-300 hover:scale-105"
          aria-label="Open InVentures Assistant"
        >
          <div className="absolute inset-0 rounded-full border-2 border-gold/30 animate-pulse" />
          <span className="text-gold font-semibold text-lg">IV</span>
          {/* Notification dot */}
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-gold rounded-full border-2 border-near-black" />
        </button>
      )}

      {/* Widget panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-panel-border bg-panel-bg flex flex-col animate-fade-in"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-panel-border bg-near-black flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <span className="text-gold text-xs font-semibold">IV</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium leading-tight">
                  InVentures Assistant
                </p>
                <p className="text-gray-500 text-[10px]">
                  {isLoading
                    ? language === "de"
                      ? "Tippt..."
                      : "Typing..."
                    : language === "de"
                    ? "Online"
                    : "Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <div className="flex rounded-lg overflow-hidden border border-panel-border">
                {(["en", "de"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                      language === lang
                        ? "bg-gold text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* Close button */}
              <button
                onClick={handleClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-panel-hover transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Avatar area — Web Speech API, no credits needed */}
          <div className="h-48 flex-shrink-0 border-b border-panel-border relative">
            <AvatarVideo
              pendingSpeak={pendingSpeak}
              onSpeakComplete={() => setPendingSpeak(undefined)}
            />
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <ChatFallback
              messages={messages}
              language={language}
              isLoading={isLoading}
              showLeadCapture={showLeadCapture}
              onLeadCapture={handleLeadCapture}
              leadCaptureLoading={leadCaptureLoading}
              leadCaptureSuccess={leadCaptureSuccess}
            />
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 border-t border-panel-border px-3 py-3 bg-near-black">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === "de"
                    ? "Stellen Sie eine Frage..."
                    : "Ask a question..."
                }
                disabled={isLoading}
                className="flex-1 bg-panel-bg border border-panel-border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-light transition-colors flex-shrink-0"
                aria-label="Send"
              >
                <svg
                  className="w-4 h-4 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 text-[10px] mt-2 text-center">
              Powered by InVentures AI · info@inventures.at
            </p>
          </div>
        </div>
      )}
    </>
  );
}
