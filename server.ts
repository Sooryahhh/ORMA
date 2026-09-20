import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import type { Deck } from "./src/types.js";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  aiClient = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return aiClient;
}

function createLocalFallbackDeck(text: string, lang: "en" | "ml"): Deck {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = clean
    .split(/(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 20);

  const pool = sentences.length > 0 ? sentences : [clean.slice(0, 180)];
  const title = (pool[0] || (lang === "ml" ? "പഠന കുറിപ്പുകൾ" : "Study Notes"))
    .replace(/[.!?।].*$/, "")
    .slice(0, 60)
    .trim();

  const summary = Array.from({ length: Math.min(5, Math.max(3, pool.length)) }, (_, i) => pool[i % pool.length]);
  const summary_en = Array.from({ length: summary.length }, (_, i) =>
    lang === "ml" ? `Key concept ${i + 1}: ${summary[i]}` : summary[i]
  );

  const terms = Array.from({ length: 6 }, (_, i) => {
    const s = pool[i % pool.length] || "";
    const words = s.split(/\s+/).filter(Boolean);
    const term = words.slice(0, Math.min(3, words.length)).join(" ") || `Term ${i + 1}`;
    return {
      term,
      term_en: term,
      meaning: s,
      meaning_en: lang === "ml" ? `Definition: ${s}` : s,
    };
  });

  const quiz = Array.from({ length: 6 }, (_, i) => {
    const target = pool[i % pool.length] || clean.slice(0, 80);
    const others = pool.filter((_, j) => j !== (i % pool.length));
    const distractor1 = others[0] || "Alternative concept";
    const distractor2 = others[1] || "Related secondary factor";
    const distractor3 = others[2] || "Unrelated phenomenon";
    const options = [target, distractor1, distractor2, distractor3];
    const answer = i % 4;
    const rotated = [...options.slice(answer), ...options.slice(0, answer)];
    return {
      q: lang === "ml" ? "കുറിപ്പുകളിൽ വിവരിച്ചിരിക്കുന്ന ആശയം ഏതാണ്?" : "Which core concept is described in the notes?",
      q_en: "Which core concept is described in the notes?",
      options: rotated,
      options_en: rotated,
      answer,
      why: lang === "ml" ? "നൽകിയ കുറിപ്പുകളുടെ അടിസ്ഥാനത്തിൽ ഈ പ്രസ്താവന ശരിയാണ്." : "This statement is directly verified by the supplied notes.",
      why_en: "This statement is directly supported by the notes.",
    };
  });

  const cards = Array.from({ length: 8 }, (_, i) => {
    const s = pool[i % pool.length] || "";
    const words = s.split(/\s+/).filter(Boolean);
    const front = words.slice(0, 3).join(" ") || `Concept ${i + 1}`;
    return {
      front: `${front}?`,
      front_en: `${front}?`,
      back: s,
      back_en: lang === "ml" ? `Explanation: ${s}` : s,
    };
  });

  const script = summary.join(" ");

  return {
    id: "offline-" + Date.now(),
    lang,
    ts: Date.now(),
    title,
    title_en: title,
    summary,
    summary_en,
    audio_script: script,
    audio_script_en: script,
    terms,
    quiz,
    cards,
    sourceNotes: clean.slice(0, 1000),
    offline: true,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      recommendedModel: "gemini-3.1-flash-lite",
    });
  });

  // API Generate Deck Endpoint
  app.post("/api/generate", async (req, res) => {
    const startTime = Date.now();
    try {
      const { text, lang = "en", preferredModel } = req.body;

      if (!text || typeof text !== "string" || text.trim().length < 50) {
        return res.status(400).json({
          error: "Please provide at least 50 characters of study notes to generate a deck.",
          code: "too_short",
        });
      }

      const client = getAiClient();
      if (!client) {
        console.warn("No GEMINI_API_KEY detected. Using intelligent offline draft generation.");
        const draft = createLocalFallbackDeck(text, lang as "en" | "ml");
        return res.json({
          deck: draft,
          modelUsed: "offline-engine",
          durationMs: Date.now() - startTime,
        });
      }

      // User requested: "Change the ai which takes less time to give maximum output"
      // gemini-3.1-flash-lite gives ultra-fast turnaround with maximum context and token efficiency
      const model = preferredModel || "gemini-3.1-flash-lite";

      const promptLang = lang === "ml" ? "Malayalam" : "English";
      const otherLang = lang === "ml" ? "English" : "Malayalam";

      const prompt = `You are ORMA's high-speed exam revision engine.
Analyze these student notes and create an in-depth, completely bilingual study deck.
The student's primary notes are in ${promptLang}.

Generate everything in BOTH ${promptLang} and ${otherLang} with matching meaning:
1. Title: Crisp exam topic heading in both languages.
2. Summary: 5 critical bullet point takeaways in both languages.
3. Audio Script: A natural, continuous 1-minute spoken recap (approx 120-140 words) that a student can listen to right before an exam. No bullet symbols, no headers, ending with an encouraging memory tip.
4. Key Terms: 6 essential vocabulary terms with concise 1-sentence explanations in both languages.
5. Quiz: 6 exam-style multiple-choice questions.
   - Every question MUST be answerable from the notes.
   - Four plausible options per question (index 0 to 3).
   - "answer" is the 0-based integer index of the correct option. Distribute correct answers across 0, 1, 2, and 3 (do NOT always use 0).
   - "why" explains why the answer is correct in both languages.
6. Flashcards: 8 high-impact question/term on the front and concise answer/definition on the back in both languages.

STUDENT NOTES:
"""
${text.slice(0, 12000)}
"""`;

      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              title_en: { type: Type.STRING },
              summary: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              summary_en: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              audio_script: { type: Type.STRING },
              audio_script_en: { type: Type.STRING },
              terms: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    term: { type: Type.STRING },
                    term_en: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    meaning_en: { type: Type.STRING },
                  },
                  required: ["term", "term_en", "meaning", "meaning_en"],
                },
              },
              quiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    q: { type: Type.STRING },
                    q_en: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    options_en: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    answer: { type: Type.INTEGER },
                    why: { type: Type.STRING },
                    why_en: { type: Type.STRING },
                  },
                  required: ["q", "q_en", "options", "options_en", "answer", "why", "why_en"],
                },
              },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING },
                    front_en: { type: Type.STRING },
                    back: { type: Type.STRING },
                    back_en: { type: Type.STRING },
                  },
                  required: ["front", "front_en", "back", "back_en"],
                },
              },
            },
            required: [
              "title",
              "title_en",
              "summary",
              "summary_en",
              "audio_script",
              "audio_script_en",
              "terms",
              "quiz",
              "cards",
            ],
          },
        },
      });

      const rawText = response.text?.trim() || "";
      if (!rawText) {
        throw new Error("Empty model response received");
      }

      const parsed = JSON.parse(rawText);
      const deck: Deck = {
        id: "deck-" + Date.now(),
        lang: lang as "en" | "ml",
        ts: Date.now(),
        title: parsed.title || "Study Deck",
        title_en: parsed.title_en || parsed.title || "Study Deck",
        summary: Array.isArray(parsed.summary) ? parsed.summary : [],
        summary_en: Array.isArray(parsed.summary_en) ? parsed.summary_en : [],
        audio_script: parsed.audio_script || "",
        audio_script_en: parsed.audio_script_en || "",
        terms: Array.isArray(parsed.terms) ? parsed.terms : [],
        quiz: Array.isArray(parsed.quiz) ? parsed.quiz : [],
        cards: Array.isArray(parsed.cards) ? parsed.cards : [],
        sourceNotes: text.slice(0, 1500),
      };

      return res.json({
        deck,
        modelUsed: model,
        durationMs: Date.now() - startTime,
      });
    } catch (err: any) {
      console.error("Gemini generation error:", err);

      // Fallback gracefully so user experience is never blocked
      try {
        const { text, lang = "en" } = req.body;
        if (text && typeof text === "string") {
          console.info("Engaging graceful local draft recovery...");
          const recoveryDeck = createLocalFallbackDeck(text, lang as "en" | "ml");
          return res.json({
            deck: recoveryDeck,
            modelUsed: "recovery-draft",
            durationMs: Date.now() - startTime,
            warning: "Primary model encountered an issue; loaded high-speed draft mode.",
          });
        }
      } catch (recoveryErr) {
        console.error("Recovery failed:", recoveryErr);
      }

      return res.status(500).json({
        error: err?.message || "Failed to generate study deck.",
        code: err?.status || "generation_error",
      });
    }
  });

  // Vite middleware in dev; static file serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ORMA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
