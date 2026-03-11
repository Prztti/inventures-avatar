export const runtime = "nodejs";

export async function POST() {
  const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "HeyGen API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: `HeyGen error: ${err}` }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    // HeyGen returns { data: { token: "..." } }
    const token = data?.data?.token;

    return new Response(JSON.stringify({ token }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://inventures.at",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to get HeyGen token" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
