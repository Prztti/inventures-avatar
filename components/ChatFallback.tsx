"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatFallbackProps {
  messages: Message[];
  onNewMessage?: (message: Message) => void;
  language: "en" | "de";
  isLoading?: boolean;
  showLeadCapture?: boolean;
  onLeadCapture?: (email: string) => void;
  leadCaptureLoading?: boolean;
  leadCaptureSuccess?: boolean;
}

export default function ChatFallback({
  messages,
  onNewMessage,
  language,
  isLoading = false,
  showLeadCapture = false,
  onLeadCapture,
  leadCaptureLoading = false,
  leadCaptureSuccess = false,
}: ChatFallbackProps) {
  const [email, setEmail] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const placeholder =
    language === "de"
      ? "Ihre E-Mail-Adresse"
      : "Your email address";

  const submitLabel =
    language === "de" ? "Absenden" : "Submit";

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLeadCapture?.(email.trim());
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              {language === "de"
                ? "Wie kann ich Ihnen helfen?"
                : "How can I help you today?"}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <span className="text-gold text-[9px] font-semibold">IV</span>
              </div>
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gold/20 text-white rounded-tr-sm"
                  : "bg-panel-hover text-gray-200 rounded-tl-sm border border-panel-border"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
              <span className="text-gold text-[9px] font-semibold">IV</span>
            </div>
            <div className="bg-panel-hover border border-panel-border px-3 py-2 rounded-xl rounded-tl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {showLeadCapture && !leadCaptureSuccess && (
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-3 mt-2">
            <p className="text-gray-300 text-xs mb-2">
              {language === "de"
                ? "Ihre E-Mail-Adresse für einen Rückruf:"
                : "Your email for a callback:"}
            </p>
            <form onSubmit={handleLeadSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-panel-bg border border-panel-border rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={leadCaptureLoading || !email.trim()}
                className="px-3 py-1.5 bg-gold text-black text-sm font-medium rounded-lg hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {leadCaptureLoading ? "..." : submitLabel}
              </button>
            </form>
          </div>
        )}

        {leadCaptureSuccess && (
          <div className="bg-green-950/30 border border-green-800/30 rounded-xl p-3 text-green-400 text-xs text-center">
            {language === "de"
              ? "Vielen Dank! Wir melden uns innerhalb von 24 Stunden."
              : "Thank you! We'll reach out within 24 hours."}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
