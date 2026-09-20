export type Lang = 'en' | 'ml';

export interface TermItem {
  term: string;
  term_en: string;
  meaning: string;
  meaning_en: string;
}

export interface QuizQuestion {
  q: string;
  q_en: string;
  options: string[];
  options_en: string[];
  answer: number;
  why: string;
  why_en: string;
}

export interface FlashCard {
  front: string;
  front_en: string;
  back: string;
  back_en: string;
}

export interface Deck {
  id: string;
  lang: Lang;
  ts: number;
  title: string;
  title_en: string;
  summary: string[];
  summary_en: string[];
  audio_script: string;
  audio_script_en: string;
  terms: TermItem[];
  quiz: QuizQuestion[];
  cards: FlashCard[];
  sourceNotes?: string;
  offline?: boolean;
}

export interface GenerateRequest {
  text: string;
  lang: Lang;
  targetModel?: string;
}

export interface GenerateResponse {
  deck?: Deck;
  error?: string;
  code?: string;
  modelUsed?: string;
  durationMs?: number;
}
