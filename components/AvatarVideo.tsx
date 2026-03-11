"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { LiveAvatarSession, SessionEvent } from "@heygen/liveavatar-web-sdk";

interface AvatarVideoProps {
  onReady?: () => void;
  onError?: (error: string) => void;
  pendingSpeak?: string;
  onSpeakComplete?: () => void;
}

export default function AvatarVideo({
  onReady,
  onError,
  pendingSpeak,
  onSpeakComplete,
}: AvatarVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const initAvatar = useCallback(async () => {
    setStatus("loading");

    try {
      // Get session token from backend
      const tokenRes = await fetch("https://inventures-avatar.vercel.app/api/heygen-token", {
        method: "POST",
      });
      const tokenData = await tokenRes.json();

      if (!tokenData.token) {
        throw new Error(tokenData.error || "No token received");
      }

      // Initialize LiveAvatar session
      const session = new LiveAvatarSession(tokenData.token);
      sessionRef.current = session;

      // Stream ready — attach to video element via SDK method
      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        if (videoRef.current) {
          session.attach(videoRef.current);
        }
        setStatus("ready");
        onReady?.();
      });

      session.on(SessionEvent.SESSION_DISCONNECTED, () => {
        setStatus("error");
        setErrorMsg("Session disconnected");
        onError?.("Session disconnected");
      });

      // Start the session
      await session.start();

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to initialize avatar";
      setStatus("error");
      setErrorMsg(message);
      onError?.(message);
    }
  }, [onReady, onError]);

  useEffect(() => {
    initAvatar();
    return () => {
      sessionRef.current?.stop().catch(console.error);
    };
  }, [initAvatar]);

  // Speak when new text arrives
  useEffect(() => {
    if (!pendingSpeak || status !== "ready" || !sessionRef.current) return;
    try {
      sessionRef.current.message(pendingSpeak);
    } catch (e) {
      console.error(e);
    } finally {
      onSpeakComplete?.();
    }
  }, [pendingSpeak, status]);

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#111] rounded-t-xl">
        <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mb-4">
          <span className="text-gold font-semibold text-2xl">IV</span>
        </div>
        <p className="text-gray-500 text-xs text-center px-4">{errorMsg || "Text mode active"}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] rounded-t-xl overflow-hidden">
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mb-4">
            <span className="text-gold font-semibold text-2xl">IV</span>
          </div>
          <div className="flex gap-1 mt-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-3">Connecting to avatar…</p>
        </div>
      )}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        playsInline
        muted={false}
      />
    </div>
  );
}
