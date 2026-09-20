ORMA

Notes → Quiz, Flashcards & Audio — in English or Malayalam.

A bilingual study-buddy that turns a student's own notes into a quiz, flashcards, a glossary and a one-minute spoken recap — generated together in both languages, so nothing is lost switching languages mid-revision.

Team: CYPHER999
Track: AI & ML
Status: Prototype submission

Table of Contents
Problem
Solution
Target Users
Key Features
How It Works
Tech Stack
Getting Started
Project Structure
Known Limitations
Future Scope
Team
Problem

Every AI "notes to quiz" tool assumes the student studies in English. For SSLC, Plus-Two and undergraduate students across Kerala, that leaves out the language most of their own notes are actually written in.

No self-testing tool exists for Malayalam notes — students re-read instead of practising recall, the weakest way to prepare for an exam.
Bilingual textbooks meet English-only apps — a concept taught partly in English and partly in Malayalam has nowhere to be revised as one thing.
No audio option exists for commute-time revision — bus and walk time between school, tuition and home goes unused.
Solution

Drop in a PDF or pasted notes, in either language. ORMA detects the script automatically and asks Claude for a summary, a six-question quiz, eight flashcards and a glossary — built in English and Malayalam together in one generation pass, so the two versions carry the exact same facts and correct answers. Switch the interface language, or just the audio language, at any point without losing your place.

Target Users
PersonaUse case	
Malayalam-medium students (SSLC & Plus-Two)	Turn today's class notes into a self-test tonight, in the language they were taught in — not a translated approximation of it.
English-medium & exam aspirants (UG & competitive exams)	Convert dense English chapters into bite-size bilingual flashcards for commute-time audio revision.
Teachers	Turn a lesson's notes into a ready quiz in minutes, without writing distractor options by hand.
Key Features

All eight run in the current build — nothing here is mocked.

FeatureDescription	
Script detection	Unicode-block classifier tells English from Malayalam on paste or upload — no manual toggle needed.
Bilingual generation	One Claude call returns a matching quiz, cards and glossary in both languages — same facts, same answers.
Spoken recap	60-second audio in either language via the device's own voice, with a real ml-IN availability check.
In-browser PDF reading	pdf.js extracts lecture-note text client-side — nothing is uploaded to a server first.
Six-question quiz	Near-miss distractors, instant feedback, and a retry-what-you-missed round.
Flashcard review loop	Flip-to-reveal cards with an again/known cycle until the whole deck is known.
CSV export	Flashcards download in a format Anki and Quizlet import directly.
Deck library	Past decks persist locally (localStorage), so a student's work survives closing the tab.

Note: generation (summary/quiz/cards/audio script) requires access to the Claude API. Every other feature — quiz-taking, flashcard review, glossary, audio playback, CSV export, and the bundled sample deck — runs fully offline once notes are loaded.

How It Works
Add notes — upload a PDF, paste text, or pick a sample, in English or Malayalam.
Detect — Unicode script analysis identifies the language automatically.
Generate — one Claude call returns a bilingual summary, quiz, cards and audio script.
Study — recap, quiz, flashcards, glossary — flip languages any time.
Export — download flashcards as CSV into Anki or Quizlet for spaced repetition.
Tech Stack
LayerToolPurpose		
AI	Claude (Anthropic)	Structured bilingual JSON generation — summary, quiz, cards, glossary and audio script in one call.
UI	Vanilla HTML · CSS · JS	No framework, no build step — the whole app ships as a single self-contained file.
PDF parsing	pdf.js (Mozilla)	Extracts lecture-note text client-side.
Audio	Web Speech API	Browser-native text-to-speech, with ml-IN voice detection and an honest fallback.
Persistence	localStorage	Keeps a student's deck library on their own device — no account needed.
Export	Client-side CSV	Flashcards written directly to a CSV a student can import elsewhere.
Language ID	Custom Unicode classifier	Detects Malayalam vs. English by script block (U+0D00–U+0D7F).
Getting Started

ORMA is a single self-contained HTML file — there is no build step and no server required for most features.

bash

git clone https://github.com/<your-team>/orma.git
cd orma
open orma.html   # or double-click the file / drag it into a browser

Bilingual quiz, summary, flashcard and audio-script generation calls the Claude API. This works out of the box inside a Claude Artifact runtime; to run generation from a plain browser deployment (e.g. GitHub Pages), you will need to wire the app's sample/downloads calls to your own backend or API key, since a static site cannot hold a secret key safely client-side. Every other feature — the bundled sample deck, quiz-taking, flashcards, glossary, audio playback and CSV export — works with no setup.

Project Structure
orma/
├── orma.html          # entire application — markup, styles, and logic in one file
└── README.md
Known Limitations
Malayalam PDFs may extract poorly. Many Indian-language PDFs use legacy non-Unicode font encodings; pdf.js can return garbled text for these. Plain .txt or pasted text always works. A scanned/photographed PDF has no text layer at all — see Future Scope.
Malayalam text-to-speech depends on the device. Not every browser/OS ships an ml-IN voice. ORMA checks for one and falls back to the English audio track with a clear message rather than failing silently.
Future Scope

Next up

OCR for scanned notes — Tesseract's Malayalam model for PDFs that are photos, not text.
Teacher dashboard — aggregate quiz misses across a class to flag which concept needs re-teaching.
Spaced repetition — replace the simple again/known loop with SM-2-style scheduling across days.

Later

More regional languages — Tamil, Hindi and Kannada, using the same co-generation approach.
Offline-first mobile app — a PWA with a bundled voice, so audio revision needs no system voice at all.
Whole-syllabus ingestion — multiple chapters at once, clustered by topic.
Team

CYPHER999

NameRole
Soorya

Built with Claude · pdf.js · Web Speech API — one HTML file, no backend.
