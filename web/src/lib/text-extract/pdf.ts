import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type { ExtractedDocument } from "./types";

const FOOTER_MARGIN = 50; // px from bottom to drop as header/footer noise

export async function extractPdf(buffer: Buffer): Promise<ExtractedDocument> {
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
    .promise;
  const pages: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const { height } = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();

    let lastY: number | null = null;
    let line = "";
    const lines: string[] = [];

    for (const item of content.items as any[]) {
      const y = item.transform[5];
      if (y < FOOTER_MARGIN || y > height - FOOTER_MARGIN) continue; // skip header/footer band

      if (lastY !== null && Math.abs(y - lastY) > 2) {
        lines.push(line.trim());
        line = "";
      }
      line += item.str;
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());

    pages.push(lines.join("\n"));
  }

  // no structural chapter info in raw PDF text; treat whole doc as one chapter
  return { chapters: [{ title: "Document", text: pages.join("\n\n") }] };
}
