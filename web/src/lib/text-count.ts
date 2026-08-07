const CJK_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;

export function containsCJK(text: string): boolean {
  return CJK_REGEX.test(text);
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function countChars(text: string): number {
  return [...text].length;
}

export function countScript(text: string, unit: "words" | "chars"): number {
  return unit === "words" ? countWords(text) : countChars(text);
}
