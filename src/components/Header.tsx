import React from "react";
import { Layers, Sun, Moon } from "lucide-react";
import type { Lang } from "../types.js";

interface HeaderProps {
  lang: Lang;
  onToggleLang: (lang: Lang) => void;
  savedDecksCount: number;
  onOpenLibrary: () => void;
  isLibraryOpen: boolean;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  savedDecksCount,
  onOpenLibrary,
  isLibraryOpen,
  theme,
  onToggleTheme,
}) => {
  const isMl = lang === "ml";
  const isDark = theme === "dark";

  return (
    <header className="border-b-4 border-[var(--ink)] pb-4 mb-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl sm:text-6xl tracking-tight uppercase leading-none text-[var(--text-primary)]">
              ORMA
            </h1>
          </div>
          <p
            className={`font-mono text-xs sm:text-sm mt-2 max-w-xl text-[var(--text-secondary)] leading-relaxed ${
              isMl ? "font-mal" : ""
            }`}
          >
            {isMl
              ? "നിങ്ങളുടെ നോട്ട്സ് നൽകൂ. നിമിഷങ്ങൾക്കുള്ളിൽ ക്വിസ്, ഫ്ലാഷ്കാർഡുകൾ, ഒരു മിനിറ്റ് സംഗ്രഹം — ഇംഗ്ലീഷിലും മലയാളത്തിലും."
              : "Drop in your lecture notes. Get a full exam-ready quiz, 3D flashcards, glossary, and a one-minute spoken recap in seconds."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            className="brutal-btn p-2 sm:px-3 sm:py-1.5 font-mono text-xs sm:text-sm font-bold bg-[var(--paper)] text-[var(--text-primary)] hover:bg-[var(--yellow)] hover:text-black flex items-center gap-1.5 cursor-pointer"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-[var(--yellow)] stroke-[2.5]" />
                <span className="hidden sm:inline uppercase">{isMl ? "ലൈറ്റ്" : "Light"}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-black stroke-[2.5]" />
                <span className="hidden sm:inline uppercase">{isMl ? "ഡാർക്ക്" : "Dark"}</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <div
            className="flex border-3 border-[var(--ink)] bg-[var(--paper)] shadow-[4px_4px_0_var(--ink)] overflow-hidden"
            role="group"
            aria-label="Interface language"
          >
            <button
              onClick={() => onToggleLang("en")}
              className={`px-3.5 py-1.5 font-mono text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                lang === "en"
                  ? isDark
                    ? "bg-white text-black"
                    : "bg-black text-[#FFE600]"
                  : "hover:bg-[var(--paper-2)] text-[var(--text-primary)]"
              }`}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLang("ml")}
              className={`px-3.5 py-1.5 font-mal text-xs sm:text-sm font-bold border-l-2 border-[var(--ink)] transition-colors cursor-pointer ${
                lang === "ml"
                  ? isDark
                    ? "bg-white text-black"
                    : "bg-black text-[#FFE600]"
                  : "hover:bg-[var(--paper-2)] text-[var(--text-primary)]"
              }`}
              aria-pressed={lang === "ml"}
            >
              മലയാളം
            </button>
          </div>

          {/* Library Button */}
          <button
            onClick={onOpenLibrary}
            className={`brutal-btn px-4 py-2 text-xs sm:text-sm font-mono font-bold uppercase flex items-center gap-2 cursor-pointer ${
              isLibraryOpen
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "bg-[var(--paper)] text-[var(--text-primary)] hover:bg-[var(--yellow)] hover:text-black"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isMl ? "ഡെക്കുകൾ" : "My Decks"}</span>
            <span className="bg-[#FFE600] text-black border border-black px-1.5 py-0.2 text-[11px] font-bold">
              {savedDecksCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
