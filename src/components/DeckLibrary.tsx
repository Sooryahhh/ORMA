import React from "react";
import { Trash2, BookOpen, ArrowLeft } from "lucide-react";
import type { Deck, Lang } from "../types.js";

interface DeckLibraryProps {
  decks: Deck[];
  uiLang: Lang;
  onSelectDeck: (deck: Deck) => void;
  onDeleteDeck: (id: string) => void;
  onBack: () => void;
}

export const DeckLibrary: React.FC<DeckLibraryProps> = ({
  decks,
  uiLang,
  onSelectDeck,
  onDeleteDeck,
  onBack,
}) => {
  const isMl = uiLang === "ml";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b-3 border-[var(--ink)]">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[var(--text-primary)]">
            {isMl ? "സേവ് ചെയ്ത ഡെക്കുകൾ" : "MY SAVED DECKS"}
          </h2>
          <p className="font-mono text-xs text-[var(--text-secondary)] mt-1">
            {isMl
              ? "നിങ്ങൾ ഉണ്ടാക്കിയ എല്ലാ സ്റ്റഡി ഡെക്കുകളും ഇവിടെ ലഭ്യമാണ്"
              : "Locally saved revisions and preloaded sample decks"}
          </p>
        </div>

        <button
          onClick={onBack}
          className="brutal-btn px-4 py-2 bg-[#FF3D00] text-white font-mono text-xs sm:text-sm font-bold uppercase flex items-center gap-1.5 cursor-pointer hover:bg-[#e03600]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isMl ? "തിരികെ" : "Back"}</span>
        </button>
      </div>

      {decks.length === 0 ? (
        <div className="brutal-panel p-10 bg-[var(--paper)] text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] stroke-[1.5]" />
          <p className="font-mono text-sm text-[var(--text-secondary)]">
            {isMl
              ? "ഡെക്കുകൾ ഒന്നും സേവ് ചെയ്തിട്ടില്ല. ഒരെണ്ണം ഉണ്ടാക്കൂ!"
              : "No decks saved yet. Generate or try a sample deck to see it here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((d) => {
            const isSample = d.id.startsWith("demo-");
            const title =
              uiLang === d.lang ? d.title : d.title_en || d.title;

            return (
              <div
                key={d.id}
                className="brutal-panel p-4 bg-[var(--paper)] hover:bg-[#FFE600] hover:text-black transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 border border-[var(--ink)] ${
                        d.lang === "ml"
                          ? "bg-[#FF3D00] text-white"
                          : "bg-[#0038FF] text-white"
                      }`}
                    >
                      {d.lang === "ml" ? "മലയാളം" : "English"}
                    </span>

                    {isSample ? (
                      <span className="bg-[#FFE600] text-black border border-black text-[10px] font-mono font-bold px-1.5 py-0.2">
                        Sample
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDeck(d.id);
                        }}
                        className="p-1 hover:bg-[#FF3D00] hover:text-white border border-transparent hover:border-black transition-colors"
                        title={isMl ? "ഡിലീറ്റ് ചെയ്യുക" : "Delete Deck"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectDeck(d)}
                    className={`font-bold text-base sm:text-lg text-[var(--text-primary)] group-hover:text-black leading-snug ${
                      uiLang === "ml" || d.lang === "ml" ? "font-mal" : ""
                    }`}
                  >
                    {title}
                  </h3>
                </div>

                <div
                  onClick={() => onSelectDeck(d)}
                  className="mt-4 pt-3 border-t-2 border-[var(--ink)]/20 flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] group-hover:text-black"
                >
                  <span>
                    {d.quiz.length}Q · {d.cards.length} cards
                  </span>
                  <span className="font-bold underline flex items-center gap-1">
                    <span>{isMl ? "തുറക്കുക" : "Open"}</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
