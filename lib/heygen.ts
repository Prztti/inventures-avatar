export interface HeyGenConfig {
  apiKey: string;
  avatarId: string;
  voiceId?: string;
}

export function getHeyGenConfig(): HeyGenConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
  const avatarId = process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID;

  if (!apiKey || !avatarId) return null;

  return { apiKey, avatarId };
}

export function isHeyGenAvailable(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_HEYGEN_API_KEY &&
    process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID
  );
}
