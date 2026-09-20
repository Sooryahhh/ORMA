import type { Deck } from "../types.js";

function escapeCSV(val: string | null | undefined): string {
  const str = val == null ? "" : String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

export function exportDeckCardsToCSV(deck: Deck): { filename: string; count: number } {
  const rows: string[][] = [
    ["Front", "Back", "Front (English/Alternate)", "Back (English/Alternate)"]
  ];

  for (const card of deck.cards) {
    rows.push([
      card.front,
      card.back,
      card.front_en,
      card.back_en
    ]);
  }

  // Prepend UTF-8 BOM for Malayalam Unicode support in Excel & Anki
  const csvContent = "\ufeff" + rows.map((r) => r.map(escapeCSV).join(",")).join("\r\n");

  const safeTitle = (deck.title_en || deck.title || "orma-deck")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32);

  const filename = `${safeTitle || "flashcards"}-anki.csv`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return { filename, count: deck.cards.length };
}
