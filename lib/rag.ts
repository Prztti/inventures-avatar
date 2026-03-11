import { knowledgeBase, KnowledgeChunk } from "./knowledge-base";

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "to", "of", "in", "on", "at", "by", "for",
  "with", "about", "as", "into", "through", "from", "and", "or", "but",
  "not", "what", "how", "when", "where", "who", "which", "that", "this",
  "it", "its", "i", "you", "we", "they", "me", "us", "them", "my", "your",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export function retrieveRelevantChunks(
  query: string,
  topK = 3
): KnowledgeChunk[] {
  const keywords = tokenize(query);

  if (keywords.length === 0) {
    return knowledgeBase.slice(0, topK);
  }

  const scored = knowledgeBase.map((chunk) => {
    const searchText =
      `${chunk.topic} ${chunk.content} ${chunk.tags.join(" ")}`.toLowerCase();

    const score = keywords.reduce((sum, kw) => {
      const re = new RegExp(kw, "g");
      const matches = searchText.match(re)?.length ?? 0;
      return sum + matches;
    }, 0);

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

export function formatContext(chunks: KnowledgeChunk[]): string {
  return chunks.map((c) => `## ${c.topic}\n${c.content}`).join("\n\n");
}
