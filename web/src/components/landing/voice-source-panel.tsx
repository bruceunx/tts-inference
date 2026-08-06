"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Mic, Square, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/landing/waveform";

export type VoiceSample = { name: string; blob: Blob };
type Tab = "upload" | "record";

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_DURATION_S = 30;
const MIN_DURATION_S = 1;

async function validateSample(blob: Blob): Promise<string | null> {
  if (blob.size > MAX_FILE_BYTES) return "File too large (max 15MB)";
  try {
    const ctx = new AudioContext();
    const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
    ctx.close();
    if (buffer.duration > MAX_DURATION_S)
      return `Sample too long (max ${MAX_DURATION_S}s)`;
    if (buffer.duration < MIN_DURATION_S) return "Sample too short";
    return null;
  } catch {
    return "Unrecognized audio format";
  }
}

export function VoiceSourcePanel({
  sample,
  onSampleChangeAction,
  recording,
  onRecordingChangeAction,
}: {
  sample: VoiceSample | null;
  onSampleChangeAction: (sample: VoiceSample | null) => void;
  recording: boolean;
  onRecordingChangeAction: (recording: boolean) => void;
}) {
  const t = useTranslations("Workspace");
  const [tab, setTab] = useState<Tab>("upload");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [sampleError, setSampleError] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const err = await validateSample(file);
    if (err) {
      setSampleError(err);
      return;
    }
    setSampleError(null);
    onSampleChangeAction({ name: file.name, blob: file });
  }

  async function startRecording() {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      console.log("stream", stream);
      console.log("recorder", recorder);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        stream.getTracks().forEach((track) => track.stop());
        const err = await validateSample(blob);
        if (err) {
          setSampleError(err);
          return;
        }
        setSampleError(null);
        onSampleChangeAction({ name: "recording.webm", blob });
      };
      recorder.start();
      recorderRef.current = recorder;
      onRecordingChangeAction(true);
    } catch (err) {
      console.log("recording err", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setMicError(
          "Microphone access denied — allow it in your browser's site settings",
        );
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        setMicError("No microphone found");
      } else if (!navigator.mediaDevices) {
        setMicError("Microphone requires HTTPS or localhost");
      } else {
        setMicError("Could not access microphone");
      }
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    onRecordingChangeAction(false);
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
        {sample ? (
          <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <Waveform className="h-6 shrink-0" active />
              <div className="overflow-hidden">
                <p className="text-xs text-muted-foreground">
                  {t("recordedLabel")}
                </p>
                <p className="truncate text-sm font-medium">{sample.name}</p>
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
              onChange={(e) => handleFiles(e.target.files)}
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => (recording ? stopRecording() : startRecording())}
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
            {micError && (
              <p className="mt-1 text-xs text-destructive">{micError}</p>
            )}
          </button>
        )}
        {sampleError && (
          <p className="mt-2 text-xs text-destructive">{sampleError}</p>
        )}
      </div>
    </div>
  );
}
