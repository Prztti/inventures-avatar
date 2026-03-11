"use client";

import { useEffect, useRef, useState } from "react";

interface AvatarVideoProps {
  onReady?: () => void;
  onError?: (error: string) => void;
  pendingSpeak?: string;
  onSpeakComplete?: () => void;
}

export default function AvatarVideo({
  onReady,
  pendingSpeak,
  onSpeakComplete,
}: AvatarVideoProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Init — check support & signal ready
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    // Voices may load async
    const tryReady = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 || true) {
        onReady?.();
      }
    };
    window.speechSynthesis.onvoiceschanged = tryReady;
    tryReady();
  }, [onReady]);

  // Speak when new text arrives
  useEffect(() => {
    if (!pendingSpeak || !supported) {
      if (pendingSpeak) onSpeakComplete?.();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(pendingSpeak);
    utteranceRef.current = utter;

    // Pick best available voice — prefer high-quality English female
    const voices = window.speechSynthesis.getVoices();
    const preferred = [
      "Samantha", "Karen", "Moira",           // Safari/macOS high quality
      "Google UK English Female",              // Chrome
      "Microsoft Zira",                        // Windows
      "en-US",                                 // fallback language match
    ];
    let chosen: SpeechSynthesisVoice | null = null;
    for (const name of preferred) {
      const v = voices.find(
        (v) => v.name.includes(name) || v.lang.startsWith(name)
      );
      if (v) { chosen = v; break; }
    }
    if (!chosen) chosen = voices.find((v) => v.lang.startsWith("en")) ?? null;
    if (chosen) utter.voice = chosen;

    utter.rate = 0.95;
    utter.pitch = 1.05;
    utter.volume = 1;

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => {
      setSpeaking(false);
      onSpeakComplete?.();
    };
    utter.onerror = () => {
      setSpeaking(false);
      onSpeakComplete?.();
    };

    window.speechSynthesis.speak(utter);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [pendingSpeak, supported, onSpeakComplete]);

  // Animated avatar — pulsing when speaking
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] rounded-t-xl">
      {/* Avatar circle with speaking animation */}
      <div className="relative">
        {/* Outer pulse ring when speaking */}
        {speaking && (
          <>
            <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping scale-110" />
            <div className="absolute inset-0 rounded-full bg-gold/10 animate-ping scale-125" style={{ animationDelay: "0.2s" }} />
          </>
        )}
        {/* Avatar image */}
        <div
          className={`w-24 h-24 rounded-full border-2 overflow-hidden transition-all duration-300 ${
            speaking ? "border-gold shadow-lg shadow-gold/30" : "border-gold/40"
          }`}
        >
          {/* Professional portrait placeholder — replace with real photo if available */}
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
            <span className="text-gold font-semibold text-3xl select-none">IV</span>
          </div>
        </div>
      </div>

      {/* Speaking indicator */}
      <div className="mt-4 flex items-center gap-2 h-5">
        {speaking ? (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-gold animate-[soundwave_0.6s_ease-in-out_infinite]"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: `${8 + (i % 3) * 6}px`,
                }}
              />
            ))}
          </>
        ) : (
          <p className="text-gray-600 text-xs">
            {supported ? "Voice ready" : "Text mode"}
          </p>
        )}
      </div>
    </div>
  );
}
