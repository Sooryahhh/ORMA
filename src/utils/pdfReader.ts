import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Initialize worker src safely using the local bundled worker from Vite
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
} catch (e) {
  console.warn("Could not set local pdf worker url, attempting fallback:", e);
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch (e2) {}
}

export interface ScriptAnalysis {
  lang: "en" | "ml";
  ratio: number;
  malCount: number;
  latCount: number;
  totalLetters: number;
}

export function detectScript(text: string): ScriptAnalysis {
  let malCount = 0;
  let latCount = 0;

  for (const ch of text) {
    const code = ch.codePointAt(0) || 0;
    // Malayalam Unicode block: 0x0D00 - 0x0D7F
    if (code >= 0x0d00 && code <= 0x0d7f) {
      malCount++;
    } else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      latCount++;
    }
  }

  const totalLetters = malCount + latCount;
  if (totalLetters === 0) {
    return { lang: "en", ratio: 0, malCount: 0, latCount: 0, totalLetters: 0 };
  }

  const ratio = malCount / totalLetters;
  return {
    lang: ratio > 0.2 ? "ml" : "en",
    ratio,
    malCount,
    latCount,
    totalLetters,
  };
}

export async function extractTextFromFile(
  file: File,
  onProgress?: (progressText: string) => void
): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    onProgress?.("Loading PDF document...");
    const buffer = await file.arrayBuffer();

    try {
      const loadingTask = pdfjsLib.getDocument({
        data: buffer,
      });
      const pdf = await loadingTask.promise;
      const numPages = Math.min(pdf.numPages, 40);
      let fullText = "";

      for (let p = 1; p <= numPages; p++) {
        onProgress?.(`Reading PDF page ${p} of ${numPages}...`);
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        let lastY: number | null = null;
        let pageLine = "";

        for (const item of textContent.items as any[]) {
          if (!item.str) continue;
          const y = item.transform ? Math.round(item.transform[5]) : null;
          if (lastY !== null && y !== null && Math.abs(y - lastY) > 3) {
            fullText += pageLine.trim() + "\n";
            pageLine = "";
          }
          pageLine += item.str + (item.hasEOL ? "\n" : " ");
          lastY = y;
        }
        fullText += pageLine.trim() + "\n\n";
      }

      if (!fullText.trim()) {
        throw new Error("This PDF appears to be a scanned image with no selectable text layer.");
      }
      return fullText.trim();
    } catch (err: any) {
      console.error("PDF read error:", err);
      throw new Error(err.message || "Could not extract text from this PDF file.");
    }
  }

  // Plain text, Markdown, CSV, Notes
  onProgress?.("Reading text file...");
  const text = await file.text();
  return text.trim();
}
