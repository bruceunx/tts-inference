import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { writeFile, unlink, readFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { MODEL_CONFIGS, type ModelId } from "@/lib/tts-config";

export const runtime = "nodejs";

const BIN =
  process.env.CRISPASR_BIN ?? path.resolve(process.cwd(), "../bin/crispasr");
const MODEL_DIR =
  process.env.CRISPASR_MODEL_DIR ?? path.resolve(process.cwd(), "../model");

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const voice = form.get("voice");
  const script = form.get("script");
  const modelId = form.get("model") as ModelId | null;

  if (
    !(voice instanceof File) ||
    typeof script !== "string" ||
    !script.trim()
  ) {
    return NextResponse.json(
      { error: "missing voice or script" },
      { status: 400 },
    );
  }
  const config = modelId && MODEL_CONFIGS[modelId];
  if (!config) {
    return NextResponse.json({ error: "unknown model" }, { status: 400 });
  }

  const dir = await mkdtemp(path.join(tmpdir(), "tts-"));
  const voicePath = path.join(dir, voice.name || "voice.wav");
  const outputPath = path.join(dir, "output.wav");
  await writeFile(voicePath, Buffer.from(await voice.arrayBuffer()));

  const args = [
    "-m",
    path.join(MODEL_DIR, config.model),
    "--backend",
    config.backend,
    "--voice",
    voicePath,
    "--i-have-rights",
    "--no-prints",
    "--no-spoken-disclaimer",
    "--no-watermark",
    "--no-c2pa",
    "--accept-marking-responsibility",
    "--tts",
    script,
    "--tts-output",
    outputPath,
  ];
  if (config.codecModel)
    args.push("--codec-model", path.join(MODEL_DIR, config.codecModel));

  try {
    await run(BIN, args);
    const audio = await readFile(outputPath);
    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(audio.length),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "generation failed" }, { status: 500 });
  } finally {
    await Promise.allSettled([unlink(voicePath), unlink(outputPath)]);
  }
}

function run(bin: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const proc = spawn(bin, args);
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d));
    proc.on("error", reject);
    proc.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(stderr || `exit ${code}`)),
    );
  });
}
