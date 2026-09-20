import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Lang } from "../types.js";

interface LoadingModalProps {
  isOpen: boolean;
  uiLang: Lang;
  onCancel: () => void;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  uiLang,
  onCancel,
}) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setElapsed(0);
      return;
    }
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const isMl = uiLang === "ml";

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="brutal-panel max-w-md w-full p-6 sm:p-8 bg-[var(--paper)] text-center shadow-[8px_8px_0_#FFE600] border-4 border-[var(--ink)]">
        <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-[var(--text-primary)] mb-2">
          {isMl ? "നോട്ട്സ് അപഗ്രഥിക്കുന്നു" : "ANALYZING YOUR NOTES"}
        </h3>

        <p
          className={`font-mono text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed ${
            isMl ? "font-mal" : ""
          }`}
        >
          {isMl
            ? "പരീക്ഷയ്ക്ക് ആവശ്യമായ പ്രധാന ആശയങ്ങൾ, ക്വിസ്, ഫ്ലാഷ്കാർഡുകൾ എന്നിവ തയ്യാറാക്കുന്നു..."
            : "Generating bilingual quiz questions, high-yield flashcards, glossary, and spoken audio recap..."}
        </p>

        {/* Brutalist pulsing indicator */}
        <div className="flex justify-center gap-2 mb-6">
          <span className="w-3.5 h-3.5 border-2 border-[var(--ink)] bg-[var(--ink)] animate-pulse" />
          <span
            className="w-3.5 h-3.5 border-2 border-[var(--ink)] bg-[#FF3D00] animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-3.5 h-3.5 border-2 border-[var(--ink)] bg-[#0038FF] animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
          <span
            className="w-3.5 h-3.5 border-2 border-[var(--ink)] bg-[#FFE600] animate-pulse"
            style={{ animationDelay: "450ms" }}
          />
        </div>

        <div className="font-mono text-xs text-[var(--text-muted)] mb-6">
          {isMl ? "സമയം:" : "Elapsed:"} {elapsed}s
        </div>

        <button
          onClick={onCancel}
          className="w-full py-2.5 brutal-btn bg-[#FF3D00] hover:bg-[#e03600] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>{isMl ? "റദ്ദാക്കുക" : "Cancel Generation"}</span>
        </button>
      </div>
    </div>
  );
};
