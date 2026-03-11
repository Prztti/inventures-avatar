import { Resend } from "resend";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_TEMPLATES = {
  en: {
    subject: "New Lead from InVentures Avatar Widget",
    body: (email: string, message?: string) =>
      [
        "New lead captured via the InVentures AI Avatar Widget.",
        "",
        `Email: ${email}`,
        message ? `Message: ${message}` : "",
        "",
        "Respond within 24 hours as promised.",
      ]
        .filter((l) => l !== undefined)
        .join("\n")
        .trim(),
    confirmation: (email: string) =>
      [
        "Thank you for your interest in InVentures.",
        "",
        `We have received your contact details (${email}) and will reach out within 24 hours to schedule an initial non-binding conversation.`,
        "",
        "Best regards,",
        "InVentures Team",
      ].join("\n"),
  },
  de: {
    subject: "Neue Kontaktanfrage über InVentures Avatar Widget",
    body: (email: string, message?: string) =>
      [
        "Neue Kontaktanfrage über das InVentures AI Avatar Widget.",
        "",
        `E-Mail: ${email}`,
        message ? `Nachricht: ${message}` : "",
        "",
        "Bitte innerhalb von 24 Stunden antworten.",
      ]
        .filter((l) => l !== undefined)
        .join("\n")
        .trim(),
    confirmation: (email: string) =>
      [
        "Vielen Dank für Ihr Interesse an InVentures.",
        "",
        `Wir haben Ihre Kontaktdaten (${email}) erhalten und werden uns innerhalb von 24 Stunden melden, um ein erstes unverbindliches Gespräch zu vereinbaren.`,
        "",
        "Mit freundlichen Grüßen,",
        "InVentures Team",
      ].join("\n"),
  },
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email, message, language = "en" } = (await req.json()) as {
      email: string;
      message?: string;
      language: "en" | "de";
    };

    if (!email?.trim() || !validateEmail(email)) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendKey);
    const leadEmail = process.env.LEAD_EMAIL || "info@inventures.at";
    const template =
      EMAIL_TEMPLATES[language as keyof typeof EMAIL_TEMPLATES] ??
      EMAIL_TEMPLATES.en;

    const { error: notifyError } = await resend.emails.send({
      from: "InVentures Avatar <noreply@inventures.at>",
      to: [leadEmail],
      subject: template.subject,
      text: template.body(email, message),
    });

    if (notifyError) {
      console.error("Resend notification error:", notifyError);
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    // Best-effort confirmation — don't fail if this bounces
    await resend.emails
      .send({
        from: "InVentures <noreply@inventures.at>",
        to: [email],
        subject:
          language === "de"
            ? "Ihre Anfrage bei InVentures"
            : "Your InVentures Inquiry",
        text: template.confirmation(email),
      })
      .catch((err) => console.error("Confirmation email error:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
