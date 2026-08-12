import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/text-extract";

const EXT_MIME: Record<string, string> = {
  pdf: "application/pdf",
  epub: "application/epub+zip",
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (ext === "txt") {
    return NextResponse.json({
      chapters: [{ title: file.name, text: buffer.toString("utf-8") }],
    });
  }

  const mimeType = EXT_MIME[ext];
  if (!mimeType) {
    return NextResponse.json(
      { error: `Unsupported file type: .${ext}` },
      { status: 400 },
    );
  }

  try {
    const doc = await extractText(buffer, mimeType);
    return NextResponse.json(doc);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 422 },
    );
  }
}
