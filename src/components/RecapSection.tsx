import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, FileText, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import type { Deck, Lang } from "../types.js";
import { speakText, stopSpeaking, findBestVoice } from "../utils/speech.js";

interface RecapSectionProps {
  deck: Deck;
  uiLang: Lang;
}

export const RecapSection: React.FC<RecapSectionProps> = ({ deck, uiLang }) => {
  const isMl = uiLang === "ml";
  const [audioLang, setAudioLang] = useState<Lang>(uiLang);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string>("");
  const [showScript, setShowScript] = useState<boolean>(false);
  const [waveHeights, setWaveHeights] = useState<number[]>(
    Array.from({ length: 24 }, () => 20)
  );

  const waveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync audio language if user explicitly toggles UI language
  useEffect(() => {
    setAudioLang(uiLang);
  }, [uiLang]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, []);

  // Update voice notice when audio language changes
  useEffect(() => {
    const { voice, isExact } = findBestVoice(audioLang);
    if (!voice) {
      setVoiceNotice(
        audioLang === "ml"
          ? "നിങ്ങളുടെ ബ്രൗസറിൽ മലയാളം ശബ്ദം കണ്ടെത്തിയില്ല. ഇംഗ്ലീഷ് ഓഡിയോ ലഭ്യമാണ്."
          : "No speech voice found in browser."
      );
    } else if (audioLang === "ml" && !isExact) {
      setVoiceNotice("Malayalam voice not installed on device; playing with system voice.");
    } else {
      setVoiceNotice(`Using voice: ${voice.name} (${voice.lang})`);
    }
  }, [audioLang]);

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      setWaveHeights(Array.from({ length: 24 }, () => 20));
      return;
    }

    const scriptText =
      audioLang === deck.lang
        ? deck.audio_script
        : deck.audio_script_en || deck.audio_script;

    const res = speakText(scriptText, audioLang, {
      onStart: () => {
        setIsPlaying(true);
        waveIntervalRef.current = setInterval(() => {
          setWaveHeights(
            Array.from({ length: 24 }, () => 18 + Math.floor(Math.random() * 80))
          );
        }, 120);
      },
      onEnd: () => {
        setIsPlaying(false);
        if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
        setWaveHeights(Array.from({ length: 24 }, () => 20));
      },
      onError: () => {
        setIsPlaying(false);
        if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
        setWaveHeights(Array.from({ length: 24 }, () => 20));
      },
    });

    if (res.fellBack) {
      setVoiceNotice(
        isMl
          ? "മലയാളം ശബ്ദം ഇൻസ്റ്റാൾ ചെയ്തിട്ടില്ലാത്തതിനാൽ ലഭ്യമായ ശബ്ദത്തിൽ വായിക്കുന്നു."
          : "Native Malayalam voice not installed; falling back to default voice."
      );
    }
  };

  const primarySummary =
    uiLang === deck.lang ? deck.summary : deck.summary_en || deck.summary;
  const secondarySummary =
    uiLang === deck.lang ? deck.summary_en : deck.summary;

  const currentScript =
    audioLang === deck.lang
      ? deck.audio_script
      : deck.audio_script_en || deck.audio_script;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 5-point Key Takeaways */}
      <div className="lg:col-span-7 brutal-panel p-5 bg-[var(--paper)]">
        <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-[var(--text-secondary)] mb-4 pb-2 border-b-2 border-[var(--ink)] flex items-center justify-between">
          <span>{isMl ? "പ്രധാന ആശയങ്ങൾ (5 പോയിന്റുകൾ)" : "Key Takeaways (5 Bullet Points)"}</span>
          <span className="text-[11px] bg-[#FFE600] px-2 py-0.5 border border-black text-black">
            Bilingual
          </span>
        </h3>

        <ul className="space-y-4">
          {primarySummary.map((item, index) => {
            const secondary = secondarySummary?.[index];
            const badgeBg =
              index % 3 === 0
                ? "bg-[#0038FF] text-white"
                : index % 3 === 1
                ? "bg-[#FF3D00] text-white"
                : "bg-[#FFE600] text-black";

            return (
              <li key={index} className="flex items-start gap-3.5">
                <span
                  className={`w-7 h-7 flex-none border-2 border-[var(--ink)] font-mono font-bold text-sm flex items-center justify-center ${badgeBg}`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm sm:text-base font-medium text-[var(--text-primary)] leading-relaxed ${
                      uiLang === "ml" ? "font-mal text-base" : ""
                    }`}
                  >
                    {item}
                  </p>
                  {secondary && (
                    <p
                      className={`text-xs font-mono text-[var(--text-secondary)] mt-0.5 leading-normal ${
                        uiLang === "en" ? "font-mal text-sm" : ""
                      }`}
                    >
                      {secondary}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Spoken Audio Player */}
      <div className="lg:col-span-5 brutal-panel p-5 bg-[#121212] text-white shadow-[6px_6px_0_var(--ink)] border-3 border-[var(--ink)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-xl uppercase tracking-tight text-[#FFE600] flex items-center gap-2">
            <Volume2 className="w-5 h-5 stroke-[2.5]" />
            {isMl ? "ഒരു മിനിറ്റ് സംഗ്രഹം" : "One-Minute Spoken Recap"}
          </h3>
        </div>

        <p className="font-mono text-xs text-neutral-300 mb-4">
          {isMl
            ? "പരീക്ഷയ്ക്ക് മുൻപ് കേൾക്കാവുന്ന ദ്രുത ശബ്ദ സംഗ്രഹം"
            : "Listen to the high-yield spoken script generated from your notes"}
        </p>

        {/* Audio Track Selector */}
        <div className="flex border-2 border-white mb-4 w-fit overflow-hidden bg-neutral-900">
          <button
            onClick={() => {
              if (audioLang !== "en") {
                stopSpeaking();
                setIsPlaying(false);
                setAudioLang("en");
              }
            }}
            className={`px-3 py-1 font-mono text-xs font-bold transition-colors cursor-pointer ${
              audioLang === "en" ? "bg-[#FFE600] text-black" : "text-white hover:bg-neutral-800"
            }`}
            aria-pressed={audioLang === "en"}
          >
            EN Track
          </button>
          <button
            onClick={() => {
              if (audioLang !== "ml") {
                stopSpeaking();
                setIsPlaying(false);
                setAudioLang("ml");
              }
            }}
            className={`px-3 py-1 font-mal text-xs font-bold border-l-2 border-white transition-colors cursor-pointer ${
              audioLang === "ml" ? "bg-[#FFE600] text-black" : "text-white hover:bg-neutral-800"
            }`}
            aria-pressed={audioLang === "ml"}
          >
            മലയാളം
          </button>
        </div>

        {/* Player Controls & Waveform */}
        <div className="flex items-center gap-4 bg-neutral-900 border-2 border-neutral-700 p-3 mb-3">
          <button
            onClick={togglePlay}
            className="w-13 h-13 flex-none border-2 border-white bg-[#FF3D00] hover:bg-[#e03600] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-[2px_2px_0_#fff]"
            aria-label={isPlaying ? "Pause audio recap" : "Play audio recap"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white text-white" />
            ) : (
              <Play className="w-6 h-6 fill-white text-white ml-0.5" />
            )}
          </button>

          {/* Equalizer Waveform */}
          <div className="flex-1 flex items-center gap-1 h-10 px-1 overflow-hidden">
            {waveHeights.map((h, i) => (
              <i
                key={i}
                className={`flex-1 transition-all duration-150 ${
                  isPlaying ? "bg-[#FFE600]" : "bg-[#0038FF]"
                }`}
                style={{ height: `${h}%`, minHeight: "15%" }}
              />
            ))}
          </div>
        </div>

        {/* Voice Diagnostics */}
        {voiceNotice && (
          <p className="font-mono text-[11px] text-neutral-400 mb-3 leading-tight flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-none mt-0.5 text-[#FFE600]" />
            <span>{voiceNotice}</span>
          </p>
        )}

        {/* Transcript Toggle Button */}
        <button
          onClick={() => setShowScript(!showScript)}
          className="w-full py-2 px-3 border-2 border-white bg-white text-black font-mono text-xs font-bold uppercase hover:bg-[#FFE600] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>
            {showScript
              ? isMl
                ? "എഴുത്ത് മറയ്ക്കുക"
                : "Hide Transcript"
              : isMl
              ? "എഴുത്ത് കാണിക്കുക"
              : "Read Spoken Transcript"}
          </span>
          {showScript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showScript && (
          <div className="mt-3 p-3 border-2 border-neutral-600 bg-neutral-900 font-mono text-xs text-neutral-200 leading-relaxed max-h-48 overflow-y-auto">
            <p className={audioLang === "ml" ? "font-mal text-sm leading-relaxed" : ""}>
              {currentScript}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
