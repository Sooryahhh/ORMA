import React, { useState } from "react";
import { Check, X, ArrowRight, RotateCcw, Award, BookOpen } from "lucide-react";
import type { Deck, Lang, QuizQuestion } from "../types.js";

interface QuizSectionProps {
  deck: Deck;
  uiLang: Lang;
  onNavigateToCards: () => void;
}

interface QuestionResult {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  deck,
  uiLang,
  onNavigateToCards,
}) => {
  const isMl = uiLang === "ml";
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [activePool, setActivePool] = useState<QuizQuestion[]>(deck.quiz);

  const qItem: QuizQuestion | undefined = activePool[currentIndex];

  const handleSelectOption = (index: number) => {
    if (selectedAnswer !== null || !qItem) return;
    setSelectedAnswer(index);
    const isCorrect = index === qItem.answer;
    setResults((prev) => [
      ...prev,
      {
        questionIndex: currentIndex,
        selectedAnswer: index,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < activePool.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setActivePool(deck.quiz);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResults([]);
    setIsCompleted(false);
  };

  const handleRetryMissed = () => {
    const missed = activePool.filter((_, idx) => {
      const res = results[idx];
      return res && !res.isCorrect;
    });
    if (missed.length === 0) return;
    setActivePool(missed);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResults([]);
    setIsCompleted(false);
  };

  // Completion Scorecard
  if (isCompleted) {
    const total = results.length;
    const correctCount = results.filter((r) => r.isCorrect).length;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const missedCount = total - correctCount;

    return (
      <div className="max-w-xl mx-auto brutal-panel p-8 bg-[var(--paper)] text-center">
        <Award className="w-16 h-16 mx-auto mb-2 text-[#0038FF] stroke-[2.5]" />
        <div className="font-display text-7xl sm:text-8xl tracking-tight leading-none text-[var(--text-primary)] my-2">
          {percent}%
        </div>
        <p className={`font-mono font-bold text-base sm:text-lg uppercase text-[var(--text-primary)] mb-6 ${isMl ? "font-mal" : ""}`}>
          {correctCount} {isMl ? "ശരി / ആകെ" : "correct out of"} {total}
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {missedCount > 0 && (
            <button
              onClick={handleRetryMissed}
              className="brutal-btn px-4 py-2.5 bg-[#FF3D00] text-white font-mono text-xs sm:text-sm font-bold uppercase flex items-center gap-2 cursor-pointer hover:bg-[#e03600]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {isMl
                  ? `തെറ്റിയവ വീണ്ടും (${missedCount})`
                  : `Retry Missed (${missedCount})`}
              </span>
            </button>
          )}

          <button
            onClick={handleRestart}
            className="brutal-btn px-4 py-2.5 bg-[var(--ink)] text-[var(--paper)] font-mono text-xs sm:text-sm font-bold uppercase hover:opacity-90 cursor-pointer"
          >
            <span>{isMl ? "വീണ്ടും തുടങ്ങൂ" : "Restart Quiz"}</span>
          </button>

          <button
            onClick={onNavigateToCards}
            className="brutal-btn px-4 py-2.5 bg-[#FFE600] text-black font-mono text-xs sm:text-sm font-bold uppercase flex items-center gap-1.5 cursor-pointer hover:bg-[#e6cf00]"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isMl ? "ഫ്ലാഷ്കാർഡിലേക്ക്" : "Go to Flashcards"}</span>
          </button>
        </div>
      </div>
    );
  }

  if (!qItem) return null;

  // Pick question & options matching active language
  const primaryQuestion =
    uiLang === deck.lang ? qItem.q : qItem.q_en || qItem.q;
  const secondaryQuestion =
    uiLang === deck.lang ? qItem.q_en : qItem.q;

  const primaryOptions =
    uiLang === deck.lang ? qItem.options : qItem.options_en || qItem.options;
  const secondaryOptions =
    uiLang === deck.lang ? qItem.options_en : qItem.options;

  const primaryWhy =
    uiLang === deck.lang ? qItem.why : qItem.why_en || qItem.why;
  const secondaryWhy =
    uiLang === deck.lang ? qItem.why_en : qItem.why;

  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === qItem.answer;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Progress Bars */}
      <div className="flex gap-1.5" aria-label="Quiz progress">
        {activePool.map((_, idx) => {
          const result = results[idx];
          let barBg = "bg-[var(--paper-2)]";
          if (idx === currentIndex) barBg = "bg-[#FFE600]";
          else if (result) barBg = result.isCorrect ? "bg-[#00A651]" : "bg-[#FF3D00]";

          return (
            <div
              key={idx}
              className={`flex-1 h-2.5 border-2 border-[var(--ink)] transition-colors ${barBg}`}
            />
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="brutal-panel p-6 bg-[var(--paper)]">
        <div className="flex items-center justify-between font-mono text-xs font-bold text-[var(--text-secondary)] mb-3 pb-2 border-b-2 border-[var(--ink)]">
          <span>
            {isMl ? "ചോദ്യം" : "Question"} {currentIndex + 1} / {activePool.length}
          </span>
          <span className="bg-[#FFE600] px-1.5 py-0.2 border border-black text-black">
            Exam Ready
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <h3
            className={`text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug ${
              uiLang === "ml" ? "font-mal text-xl" : ""
            }`}
          >
            {primaryQuestion}
          </h3>
          {secondaryQuestion && (
            <p
              className={`font-mono text-xs text-[var(--text-secondary)] mt-1 leading-normal ${
                uiLang === "en" ? "font-mal text-sm" : ""
              }`}
            >
              {secondaryQuestion}
            </p>
          )}
        </div>

        {/* 4 Choices */}
        <div className="space-y-3">
          {primaryOptions.map((optText, optIdx) => {
            const letter = ["A", "B", "C", "D"][optIdx] || optIdx + 1;
            const secondaryText = secondaryOptions?.[optIdx];

            let buttonClass = "bg-[var(--paper)] hover:bg-[#FFE600] hover:text-black text-[var(--text-primary)]";
            let letterBg = "bg-[var(--paper-2)] text-[var(--text-primary)]";

            if (isAnswered) {
              if (optIdx === qItem.answer) {
                buttonClass = "bg-[#00A651] text-white";
                letterBg = "bg-white text-[#00A651]";
              } else if (optIdx === selectedAnswer) {
                buttonClass = "bg-[#FF3D00] text-white";
                letterBg = "bg-white text-[#FF3D00]";
              } else {
                buttonClass = "bg-[var(--paper-2)] opacity-60 text-[var(--text-muted)]";
              }
            }

            return (
              <button
                key={optIdx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left brutal-btn p-3.5 flex items-start gap-3 transition-colors ${buttonClass}`}
              >
                <span
                  className={`w-7 h-7 flex-none border-2 border-[var(--ink)] font-mono font-bold text-xs flex items-center justify-center ${letterBg}`}
                >
                  {letter}
                </span>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block font-semibold text-sm sm:text-base leading-snug ${
                      uiLang === "ml" ? "font-mal" : ""
                    }`}
                  >
                    {optText}
                  </span>
                  {secondaryText && (
                    <span
                      className={`block font-mono text-xs opacity-75 mt-0.5 ${
                        uiLang === "en" ? "font-mal text-sm" : ""
                      }`}
                    >
                      {secondaryText}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation / Verdict Banner */}
        {isAnswered && (
          <div
            className={`mt-5 p-4 border-3 border-[var(--ink)] ${
              isCorrect ? "bg-[#00A651] text-white" : "bg-[#FF3D00] text-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5 font-display text-lg uppercase tracking-tight">
              {isCorrect ? <Check className="w-5 h-5 stroke-[3]" /> : <X className="w-5 h-5 stroke-[3]" />}
              <span className={uiLang === "ml" ? "font-mal font-extrabold" : ""}>
                {isCorrect
                  ? isMl
                    ? "കൊള്ളാം! ശരിയായ ഉത്തരം"
                    : "NAILED IT! Correct answer"
                  : isMl
                  ? "അയ്യോ, തെറ്റിയ ഉത്തരം!"
                  : "NOT QUITE! See why below:"}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${uiLang === "ml" ? "font-mal text-base" : ""}`}>
              {primaryWhy}
            </p>
            {secondaryWhy && (
              <p
                className={`font-mono text-xs opacity-85 mt-1 border-t border-white/30 pt-1 leading-normal ${
                  uiLang === "en" ? "font-mal text-sm" : ""
                }`}
              >
                {secondaryWhy}
              </p>
            )}

            <button
              onClick={handleNext}
              className="mt-4 w-full py-3 px-4 brutal-btn bg-black text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-neutral-900 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 >= activePool.length ? (isMl ? "സ്കോർ കാണൂ" : "See Final Score") : (isMl ? "അടുത്ത ചോദ്യം" : "Next Question")}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
