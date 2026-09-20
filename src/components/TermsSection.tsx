import React from "react";
import type { Deck, Lang } from "../types.js";

interface TermsSectionProps {
  deck: Deck;
  uiLang: Lang;
}

export const TermsSection: React.FC<TermsSectionProps> = ({ deck, uiLang }) => {
  const isMl = uiLang === "ml";
  const terms = deck.terms || [];

  if (terms.length === 0) {
    return (
      <div className="brutal-panel p-6 bg-[var(--paper)] text-center font-mono text-sm text-[var(--text-secondary)]">
        {isMl ? "പദാവലി ലഭ്യമല്ല" : "No glossary terms defined for this deck."}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {terms.map((item, index) => {
          const primaryTerm =
            uiLang === deck.lang ? item.term : item.term_en || item.term;
          const secondaryTerm =
            uiLang === deck.lang ? item.term_en : item.term;

          const primaryMeaning =
            uiLang === deck.lang ? item.meaning : item.meaning_en || item.meaning;
          const secondaryMeaning =
            uiLang === deck.lang ? item.meaning_en : item.meaning;

          return (
            <div
              key={index}
              className="brutal-panel p-4 bg-[var(--paper)] hover:bg-[var(--paper-2)] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline gap-2 flex-wrap mb-2 pb-1.5 border-b-2 border-[var(--ink)]">
                  <span
                    className={`font-bold text-base sm:text-lg text-[var(--text-primary)] ${
                      uiLang === "ml" ? "font-mal text-xl" : ""
                    }`}
                  >
                    {primaryTerm}
                  </span>
                  {secondaryTerm && (
                    <span
                      className={`font-mono text-xs font-semibold text-[var(--text-secondary)] ${
                        uiLang === "en" ? "font-mal text-sm" : ""
                      }`}
                    >
                      {secondaryTerm}
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm text-[var(--text-secondary)] leading-relaxed mb-3 ${
                    uiLang === "ml" ? "font-mal text-base" : ""
                  }`}
                >
                  {primaryMeaning}
                </p>
              </div>

              {secondaryMeaning && (
                <div
                  className={`border-t-2 border-dashed border-[var(--ink)]/20 pt-2 font-mono text-xs text-[var(--text-muted)] leading-normal ${
                    uiLang === "en" ? "font-mal text-sm" : ""
                  }`}
                >
                  {secondaryMeaning}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
