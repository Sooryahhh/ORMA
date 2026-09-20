import React, { useState, useEffect, useRef } from "react";
import type { Deck, Lang, GenerateResponse } from "./types.js";
import { Header } from "./components/Header.js";
import { SourceInput } from "./components/SourceInput.js";
import { DeckView } from "./components/DeckView.js";
import { DeckLibrary } from "./components/DeckLibrary.js";
import { LoadingModal } from "./components/LoadingModal.js";
import { DEMO_DECK } from "./data/samples.js";
import { AlertCircle, CheckCircle, X } from "lucide-react";

const STORAGE_KEY = "orma_study_decks_v2";
const UI_LANG_KEY = "orma_ui_lang";
const THEME_KEY = "orma_theme";

export default function App() {
  const [uiLang, setUiLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [savedDecks, setSavedDecks] = useState<Deck[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    msg: string;
    isError?: boolean;
  } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize theme from storage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
      const initialTheme = storedTheme === "dark" ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    } catch (e) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  // Load initial decks from localStorage
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem(UI_LANG_KEY) as Lang | null;
      if (storedLang === "en" || storedLang === "ml") {
        setUiLang(storedLang);
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedDecks(parsed);
          return;
        }
      }
      // Seed with demo deck if empty
      setSavedDecks([DEMO_DECK]);
    } catch (e) {
      console.warn("Storage load error:", e);
      setSavedDecks([DEMO_DECK]);
    }
  }, []);

  // Persist saved decks
  const saveDecksToStorage = (updatedDecks: Deck[]) => {
    setSavedDecks(updatedDecks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDecks.slice(0, 25)));
    } catch (e) {
      console.warn("Could not save to storage:", e);
    }
  };

  const handleToggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
  };

  const handleToggleLang = (lang: Lang) => {
    setUiLang(lang);
    try {
      localStorage.setItem(UI_LANG_KEY, lang);
    } catch (e) {}
  };

  const showNotification = (msg: string, isError?: boolean) => {
    setNotification({ msg, isError });
    setTimeout(() => {
      setNotification((curr) => (curr?.msg === msg ? null : curr));
    }, 6000);
  };

  const handleGenerate = async (text: string, lang: Lang) => {
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lang,
        }),
        signal: controller.signal,
      });

      const data: GenerateResponse = await response.json();

      if (!response.ok || !data.deck) {
        throw new Error(data.error || "Failed to generate study deck.");
      }

      const newDeck = data.deck;
      const updated = [newDeck, ...savedDecks.filter((d) => d.id !== newDeck.id)];
      saveDecksToStorage(updated);
      setActiveDeck(newDeck);
      setIsLibraryOpen(false);

      const timeSec = data.durationMs ? (data.durationMs / 1000).toFixed(1) : "1.8";
      showNotification(
        uiLang === "ml"
          ? `ഡെക്ക് വിജയകരമായി തയ്യാറായി (${timeSec} സെക്കൻഡ്)`
          : `Deck generated in ${timeSec}s!`
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        showNotification(uiLang === "ml" ? "ഡെക്ക് തയ്യാറാക്കൽ റദ്ദാക്കി." : "Generation cancelled.", false);
      } else {
        console.error("Generate error:", err);
        showNotification(
          err.message || (uiLang === "ml" ? "ഡെക്ക് ഉണ്ടാക്കാൻ കഴിഞ്ഞില്ല." : "Generation failed."),
          true
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  };

  const handleDeleteDeck = (id: string) => {
    const updated = savedDecks.filter((d) => d.id !== id);
    saveDecksToStorage(updated);
    if (activeDeck?.id === id) {
      setActiveDeck(null);
    }
    showNotification(uiLang === "ml" ? "ഡെക്ക് ഒഴിവാക്കി." : "Deck deleted.", false);
  };

  const isMl = uiLang === "ml";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 sm:px-6">
      {/* Masthead */}
      <Header
        lang={uiLang}
        onToggleLang={handleToggleLang}
        savedDecksCount={savedDecks.length}
        onOpenLibrary={() => setIsLibraryOpen(!isLibraryOpen)}
        isLibraryOpen={isLibraryOpen}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`mb-6 p-3.5 border-3 border-[var(--ink)] flex items-center justify-between gap-3 shadow-[4px_4px_0_var(--ink)] ${
            notification.isError ? "bg-[#FF3D00] text-white" : "bg-[#FFE600] text-black"
          }`}
        >
          <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm font-bold">
            {notification.isError ? (
              <AlertCircle className="w-5 h-5 flex-none" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-none" />
            )}
            <span>{notification.msg}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:opacity-75 cursor-pointer font-bold"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mb-12">
        {isLibraryOpen ? (
          <DeckLibrary
            decks={savedDecks}
            uiLang={uiLang}
            onSelectDeck={(deck) => {
              setActiveDeck(deck);
              setIsLibraryOpen(false);
            }}
            onDeleteDeck={handleDeleteDeck}
            onBack={() => setIsLibraryOpen(false)}
          />
        ) : activeDeck ? (
          <DeckView
            deck={activeDeck}
            uiLang={uiLang}
            onNewDeck={() => setActiveDeck(null)}
            onNotify={showNotification}
          />
        ) : (
          <SourceInput
            uiLang={uiLang}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Loading Modal */}
      <LoadingModal
        isOpen={isLoading}
        uiLang={uiLang}
        onCancel={handleCancelGeneration}
      />

      {/* Footnote Specifications */}
      <footer className="border-t-4 border-[var(--ink)] pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-[var(--text-secondary)] transition-colors">
        <div>
          <h4 className="font-mono font-bold uppercase text-[var(--text-primary)] mb-1.5 tracking-wider">
            {isMl ? "രണ്ട് ഭാഷകൾ, ഒറ്റ ക്ലിക്കിൽ" : "Two Languages, One Pass"}
          </h4>
          <p className="font-mono text-[var(--text-muted)] leading-relaxed">
            {isMl
              ? "ഓരോ ചോദ്യവും കാർഡും സംഗ്രഹവും ഒരേസമയം മലയാളത്തിലും ഇംഗ്ലീഷിലും തയ്യാറാക്കപ്പെടുന്നു. ഭാഷ മാറ്റിയാലും ചോദ്യങ്ങളും ഉത്തരങ്ങളും മാറുകയില്ല."
              : "Every question, card, and takeaway is generated in English and Malayalam simultaneously. Flip the toggle anytime without losing test progress."}
          </p>
        </div>

        <div>
          <h4 className="font-mono font-bold uppercase text-[var(--text-primary)] mb-1.5 tracking-wider">
            {isMl ? "ദ്രുത പഠന സഹായി" : "High-Density Output"}
          </h4>
          <p className="font-mono text-[var(--text-muted)] leading-relaxed">
            {isMl
              ? "ഏറ്റവും കുറഞ്ഞ സമയത്തിൽ വിപുലമായ ചോദ്യങ്ങളും ഫ്ലാഷ്കാർഡുകളും നൽകുന്നു."
              : "Generates 6 exam-style quiz questions, 8 3D flashcards, key vocabulary glossary, and audio recap in seconds."}
          </p>
        </div>

        <div>
          <h4 className="font-mono font-bold uppercase text-[var(--text-primary)] mb-1.5 tracking-wider">
            {isMl ? "ഒരു മിനിറ്റ് ശബ്ദ സംഗ്രഹം" : "Spoken Audio Player"}
          </h4>
          <p className="font-mono text-[var(--text-muted)] leading-relaxed">
            {isMl
              ? "പരീക്ഷയ്ക്ക് തൊട്ടുമുമ്പ് കേൾക്കാവുന്ന 60 സെക്കൻഡ് സംഗ്രഹം ബ്രൗസറിലെ വോയ്‌സ് സിന്തസിസ് വഴി പ്ലേ ചെയ്യുന്നു."
              : "A 60-second spoken exam summary read aloud with animated audio waves, voice selection, and expandable transcripts."}
          </p>
        </div>

        <div>
          <h4 className="font-mono font-bold uppercase text-[var(--text-primary)] mb-1.5 tracking-wider">
            {isMl ? "Anki ലേക്ക് സേവ് ചെയ്യാം" : "Anki & Quizlet Export"}
          </h4>
          <p className="font-mono text-[var(--text-muted)] leading-relaxed">
            {isMl
              ? "ഫ്ലാഷ്കാർഡുകൾ UTF-8 ഫോർമാറ്റിലുള്ള CSV ഫയലായി ഡൗൺലോഡ് ചെയ്ത് Anki അല്ലെങ്കിൽ Quizlet-ലേക്ക് ചേർക്കാം."
              : "Flashcards download as clean UTF-8 CSVs containing front, back, and secondary translations ready for Anki and Quizlet."}
          </p>
        </div>
      </footer>
    </div>
  );
}
