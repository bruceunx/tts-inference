"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModelSelect } from "@/components/landing/model-select";
import { MODEL_LIMITS, MODEL_IDS, type ModelId } from "@/lib/tts-config";
import { countScript, containsCJK } from "@/lib/text-count";

type Tab = "write" | "upload";

export function ScriptPanel({
  script,
  onScriptChangeAction,
  model,
  onModelChangeAction,
  disabled,
  generating,
  onGenerateAction,
}: {
  script: string;
  onScriptChangeAction: (script: string) => void;
  model: ModelId;
  onModelChangeAction: (id: ModelId) => void;
  disabled: boolean;
  generating: boolean;
  onGenerateAction: () => void;
}) {
  const t = useTranslations("Workspace");
  const limit = MODEL_LIMITS[model] ?? MODEL_LIMITS[MODEL_IDS[0]];
  const count = countScript(script, limit.unit);
  const overLimit = count > limit.max;
  const languageMismatch = model === "en" && containsCJK(script);

  const [tab, setTab] = useState<Tab>("write");
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["txt", "pdf", "epub"].includes(ext)) {
      setFileError(t("scriptFormatError"));
      return;
    }
    setExtracting(true);
    setFileError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/extract-text", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error();
      const doc = (await res.json()) as {
        chapters: { title: string; text: string }[];
      };
      const text = doc.chapters.map((c) => c.text).join("\n\n");
      onScriptChangeAction(text);
      setTab("write");
    } catch {
      setFileError(t("scriptFormatError"));
    } finally {
      setExtracting(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-mono text-primary">
        <span>{t("step2")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h3 className="mt-2 text-lg font-semibold">{t("step2Title")}</h3>
      <p className="text-sm text-muted-foreground">{t("step2Sub")}</p>

      <div className="mt-4 inline-flex w-fit rounded-lg border border-border p-0.5 text-sm">
        {(["write", "upload"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-md px-3 py-1 transition-colors",
              tab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {id === "write" ? t("tabWrite") : t("tabUpload")}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {tab === "write" ? (
          <textarea
            value={script}
            onChange={(e) => onScriptChangeAction(e.target.value)}
            maxLength={limit.unit === "chars" ? limit.max : undefined}
            placeholder={t("scriptPlaceholder")}
            className="w-full min-h-52 flex-1 resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary"
          />
        ) : (
          <button
            type="button"
            disabled={extracting}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex w-full flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors disabled:opacity-60",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-foreground/30",
            )}
          >
            <UploadCloud className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium">
              {extracting ? t("scriptExtracting") : t("scriptDropTitle")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("scriptDropSub")}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".txt,.pdf,.epub,text/plain,application/pdf,application/epub+zip"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </button>
        )}
        <p
          className={cn(
            "mt-1 text-right text-xs",
            overLimit ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {t(limit.unit === "words" ? "charCountWords" : "charCountChars", {
            count,
            max: limit.max,
          })}
        </p>
        {languageMismatch && (
          <p className="mt-1 text-xs text-destructive">
            {t("languageMismatch")}
          </p>
        )}
        {fileError && (
          <p className="mt-1 text-xs text-destructive">{fileError}</p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium">{t("modelTitle")}</p>
          <ModelSelect value={model} onChangeAction={onModelChangeAction} />
        </div>
        <Button
          disabled={disabled || generating || overLimit || languageMismatch}
          onClick={onGenerateAction}
          className="sm:w-auto"
        >
          {generating ? t("generating") : t("generate")}
        </Button>
      </div>
    </div>
  );
}
