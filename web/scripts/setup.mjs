import { execSync } from "node:child_process";
import { existsSync, mkdirSync, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const BIN_DIR = path.join(ROOT, "bin");
const MODEL_DIR = path.join(ROOT, "model");
const REPO = "CrispStrobe/CrispASR";
const IS_WIN = os.platform() === "win32";
const BIN_NAME = IS_WIN ? "crispasr.exe" : "crispasr";

mkdirSync(BIN_DIR, { recursive: true });
mkdirSync(MODEL_DIR, { recursive: true });

function assetName() {
  const plat = os.platform();
  const arch = os.arch(); // 'x64' | 'arm64'
  if (plat === "win32") return "crispasr-windows-x64.zip";
  if (plat === "darwin") return "crispasr-macos.tar.gz";
  if (plat === "linux") {
    return arch === "arm64"
      ? "crispasr-linux-arm64.tar.gz"
      : "crispasr-linux-x86_64.tar.gz"; // swap for -cuda/-vulkan variant if you want GPU
  }
  throw new Error(`unsupported platform: ${plat}`);
}

async function fetchLatestTag() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/releases/latest`,
  );
  if (!res.ok)
    throw new Error(`failed to resolve latest release: ${res.status}`);
  const { tag_name } = await res.json();
  return tag_name;
}

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`failed to fetch ${url}: ${res.status}`);
  await pipeline(res.body, createWriteStream(dest));
}

async function installCrispasr() {
  const target = path.join(BIN_DIR, BIN_NAME);
  if (existsSync(target)) return;

  const tag = await fetchLatestTag();
  const asset = assetName();
  const url = `https://github.com/${REPO}/releases/download/${tag}/${asset}`;
  const archivePath = path.join(BIN_DIR, asset);

  console.log(`==> downloading ${asset} (${tag})`);
  await downloadFile(url, archivePath);

  console.log("==> extracting");
  if (asset.endsWith(".zip")) {
    // tar handles zip extraction fine on modern Windows too; fall back to PowerShell if needed
    execSync(`tar -xf "${archivePath}" -C "${BIN_DIR}"`);
  } else {
    execSync(`tar -xzf "${archivePath}" -C "${BIN_DIR}"`);
  }

  const extracted = path.join(BIN_DIR, BIN_NAME);
  if (!existsSync(extracted)) {
    throw new Error(
      `expected ${BIN_NAME} after extracting ${asset}, not found`,
    );
  }
  if (!IS_WIN) execSync(`chmod +x "${extracted}"`);
}

async function downloadModel(repo, file) {
  const dest = path.join(MODEL_DIR, file);
  if (existsSync(dest)) return;
  console.log(`==> downloading ${file}`);
  await downloadFile(
    `https://huggingface.co/${repo}/resolve/main/${file}`,
    dest,
  );
}

await installCrispasr();
await downloadModel(
  "cstr/chatterbox-turbo-GGUF",
  "chatterbox-turbo-t3-q8_0.gguf",
);
await downloadModel(
  "cstr/chatterbox-turbo-GGUF",
  "chatterbox-turbo-s3gen-q8_0.gguf",
);
await downloadModel(
  "cstr/qwen3-tts-1.7b-base-GGUF",
  "qwen3-tts-12hz-1.7b-base-q8_0.gguf",
);
await downloadModel("ggerganov/whisper.cpp", "ggml-base.bin");

console.log("==> setup complete");
