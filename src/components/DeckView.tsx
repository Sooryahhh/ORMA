import React, { useState } from "react";
import { Download, Plus } from "lucide-react";
import type { Deck, Lang } from "../types.js";
import { RecapSection } from "./RecapSection.js";
import { QuizSection } from "./QuizSection.js";
import { FlashcardsSection } from "./FlashcardsSection.js";
import { TermsSection } from "./TermsSection.js";
import { exportDeckCardsToCSV } from "../utils/export.js";

interface DeckViewProps {
  deck: Deck;
  uiLang: Lang;
  onNewDeck: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export const DeckView: React.FC<DeckViewProps> = ({
  deck,
  uiLang,
  onNewDeck,
  onNotify,
}) => {
  const isMl = uiLang === "ml";
  const [activeTab, setActiveTab] = useState<"summary" | "quiz" | "cards" | "terms">("summary");

  const primaryTitle =
    uiLang === deck.lang ? deck.title : deck.title_en || deck.title;
  const secondaryTitle =
    uiLang === deck.lang ? deck.title_en : deck.title;

  const handleExport = () => {
    try {
      const res = exportDeckCardsToCSV(deck);
      onNotify(
        isMl
          ? `${res.count} ഫ്ലാഷ്കാർഡുകൾ സേവ് ചെയ്തു: ${res.filename}`
          : `Saved ${res.count} cards to ${res.filename} (Anki / Quizlet compatible)`
      );
    } catch (e) {
      onNotify("Export failed. Please try again.", true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Deck Masthead */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b-3 border-[var(--ink)] transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 border border-[var(--ink)] ${
                deck.lang === "ml"
                  ? "bg-[#FF3D00] text-white"
                  : "bg-[#0038FF] text-white"
              }`}
            >
              {deck.lang === "ml" ? "Malayalam Source" : "English Source"}
            </span>
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              · {deck.quiz.length} questions · {deck.cards.length} cards · {deck.terms.length} terms
            </span>
          </div>

          <h2
            className={`font-display text-3xl sm:text-4xl uppercase tracking-tight text-[var(--text-primary)] leading-tight ${
              uiLang === "ml" || deck.lang === "ml" ? "font-mal text-3xl sm:text-4xl" : ""
            }`}
          >
            {primaryTitle}
          </h2>

          {secondaryTitle && (
            <p
              className={`font-mono text-xs sm:text-sm text-[var(--text-secondary)] mt-1 ${
                uiLang === "en" ? "font-mal text-base" : ""
              }`}
            >
              {secondaryTitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExport}
            className="brutal-btn px-4 py-2 bg-[var(--paper)] hover:bg-[#FFE600] text-[var(--text-primary)] hover:text-black font-mono text-xs sm:text-sm font-bold uppercase flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isMl ? "കാർഡുകൾ സേവ് ചെയ്യൂ" : "Export Cards"}</span>
          </button>

          <button
            onClick={onNewDeck}
            className="brutal-btn px-4 py-2 bg-[#FF3D00] text-white font-mono text-xs sm:text-sm font-bold uppercase flex items-center gap-1.5 hover:bg-[#e03600] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isMl ? "പുതിയ ഡെക്ക്" : "New Deck"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div
        className="flex border-3 border-[var(--ink)] bg-[var(--paper)] shadow-[4px_4px_0_var(--ink)] overflow-x-auto"
        role="group"
        aria-label="Deck sections"
      >
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex-1 min-w-[120px] py-3 px-4 font-mono text-xs sm:text-sm font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "summary"
              ? "bg-[var(--ink)] text-[var(--yellow)]"
              : "hover:bg-[var(--paper-2)] text-[var(--text-primary)]"
          }`}
          aria-pressed={activeTab === "summary"}
        >
          <span>{isMl ? "സംഗ്രഹം" : "Recap & Audio"}</span>
        </button>

        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex-1 min-w-[120px] py-3 px-4 font-mono text-xs sm:text-sm font-bold uppercase border-l-3 border-[var(--ink)] transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "quiz"
              ? "bg-[var(--ink)] text-[var(--yellow)]"
              : "hover:bg-[var(--paper-2)] text-[var(--text-primary)]"
          }`}
          aria-pressed={activeTab === "quiz"}
        >
          <span>{isMl ? "ക്വിസ്" : "Quiz"}</span>
          <span className="bg-[#FFE600] text-black px-1.5 py-0.2 text-[11px] font-bold border border-black">
            {deck.quiz.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("cards")}
          className={`flex-1 min-w-[120px] py-3 px-4 font-mono text-xs sm:text-sm font-bold uppercase border-l-3 border-[var(--ink)] transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "cards"
              ? "bg-[var(--ink)] text-[var(--yellow)]"
              : "hover:bg-[var(--paper-2)] text-[var(--text-primary)]"
          }`}
          aria-pressed={activeTab === "cards"}
        >
          <span>{isMl ? "ഫ്ലാഷ്കാർഡുകൾ" : "Flashcards"}</span>
          <span className="bg-[#FFE600] text-black px-1.5 py-0.2 text-[11px] font-bold border border-black">
            {deck.cards.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("terms")}
          className={`flex-1 min-w-[120px] py-3 px-4 font-mono text-xs sm:text-sm font-bold uppercase border-l-3 border-[var(--ink)] transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "terms"
              ? "bg-[var(--ink)] text-[var(--yellow)]"
              : "hover:bg-[var(--paper-2)] text-[var(--text-primary)]"
          }`}
          aria-pressed={activeTab === "terms"}
        >
          <span>{isMl ? "പദാവലി" : "Key Terms"}</span>
          <span className="bg-[#FFE600] text-black px-1.5 py-0.2 text-[11px] font-bold border border-black">
            {deck.terms.length}
          </span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="pt-2">
        {activeTab === "summary" && <RecapSection deck={deck} uiLang={uiLang} />}
        {activeTab === "quiz" && (
          <QuizSection
            deck={deck}
            uiLang={uiLang}
            onNavigateToCards={() => setActiveTab("cards")}
          />
        )}
        {activeTab === "cards" && <FlashcardsSection deck={deck} uiLang={uiLang} />}
        {activeTab === "terms" && <TermsSection deck={deck} uiLang={uiLang} />}
      </div>
    </div>
  );
};
