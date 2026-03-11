"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";

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
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
  const avatarId = process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID;

  const initAvatar = useCallback(async () => {
    if (!apiKey || !avatarId) {
      setStatus("error");
      setErrorMsg("HeyGen credentials not configured");
      return;
    }

    setStatus("loading");

    try {
      const avatar = new StreamingAvatar({ token: apiKey });
      avatarRef.current = avatar;

      avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
        // Avatar started speaking
      });

      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        onSpeakComplete?.();
      });

      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        if (videoRef.current && event.detail) {
          videoRef.current.srcObject = event.detail as MediaStream;
          videoRef.current.play().catch(console.error);
        }
        setStatus("ready");
        onReady?.();
      });

      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        setStatus("error");
        setErrorMsg("Stream disconnected");
        onError?.("Stream disconnected");
      });

      await avatar.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: avatarId,
        voice: {
          voiceId: "en-US-EmmaNeural",
          emotion: VoiceEmotion.FRIENDLY,
        },
        language: "en",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to initialize avatar";
      setStatus("error");
      setErrorMsg(message);
      onError?.(message);
    }
  }, [apiKey, avatarId, onReady, onError, onSpeakComplete]);

  useEffect(() => {
    initAvatar();

    return () => {
      avatarRef.current?.stopAvatar().catch(console.error);
    };
  }, [initAvatar]);

  useEffect(() => {
    if (!pendingSpeak || status !== "ready" || !avatarRef.current) return;

    avatarRef.current
      .speak({
        text: pendingSpeak,
        taskType: TaskType.REPEAT,
      })
      .catch(console.error);
  }, [pendingSpeak, status]);

  if (!apiKey || !avatarId || status === "error") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#111] rounded-t-xl">
        <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mb-4">
          <span className="text-gold font-semibold text-2xl">IV</span>
        </div>
        <p className="text-gray-500 text-xs text-center px-4">
          {errorMsg || "InVentures AI Assistant"}
        </p>
        {errorMsg && (
          <p className="text-gray-600 text-xs mt-1 text-center px-4">
            Text mode active
          </p>
        )}
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
