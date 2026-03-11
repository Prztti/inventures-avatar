import { Resend } from "resend";
import { retrieveRelevantChunks, formatContext } from "@/lib/rag";
import { SYSTEM_PROMPT_EN, SYSTEM_PROMPT_DE } from "@/lib/system-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

// Direct fetch to OpenAI — avoids SDK connection issues on Vercel
async function callOpenAI(messages: Array<{role: string; content: string}>, tools?: unknown[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      tools: tools || undefined,
      tool_choice: tools ? "auto" : undefined,
      temperature: 0.4,
      max_tokens: 500,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Function definition — LLM calls this when it has name + email + inquiry
const LEAD_TOOL = {
  type: "function",
  function: {
    name: "send_lead_email",
    description:
      "Call this when the user has provided their name, email address, and a brief description of their inquiry. Send the lead to the InVentures team.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Full name of the prospect" },
        email: {
          type: "string",
          description: "Validated email address of the prospect",
        },
        inquiry: {
          type: "string",
          description:
            "Short summary of the prospect's challenge or interest (1–2 sentences)",
        },
      },
      required: ["name", "email", "inquiry"],
    },
  },
};

async function sendLeadEmail(
  name: string,
  email: string,
  inquiry: string,
  language: string
) {
  const resendKey = process.env.RESEND_API_KEY;
  const leadEmail = process.env.LEAD_EMAIL || "info@inventures.at";
  if (!resendKey) return;

  const resend = new Resend(resendKey);
  await resend.emails.send({
    from: "InVentures Avatar <noreply@inventures.at>",
    to: leadEmail,
    subject: `New Lead from inventures.at — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#c9a84c">New Lead — InVentures Avatar</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold">Inquiry</td><td style="padding:8px">${inquiry}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold">Language</td><td style="padding:8px">${language.toUpperCase()}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Source</td><td style="padding:8px">inventures.at avatar widget</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:24px">Sent automatically — respond within 24h</p>
      </div>
    `,
  });
}

export async function POST(req: Request) {
  try {
    const { message, language = "en", history = [] } = (await req.json()) as {
      message: string;
      language: "en" | "de";
      history: Message[];
    };

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const relevantChunks = retrieveRelevantChunks(message, 3);
    const context = formatContext(relevantChunks);
    const systemPrompt = language === "de" ? SYSTEM_PROMPT_DE : SYSTEM_PROMPT_EN;

    const systemWithContext = `${systemPrompt}

---
KNOWLEDGE BASE CONTEXT:
${context}
---`;

    const messages = [
      { role: "system", content: systemWithContext },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // First pass — check for function call
    const response = await callOpenAI(messages, [LEAD_TOOL]);

    const choice = response.choices[0];

    // Handle function call (lead capture)
    if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
      const toolCall = choice.message.tool_calls[0];
      if (toolCall.function.name === "send_lead_email") {
        const args = JSON.parse(toolCall.function.arguments) as {
          name: string;
          email: string;
          inquiry: string;
        };

        await sendLeadEmail(args.name, args.email, args.inquiry, language);

        const confirmMsg =
          language === "de"
            ? `Vielen Dank, ${args.name}! Ich habe deine Nachricht an das InVentures-Team weitergeleitet. Du erhältst innerhalb von 24 Stunden eine Antwort an ${args.email}.`
            : `Thank you, ${args.name}! I've forwarded your details to the InVentures team. You'll hear back within 24 hours at ${args.email}.`;

        return new Response(confirmMsg, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    }

    // Normal streaming response
    const text = choice.message.content ?? "";
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Chat API error:", msg);
    // Return error details to help debug
    return new Response(JSON.stringify({ error: "Internal server error", detail: msg, hasKey: !!process.env.OPENAI_API_KEY }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
// Wed Mar 11 21:26:09 CET 2026
