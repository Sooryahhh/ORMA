import React, { useState } from "react";
import { RotateCw, Check, RotateCcw } from "lucide-react";
import type { Deck, Lang, FlashCard } from "../types.js";

interface FlashcardsSectionProps {
  deck: Deck;
  uiLang: Lang;
}

export const FlashcardsSection: React.FC<FlashcardsSectionProps> = ({
  deck,
  uiLang,
}) => {
  const isMl = uiLang === "ml";
  const [queue, setQueue] = useState<number[]>(deck.cards.map((_, i) => i));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [againQueue, setAgainQueue] = useState<number[]>([]);

  const isRoundComplete = currentIndex >= queue.length;

  const cardIndex = queue[currentIndex];
  const cardItem: FlashCard | undefined = deck.cards[cardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnewIt = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReviewAgain = () => {
    setAgainQueue((prev) => [...prev, cardIndex]);
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleStartNextRound = () => {
    setQueue(againQueue);
    setAgainQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setRound((r) => r + 1);
  };

  const handleResetAll = () => {
    setQueue(deck.cards.map((_, i) => i));
    setAgainQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setRound(1);
  };

  if (isRoundComplete) {
    if (againQueue.length > 0) {
      return (
        <div className="max-w-md mx-auto brutal-panel p-8 bg-[var(--paper)] text-center">
          <div className="font-display text-6xl text-[#0038FF] mb-2 leading-none">
            {againQueue.length}
          </div>
          <p className="font-mono font-bold text-sm uppercase text-[var(--text-primary)] mb-6">
            {isMl
              ? `ആവർത്തന ഘട്ടം ${round + 1} (${againQueue.length} കാർഡുകൾ ബാക്കി)`
              : `Review Round ${round + 1} (${againQueue.length} cards marked for review)`}
          </p>
          <button
            onClick={handleStartNextRound}
            className="w-full py-3 brutal-btn bg-[#FF3D00] text-white font-mono text-sm font-bold uppercase flex items-center justify-center gap-2 cursor-pointer hover:bg-[#e03600]"
          >
            <RotateCw className="w-4 h-4" />
            <span>{isMl ? "വീണ്ടും പരിശീലിക്കൂ" : "Start Review Round"}</span>
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto brutal-panel p-8 bg-[var(--paper)] text-center">
        <div className="w-16 h-16 bg-[#00A651] text-white border-3 border-[var(--ink)] mx-auto flex items-center justify-center mb-3">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>
        <div className="font-display text-2xl text-[var(--text-primary)] mb-1">
          {isMl ? "എല്ലാ കാർഡുകളും പൂർത്തിയായി!" : "DECK MASTERED!"}
        </div>
        <p className="font-mono text-xs text-[var(--text-secondary)] mb-6">
          {isMl
            ? "നിങ്ങൾ എല്ലാ ഫ്ലാഷ്കാർഡുകളും വിജയകരമായി പഠിച്ചു കഴിഞ്ഞു."
            : "You remembered every single card in this deck."}
        </p>
        <button
          onClick={handleResetAll}
          className="w-full py-3 brutal-btn bg-[#FFE600] text-black font-mono text-sm font-bold uppercase flex items-center justify-center gap-2 cursor-pointer hover:bg-[#e6cf00]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isMl ? "തുടക്കം മുതൽ ആവർത്തിക്കൂ" : "Restart All Flashcards"}</span>
        </button>
      </div>
    );
  }

  if (!cardItem) return null;

  const primaryFront =
    uiLang === deck.lang ? cardItem.front : cardItem.front_en || cardItem.front;
  const secondaryFront =
    uiLang === deck.lang ? cardItem.front_en : cardItem.front;

  const primaryBack =
    uiLang === deck.lang ? cardItem.back : cardItem.back_en || cardItem.back;
  const secondaryBack =
    uiLang === deck.lang ? cardItem.back_en : cardItem.back;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Round & Progress Bar */}
      <div className="flex justify-between items-center text-xs font-mono font-bold text-[var(--text-secondary)] px-1">
        <span>
          {isMl ? "കാർഡ്" : "Card"} {currentIndex + 1} / {queue.length}
        </span>
        <span className="bg-[#FFE600] px-2 py-0.5 border border-black text-black">
          {round > 1 ? `${isMl ? "ഘട്ടം" : "Round"} ${round}` : isMl ? "ഘട്ടം 1" : "Round 1"}
        </span>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="perspective-1000 w-full aspect-[8/5] sm:aspect-[16/9] cursor-pointer select-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleFlip();
          }
        }}
        aria-label="Flip flashcard"
      >
        <div
          className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT FACE */}
          <div className="absolute inset-0 backface-hidden brutal-panel bg-[var(--paper)] p-6 sm:p-8 flex flex-col justify-between items-center text-center">
            <span className="font-mono text-xs uppercase font-bold tracking-widest text-[var(--text-secondary)] bg-[var(--paper-2)] px-2 py-0.5 border border-[var(--ink)]">
              Q · FRONT
            </span>
            <div className="my-auto px-2">
              <h3
                className={`text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-snug ${
                  uiLang === "ml" ? "font-mal text-2xl" : ""
                }`}
              >
                {primaryFront}
              </h3>
              {secondaryFront && (
                <p
                  className={`font-mono text-xs sm:text-sm text-[var(--text-secondary)] mt-2 ${
                    uiLang === "en" ? "font-mal text-base" : ""
                  }`}
                >
                  {secondaryFront}
                </p>
              )}
            </div>
            <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1">
              <RotateCw className="w-3 h-3" />
              {isMl ? "കാർഡ് മറിക്കാൻ ടാപ്പ് ചെയ്യൂ" : "Tap card to reveal answer"}
            </span>
          </div>

          {/* BACK FACE */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 brutal-panel bg-[#FFE600] text-black p-6 sm:p-8 flex flex-col justify-between items-center text-center border-3 border-black">
            <span className="font-mono text-xs uppercase font-bold tracking-widest text-black bg-white px-2 py-0.5 border border-black">
              A · BACK
            </span>
            <div className="my-auto px-2">
              <p
                className={`text-lg sm:text-xl font-bold text-black leading-relaxed ${
                  uiLang === "ml" ? "font-mal text-xl" : ""
                }`}
              >
                {primaryBack}
              </p>
              {secondaryBack && (
                <p
                  className={`font-mono text-xs sm:text-sm text-neutral-800 mt-2 border-t border-black/20 pt-2 ${
                    uiLang === "en" ? "font-mal text-base" : ""
                  }`}
                >
                  {secondaryBack}
                </p>
              )}
            </div>
            <span className="font-mono text-[11px] text-neutral-800">
              {isMl ? "ഓർമ്മയുണ്ടോ ഇല്ലയോ എന്ന് താഴെ തിരഞ്ഞെടുക്കൂ" : "Mark mastery level below"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        {isFlipped ? (
          <div className="flex gap-3">
            <button
              onClick={handleReviewAgain}
              className="flex-1 py-3.5 px-4 brutal-btn bg-[#FF3D00] text-white font-mono text-xs sm:text-sm font-bold uppercase flex items-center justify-center gap-2 cursor-pointer hover:bg-[#e03600]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isMl ? "വീണ്ടും പഠിക്കണം" : "Review Again"}</span>
            </button>
            <button
              onClick={handleKnewIt}
              className="flex-1 py-3.5 px-4 brutal-btn bg-[#00A651] text-white font-mono text-xs sm:text-sm font-bold uppercase flex items-center justify-center gap-2 cursor-pointer hover:bg-[#009146]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isMl ? "ഇത് അറിയാം" : "I Knew It"}</span>
            </button>
          </div>
        ) : (
          <div className="text-center font-mono text-xs text-[var(--text-muted)] py-2">
            {isMl ? "മറിക്കാൻ കാർഡിൽ ക്ലിക്ക് ചെയ്യുക" : "Click anywhere on card to flip"}
          </div>
        )}
      </div>
    </div>
  );
};
