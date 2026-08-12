import { extractPdf } from "./pdf";
import { extractEpub } from "./epub";
import type { ExtractedDocument } from "./types";

export * from "./types";

export async function extractText(
  buffer: Buffer,
  mimeType: string,
): Promise<ExtractedDocument> {
  if (mimeType === "application/pdf") return extractPdf(buffer);
  if (mimeType === "application/epub+zip") return extractEpub(buffer);
  throw new Error(`Unsupported file type: ${mimeType}`);
}
