export interface VoiceInfo {
  name: string;
  lang: string;
  isMalayalam: boolean;
  voice: SpeechSynthesisVoice;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  try {
    return window.speechSynthesis.getVoices() || [];
  } catch (e) {
    return [];
  }
}

export function findBestVoice(lang: "en" | "ml"): { voice: SpeechSynthesisVoice | null; isExact: boolean } {
  const voices = getAvailableVoices();
  if (voices.length === 0) return { voice: null, isExact: false };

  if (lang === "ml") {
    // Look for ml-IN or Malayalam language tag
    const mlVoice = voices.find((v) => {
      const code = (v.lang || "").replace("_", "-").toLowerCase();
      return code.startsWith("ml") || v.name.toLowerCase().includes("malayalam");
    });
    if (mlVoice) return { voice: mlVoice, isExact: true };

    // Fallback to Indian English or standard English
    const inEnVoice = voices.find((v) => (v.lang || "").replace("_", "-").toLowerCase().startsWith("en-in"));
    if (inEnVoice) return { voice: inEnVoice, isExact: false };

    const enVoice = voices.find((v) => (v.lang || "").toLowerCase().startsWith("en"));
    return { voice: enVoice || voices[0] || null, isExact: false };
  }

  // English
  const enPref = ["en-in", "en-gb", "en-us", "en"];
  for (const pref of enPref) {
    const v = voices.find((voice) => (voice.lang || "").replace("_", "-").toLowerCase().startsWith(pref));
    if (v) return { voice: v, isExact: true };
  }

  return { voice: voices[0] || null, isExact: false };
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  } catch (e) {
    console.warn("speechSynthesis cancel error:", e);
  }
}

export function speakText(
  text: string,
  lang: "en" | "ml",
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): { voiceUsed: string | null; fellBack: boolean } {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    options?.onError?.(new Error("Speech synthesis not supported in this environment."));
    return { voiceUsed: null, fellBack: false };
  }

  stopSpeaking();

  const { voice, isExact } = findBestVoice(lang);
  const utterance = new SpeechSynthesisUtterance(text);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = lang === "ml" ? "ml-IN" : "en-IN";
  }

  utterance.rate = lang === "ml" ? 0.92 : 1.0;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    activeUtterance = null;
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    options?.onError?.(e);
  };

  activeUtterance = utterance;
  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    options?.onError?.(err);
  }

  return {
    voiceUsed: voice ? `${voice.name} (${voice.lang})` : null,
    fellBack: lang === "ml" && !isExact,
  };
}
