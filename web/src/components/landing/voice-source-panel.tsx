"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Mic, Square, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/landing/waveform";

type Tab = "upload" | "record";

export function VoiceSourcePanel({
  sampleName,
  onSampleChangeAction,
  recording,
  onRecordingChangeAction,
}: {
  sampleName: string | null;
  onSampleChangeAction: (name: string | null) => void;
  recording: boolean;
  onRecordingChangeAction: (recording: boolean) => void;
}) {
  const t = useTranslations("Workspace");
  const [tab, setTab] = useState<Tab>("upload");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onSampleChangeAction(file.name);
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-mono text-primary">
        <span>{t("step1")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h3 className="mt-2 text-lg font-semibold">{t("step1Title")}</h3>
      <p className="text-sm text-muted-foreground">{t("step1Sub")}</p>

      <div className="mt-4 inline-flex w-fit rounded-lg border border-border p-0.5 text-sm">
        {(["upload", "record"] as const).map((id) => (
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
            {id === "upload" ? t("tabUpload") : t("tabRecord")}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-1 items-center justify-center">
        {sampleName ? (
          <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <Waveform className="h-6 shrink-0" active />
              <div className="overflow-hidden">
                <p className="text-xs text-muted-foreground">
                  {t("recordedLabel")}
                </p>
                <p className="truncate text-sm font-medium">{sampleName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onSampleChangeAction(null)}
              aria-label={t("removeSample")}
            >
              <X />
            </Button>
          </div>
        ) : tab === "upload" ? (
          <button
            type="button"
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
              "flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-foreground/30",
            )}
          >
            <UploadCloud className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium">{t("dropTitle")}</p>
            <p className="text-xs text-muted-foreground">{t("dropSub")}</p>
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFiles(e.target.files)
              }
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (recording) {
                onRecordingChangeAction(false);
                onSampleChangeAction("recording.wav");
              } else {
                onRecordingChangeAction(true);
              }
            }}
            className={cn(
              "flex w-full flex-col items-center gap-3 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors",
              recording
                ? "border-destructive/60 bg-destructive/5"
                : "border-border hover:border-foreground/30",
            )}
          >
            {recording ? (
              <Waveform
                className="h-8"
                active
                barClassName="bg-destructive/70"
              />
            ) : (
              <Mic className="size-6 text-muted-foreground" />
            )}
            <p className="flex items-center gap-2 text-sm font-medium">
              {recording && (
                <Square className="size-3 fill-destructive text-destructive" />
              )}
              {recording ? t("recordActive") : t("recordIdle")}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
