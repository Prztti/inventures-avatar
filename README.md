# InVentures AI Avatar Widget

A production-ready Next.js 14 AI chat widget for InVentures GmbH. The widget floats in the bottom-right corner of any page, answers visitor questions about InVentures using a RAG pipeline backed by GPT-4o-mini, optionally renders a HeyGen streaming avatar that speaks responses aloud, and captures leads via Resend email.

---

## Prerequisites

- Node.js 18.17 or later
- npm 9+ (or pnpm/yarn)
- An OpenAI account with API access
- A Resend account (free tier is sufficient for MVP)
- (Optional) A HeyGen account for the video avatar feature

---

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-org/inventures-avatar.git
cd inventures-avatar

# 2. Install dependencies
npm install

# 3. Copy environment file and fill in your keys
cp .env.example .env.local
# Edit .env.local — see Environment Variables table below

# 4. Start the development server
npm run dev
# Open http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | OpenAI secret key (`sk-...`). Used for both the RAG embedding step (`text-embedding-3-small`) and the chat completion (`gpt-4o-mini`). |
| `NEXT_PUBLIC_HEYGEN_API_KEY` | No | HeyGen API key. When absent the widget runs in text-only mode. |
| `NEXT_PUBLIC_HEYGEN_AVATAR_ID` | No | HeyGen interactive avatar ID. Must be set together with the API key. |
| `RESEND_API_KEY` | Yes | Resend API key (`re_...`). Required for the lead capture email flow. |
| `LEAD_EMAIL` | No | Destination address for lead notification emails. Defaults to `info@inventures.at`. |

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle. Never put secret keys in `NEXT_PUBLIC_` variables.

---

## HeyGen Setup

1. Create an account at [heygen.com](https://www.heygen.com).
2. Navigate to **Avatar** > **Interactive Avatar** and create or select an avatar. Copy the **Avatar ID** shown in the avatar settings.
3. Go to **Settings** > **API** and generate an API key. Copy the key.
4. Set both values in `.env.local`:
   ```
   NEXT_PUBLIC_HEYGEN_API_KEY=your_heygen_api_key
   NEXT_PUBLIC_HEYGEN_AVATAR_ID=your_avatar_id
   ```
5. When both are present the widget renders a 192px video strip above the chat; when absent it shows the gold `IV` logo placeholder instead.

> Note: HeyGen interactive avatar streaming requires WebRTC support in the browser and is billed per minute of streaming session. The widget uses `AvatarQuality.Low` to minimise costs during the MVP phase.

---

## Resend Setup

1. Create an account at [resend.com](https://resend.com).
2. Go to **API Keys** and create a new key with **Send** permission. Copy it.
3. Add a sending domain (or use Resend's shared domain `onboarding@resend.dev` for testing). For production, add and verify `inventures.at` under **Domains**.
4. Set the key in `.env.local`:
   ```
   RESEND_API_KEY=re_your_key_here
   ```

Two emails are sent on each lead capture:
- An internal notification to `LEAD_EMAIL` (or `info@inventures.at`).
- A confirmation email to the visitor with the 24-hour response promise.

---

## Vercel Deployment

1. Push the repository to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**. Import the repository.
3. Vercel detects Next.js automatically — no framework configuration needed.
4. Open **Settings** > **Environment Variables** in the Vercel project and add each variable from the table above. Make sure to set them for the **Production** (and optionally **Preview**) environments.
5. Click **Deploy**. Vercel builds and deploys in ~60 seconds.

For subsequent deployments simply push to `main`; Vercel redeploys automatically.

> The `maxDuration = 30` export in `app/api/chat/route.ts` sets the Vercel function timeout to 30 seconds, which is sufficient for streaming responses. The free Hobby plan supports up to 60 seconds.

---

## Embedding on Another Site

The widget is a self-contained React component. To embed it in an existing Next.js project:

1. Copy these files verbatim into your project:
   - `components/AvatarWidget.tsx`
   - `components/AvatarVideo.tsx`
   - `components/ChatFallback.tsx`
   - `lib/knowledge-base.ts`
   - `lib/system-prompt.ts`
   - `lib/rag.ts`
   - `lib/heygen.ts`
   - `app/api/chat/route.ts`
   - `app/api/lead/route.ts`

2. Add the Tailwind colour tokens and keyframes from `tailwind.config.ts` to your existing Tailwind config.

3. Install the additional dependencies:
   ```bash
   npm install openai ai @heygen/streaming-avatar resend
   ```

4. Add the widget to any page or layout:
   ```tsx
   import AvatarWidget from "@/components/AvatarWidget";

   export default function Layout({ children }) {
     return (
       <>
         {children}
         <AvatarWidget />
       </>
     );
   }
   ```

5. Add the environment variables to your project's `.env.local`.

---

## Architecture Overview

### RAG Pipeline

Each chat request goes through a Retrieval-Augmented Generation step before hitting GPT-4o-mini:

1. The user's message is embedded with `text-embedding-3-small`.
2. Cosine similarity is computed against pre-embedded knowledge base chunks (11 chunks covering all aspects of InVentures).
3. The top-3 most relevant chunks are injected into the system prompt as `KNOWLEDGE BASE CONTEXT`.
4. GPT-4o-mini generates a response constrained to that context and the system prompt guardrails.

Knowledge base embeddings are computed once per server process and cached in memory (`knowledgeBaseWithEmbeddings`). The embedding cache (`embeddingCache`) avoids redundant API calls for repeated queries.

### Streaming

The chat API route uses the Vercel AI SDK's `OpenAIStream` + `StreamingTextResponse` to pipe GPT tokens directly to the browser as a readable stream. The frontend reads the stream chunk-by-chunk and appends each token to the last assistant message in real time, giving a typewriter effect.

### HeyGen Integration

When HeyGen credentials are present, `AvatarVideo` initialises a `StreamingAvatar` session on component mount. After each chat response completes streaming, the full assistant text is passed to `avatar.speak()` via the `pendingSpeak` prop. The avatar speaks the text and fires `AVATAR_STOP_TALKING` when done, clearing `pendingSpeak`.

### Lead Capture

Lead capture is triggered automatically when keyword analysis detects contact intent in either the user's message or the assistant's response (keywords: "contact", "email", "meet", "schedule", etc.). An inline email form appears below the chat. On submission, the `/api/lead` route sends two emails via Resend: a notification to the team and a confirmation to the visitor.

---

## Customisation Notes

- **Knowledge base**: Edit `lib/knowledge-base.ts` to add, remove, or update knowledge chunks. Each chunk has `id`, `topic`, `content`, and `tags`. Embeddings are recomputed automatically.
- **System prompt**: Edit `lib/system-prompt.ts` to change tone, guardrails, or the lead capture call-to-action.
- **Model**: Change `model: "gpt-4o-mini"` in `app/api/chat/route.ts` to `gpt-4o` for higher quality at higher cost.
- **Widget dimensions**: The panel height (`520px`) and video strip height (`h-48`, 192px) are set inline/via Tailwind in `components/AvatarWidget.tsx`.
- **Colour scheme**: All brand colours are defined in `tailwind.config.ts` under `theme.extend.colors`. The primary brand colour is `gold: "#c9a84c"`.
- **Lead trigger keywords**: Extend or narrow the `triggers` array in the `checkLeadTrigger` function inside `AvatarWidget.tsx`.
- **Email templates**: Edit the `EMAIL_TEMPLATES` object in `app/api/lead/route.ts` to customise subject lines and body copy in both languages.
