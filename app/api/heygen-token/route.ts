export const runtime = "nodejs";

// LiveAvatar public avatars for InVentures
// Elenora Tech Expert: 8175dfc2-7858-49d6-b5fa-0c135d1c4bad
// Judy Lawyer:         6e32f90a-f566-45be-9ec7-a5f6999ee606
// June HR:             65f9e3c9-d48b-4118-b73a-4ae2e3cbb8f0
const AVATAR_ID = process.env.LIVEAVATAR_AVATAR_ID || "8175dfc2-7858-49d6-b5fa-0c135d1c4bad";

export async function POST() {
  const apiKey = process.env.LIVEAVATAR_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "LiveAvatar API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "LITE",
        avatar_id: AVATAR_ID,
      }),
    });

    const data = await res.json();

    if (data.code !== 1000) {
      const isConcurrency = (data.message || "").toLowerCase().includes("concurren");
      return new Response(JSON.stringify({
        error: isConcurrency
          ? "Session concurrency limit reached — retrying…"
          : (data.message || "LiveAvatar error"),
        concurrency: isConcurrency,
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      token: data.data.session_token,
      sessionId: data.data.session_id,
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://inventures.at",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to get LiveAvatar token" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
