import React, { useState, useRef } from "react";
import { Upload, FileText, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import type { Lang } from "../types.js";
import { SAMPLE_TEXTS } from "../data/samples.js";
import { detectScript, extractTextFromFile } from "../utils/pdfReader.js";

interface SourceInputProps {
  uiLang: Lang;
  onGenerate: (text: string, lang: Lang) => void;
  isLoading: boolean;
}

export const SourceInput: React.FC<SourceInputProps> = ({
  uiLang,
  onGenerate,
  isLoading,
}) => {
  const isMl = uiLang === "ml";
  const [activeTab, setActiveTab] = useState<"file" | "paste" | "sample">("file");
  const [text, setText] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileStatus, setFileStatus] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [overrideLang, setOverrideLang] = useState<"auto" | "en" | "ml">("auto");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const scriptAnalysis = detectScript(text);
  const detectedLang: Lang = overrideLang === "auto" ? scriptAnalysis.lang : overrideLang;

  const charCount = text.length;
  const maxChars = 12000;
  const percentFilled = Math.min(100, Math.round((charCount / maxChars) * 100));
  const isReady = charCount >= 40 && !isLoading;

  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);
    setFileName(file.name);
    try {
      const extracted = await extractTextFromFile(file, (msg) => setFileStatus(msg));
      setText(extracted);
      setFileStatus(`${extracted.length.toLocaleString()} characters loaded`);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not read this file.");
      setFileStatus(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleSampleClick = (key: "en" | "ml") => {
    setText(SAMPLE_TEXTS[key]);
    setActiveTab("paste");
    setFileName(null);
    setFileStatus(null);
  };

  const handleSubmit = () => {
    if (!isReady) return;
    onGenerate(text, detectedLang);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left panel: Source Selectors */}
      <div className="lg:col-span-7 brutal-panel p-5 bg-[var(--paper)]">
        {/* Source Mode Tabs */}
        <div className="flex border-3 border-[var(--ink)] mb-5 bg-[var(--paper-2)]">
          <button
            onClick={() => setActiveTab("file")}
            className={`flex-1 py-2.5 px-3 font-mono text-xs sm:text-sm font-bold uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "file"
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "hover:bg-[var(--paper)] text-[var(--text-primary)]"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isMl ? "ഫയൽ" : "Upload File"}</span>
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex-1 py-2.5 px-3 font-mono text-xs sm:text-sm font-bold uppercase border-l-3 border-[var(--ink)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "paste"
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "hover:bg-[var(--paper)] text-[var(--text-primary)]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isMl ? "ഒട്ടിക്കുക" : "Paste Notes"}</span>
          </button>
          <button
            onClick={() => setActiveTab("sample")}
            className={`flex-1 py-2.5 px-3 font-mono text-xs sm:text-sm font-bold uppercase border-l-3 border-[var(--ink)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "sample"
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "hover:bg-[var(--paper)] text-[var(--text-primary)]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMl ? "സാമ്പിൾ" : "Try Sample"}</span>
          </button>
        </div>

        {/* Tab Content: Upload File */}
        {activeTab === "file" && (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-3 border-dashed border-[var(--ink)] p-8 text-center cursor-pointer transition-colors ${
                isDragging ? "bg-[#FFE600] text-black" : "bg-[var(--paper-2)] hover:opacity-90"
              }`}
            >
              <Upload className="w-10 h-10 mx-auto mb-2 stroke-[2.5]" />
              <b className="block font-display text-lg uppercase tracking-tight text-[var(--text-primary)]">
                {fileName || (isMl ? "PDF അല്ലെങ്കിൽ TXT ഇവിടെ ഇടൂ" : "Drop a PDF or TXT here")}
              </b>
              <span className="font-mono text-xs text-[var(--text-secondary)] block mt-1">
                {fileStatus ||
                  (isMl
                    ? "ക്ലാസ് നോട്ട്സ്, പാഠപുസ്തക അധ്യായം, സിലബസ്"
                    : "or click to browse — lecture notes, textbook chapters, slides")}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />
            <p className="font-mono text-[11px] text-[var(--text-muted)] mt-2">
              {isMl
                ? "PDF നിങ്ങളുടെ ബ്രൗസറിൽ നേരിട്ട് വായിക്കുന്നു. സ്വകാര്യവും സുരക്ഷിതവുമാണ്."
                : "PDFs are processed client-side. The extracted text is then revved through Gemini."}
            </p>
          </div>
        )}

        {/* Tab Content: Paste Text */}
        {activeTab === "paste" && (
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                isMl
                  ? "പഠന കുറിപ്പുകൾ ഇവിടെ ഒട്ടിക്കുക (ഉദാ: ബയോളജി, കമ്പ്യൂട്ടർ സയൻസ്, ഹിസ്റ്ററി)..."
                  : "Paste your raw study notes, lecture excerpts, or textbook text here..."
              }
              className={`w-full min-h-[220px] p-3.5 border-3 border-[var(--ink)] font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-4 focus:ring-[#0038FF] bg-[var(--paper)] text-[var(--text-primary)] ${
                detectedLang === "ml" ? "font-mal text-base" : ""
              }`}
            />
            <div className="flex justify-between items-center mt-1 text-[11px] font-mono text-[var(--text-muted)]">
              <span>{isMl ? "ടെക്സ്റ്റ് നേരിട്ട് നൽകാം" : "Raw text or markdown supported"}</span>
              {text.length > 0 && (
                <button
                  onClick={() => setText("")}
                  className="hover:text-[#FF3D00] underline font-bold cursor-pointer"
                >
                  {isMl ? "മായ്ക്കുക" : "Clear"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Sample Notes */}
        {activeTab === "sample" && (
          <div className="space-y-3">
            <button
              onClick={() => handleSampleClick("en")}
              className="w-full text-left brutal-panel p-3.5 flex items-center gap-3.5 bg-[var(--paper)] hover:bg-[#FFE600] hover:text-black transition-colors cursor-pointer group"
            >
              <span className="w-10 h-10 flex-none border-2 border-[var(--ink)] bg-[#0038FF] text-white font-mono font-bold text-xs flex items-center justify-center">
                EN
              </span>
              <div>
                <b className="block text-sm sm:text-base font-bold leading-snug group-hover:text-black">
                  Computer Networks — TCP vs UDP
                </b>
                <span className="font-mono text-xs opacity-80 block group-hover:text-black">
                  Transport layer handshake, reliability, sliding window, QUIC
                </span>
              </div>
            </button>

            <button
              onClick={() => handleSampleClick("ml")}
              className="w-full text-left brutal-panel p-3.5 flex items-center gap-3.5 bg-[var(--paper)] hover:bg-[#FFE600] hover:text-black transition-colors cursor-pointer group"
            >
              <span className="w-10 h-10 flex-none border-2 border-[var(--ink)] bg-[#FF3D00] text-white font-mal font-bold text-base flex items-center justify-center">
                മ
              </span>
              <div>
                <b className="block text-sm sm:text-base font-mal font-bold leading-snug group-hover:text-black">
                  പ്രകാശസംശ്ലേഷണം (Photosynthesis)
                </b>
                <span className="font-mono text-xs opacity-80 block group-hover:text-black">
                  ഹരിതകം, പ്രകാശഘട്ടം, ഇരുൾഘട്ടം, കാർബൺ ഡൈ ഓക്സൈഡ്
                </span>
              </div>
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 border-3 border-[var(--ink)] bg-[#FF3D00] text-white font-mono text-xs flex items-center gap-2 shadow-[3px_3px_0_var(--ink)]">
            <AlertCircle className="w-4 h-4 flex-none" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Right panel: Deck Generation Control */}
      <div className="lg:col-span-5 brutal-panel p-5 bg-[var(--paper-2)] flex flex-col justify-between">
        <div className="space-y-4">
          {/* Script Detection Card */}
          <div className="border-3 border-[var(--ink)] p-3.5 bg-[#FFE600] text-black shadow-[3px_3px_0_var(--ink)] flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black bg-white text-black flex items-center justify-center font-display text-lg">
              {charCount === 0 ? "—" : detectedLang === "ml" ? "മ" : "EN"}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider block text-neutral-800">
                {isMl ? "തിരിച്ചറിഞ്ഞ ഭാഷ" : "Detected Script"}
              </span>
              <b className={`text-sm sm:text-base truncate block text-black ${isMl ? "font-mal" : ""}`}>
                {charCount === 0
                  ? isMl
                    ? "നോട്ട്സ് നൽകിയിട്ടില്ല"
                    : "Awaiting input notes"
                  : detectedLang === "ml"
                  ? isMl
                    ? "മലയാളം ലിപി കണ്ടെത്തി"
                    : "Malayalam Script detected"
                  : isMl
                  ? "ഇംഗ്ലീഷ് ലിപി കണ്ടെത്തി"
                  : "English Script detected"}
              </b>
            </div>

            {/* Language override */}
            <select
              value={overrideLang}
              onChange={(e) => setOverrideLang(e.target.value as any)}
              className="border-2 border-black bg-white text-black px-2 py-1 font-mono text-xs font-bold cursor-pointer"
              aria-label="Override detected language"
            >
              <option value="auto">{isMl ? "ഓട്ടോ" : "Auto"}</option>
              <option value="en">English</option>
              <option value="ml">മലയാളം</option>
            </select>
          </div>

          {/* Character meter */}
          <div className="p-3.5 border-3 border-[var(--ink)] bg-[var(--paper)] shadow-[3px_3px_0_var(--ink)]">
            <div className="flex justify-between text-xs font-mono font-bold mb-1.5 text-[var(--text-primary)]">
              <span>{isMl ? "അക്ഷരങ്ങളുടെ എണ്ണം" : "Characters loaded"}</span>
              <span>
                {charCount.toLocaleString()} / {maxChars.toLocaleString()}
              </span>
            </div>
            <div className="h-3 border-2 border-[var(--ink)] bg-[var(--paper-2)] overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  charCount < 40 ? "bg-neutral-400" : "bg-[#0038FF]"
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[10.5px] font-mono text-[var(--text-muted)]">
              <span>{charCount < 40 ? (isMl ? "കുറഞ്ഞത് 40 അക്ഷരങ്ങൾ വേണം" : "Min 40 characters") : (isMl ? "റെഡിയാണ്" : "Ready to generate")}</span>
              <span>{percentFilled}%</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={!isReady}
            className={`w-full py-4 px-6 brutal-btn bg-[#FF3D00] text-white font-display text-xl sm:text-2xl tracking-wide uppercase flex items-center justify-center gap-2 ${
              isReady ? "hover:bg-[#e03600]" : ""
            } ${isMl ? "font-mal font-extrabold text-xl" : ""}`}
          >
            <span>{isMl ? "ഡെക്ക് ഉണ്ടാക്കൂ" : "MAKE MY DECK"}</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
          <p className="font-mono text-[11px] text-[var(--text-muted)] text-center mt-2.5 leading-snug">
            {isMl
              ? "6 ക്വിസ് ചോദ്യങ്ങൾ, 8 ഫ്ലാഷ്കാർഡുകൾ, പദാവലി, ശബ്ദ സംഗ്രഹം — രണ്ട് ഭാഷയിലും ഒരുമിച്ച് ലഭ്യമാകും."
              : "Produces 6 quiz questions, 8 flashcards, 6 glossary terms, and a spoken 1-minute recap in both languages."}
          </p>
        </div>
      </div>
    </div>
  );
};
