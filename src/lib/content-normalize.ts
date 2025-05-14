export function extractTextsFromRawContent(raw: string): { texts: string[] } {
  if (!raw || typeof raw !== "string") return { texts: [] };

  const clean = raw
    .replace(/\r/g, "")
    .replace(/\\n/g, "\n") // normaliza \n
    .replace(/\*\*(.*?)\*\*/g, "$1") // remove markdown bold
    .trim();

  // Ignora changelogs (ex: markdown com muitos commits/links)
  const changelogLinks = clean.match(/\(\[.*?\]\(http.*?\)\)/g);
  if (changelogLinks && changelogLinks.length > 3) return { texts: [] };

  const result: string[] = [];

  // Captura blocos do tipo: texto 1 - conteúdo...
  const numberedRegex = /(?:^|\n)(?:texto|TEXTO)?\s*(\d{1,3})\s*[-–:]\s*(.+?)(?=(?:\n(?:texto|TEXTO)?\s*\d{1,3}\s*[-–:])|\n*$)/gis;

  const matches = [...clean.matchAll(numberedRegex)];
  for (const match of matches) {
    const content = match[2] ? match[2].trim() : "";
    if (content.length > 12) result.push(content);
  }

  // Fallback: quebra por parágrafo
  if (result.length === 0) {
    result.push(
      ...clean
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter((s) => s.length > 12)
    );
  }

  return {
    texts: result,
  };
}
