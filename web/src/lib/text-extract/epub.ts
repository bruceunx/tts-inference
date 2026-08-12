import JSZip from "jszip";
import * as cheerio from "cheerio";
import type { ExtractedDocument, Chapter } from "./types";

export async function extractEpub(buffer: Buffer): Promise<ExtractedDocument> {
  const zip = await JSZip.loadAsync(buffer);

  const containerXml = await zip
    .file("META-INF/container.xml")!
    .async("string");
  const opfPath = cheerio
    .load(containerXml, { xmlMode: true })("rootfile")
    .attr("full-path")!;
  const opfDir = opfPath.includes("/")
    ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1)
    : "";

  const opfXml = await zip.file(opfPath)!.async("string");
  const $opf = cheerio.load(opfXml, { xmlMode: true });

  const manifest = new Map<string, string>(); // id -> href
  $opf("manifest item").each((_, el) => {
    manifest.set($opf(el).attr("id")!, $opf(el).attr("href")!);
  });

  const spineIds: string[] = [];
  $opf("spine itemref").each((_, el) => {
    spineIds.push($opf(el).attr("idref")!);
  });

  const chapters: Chapter[] = [];
  for (const id of spineIds) {
    const href = manifest.get(id);
    if (!href) continue;

    const filePath = opfDir + href;
    const file = zip.file(filePath);
    if (!file) continue;

    const html = await file.async("string");
    const $ = cheerio.load(html);
    $("script, style").remove();

    const title = $("h1, h2").first().text().trim() || href;
    const text = $("body")
      .text()
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (text) chapters.push({ title, text });
  }

  return { chapters };
}
