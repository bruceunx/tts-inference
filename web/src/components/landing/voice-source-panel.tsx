"use client";
import type { AudioEntry } from "@/lib/audio-db";

import { AudioHistory } from "@/components/landing/audio-history";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Mic, Square, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/landing/audio-player";
import { decodeAudioBuffer } from "@/lib/waveform";
import { encodeWav } from "@/lib/wav-encoder";
import { isAcceptedAudioFile, checkDuration } from "@/lib/validate-audio";
import { resampleAudioBuffer } from "@/lib/resample";

export type VoiceSample = { id?: string; name: string; blob: Blob };
type Tab = "upload" | "record";

export function VoiceSourcePanel({
  sample,
  onSampleChangeAction,
  recording,
  onRecordingChangeAction,
  history,
}: {
  sample: VoiceSample | null;
  onSampleChangeAction: (sample: VoiceSample | null) => void;
  recording: boolean;
  onRecordingChangeAction: (recording: boolean) => void;
  history: { entries: AudioEntry[]; remove: (id: string) => void };
}) {
  const t = useTranslations("Workspace");
  const [tab, setTab] = useState<Tab>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [sampleError, setSampleError] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!isAcceptedAudioFile(file)) {
      setSampleError(t("formatError"));
      return;
    }
    try {
      const buffer = await decodeAudioBuffer(file);
      const durationErr = checkDuration(buffer);
      if (durationErr) {
        setSampleError(t(durationErr));
        return;
      }
      setSampleError(null);
      const resampled = await resampleAudioBuffer(buffer);
      onSampleChangeAction({
        name: file.name.replace(/\.\w+$/, ".wav"),
        blob: encodeWav(resampled),
      });
    } catch {
      setSampleError(t("formatError"));
    }
  }

  async function startRecording() {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const raw = new Blob(chunksRef.current, { type: recorder.mimeType });
        try {
          const buffer = await decodeAudioBuffer(raw);
          const durationErr = checkDuration(buffer);
          if (durationErr) {
            setSampleError(t(durationErr));
            return;
          }
          setSampleError(null);
          const resampled = await resampleAudioBuffer(buffer);
          onSampleChangeAction({
            name: "recording.wav",
            blob: encodeWav(resampled),
          });
        } catch {
          setSampleError(t("formatError"));
        }
      };
      recorder.start();
      recorderRef.current = recorder;
      onRecordingChangeAction(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError")
        setMicError(t("micDenied"));
      else if (err instanceof DOMException && err.name === "NotFoundError")
        setMicError(t("micNotFound"));
      else setMicError(t("micUnknown"));
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

      {!sample && (
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
      )}

      <div className="mt-4 flex flex-1 items-center justify-center">
        {sample ? (
          <div className="w-full space-y-2">
            <AudioPlayer blob={sample.blob} showSpeed={false} />
            <div className="flex items-center justify-between px-1">
              <span className="truncate text-xs text-muted-foreground">
                {sample.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSampleChangeAction(null)}
              >
                <X className="size-3.5" /> {t("removeSample")}
              </Button>
            </div>
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
              accept=".mp3,.wav,audio/mpeg,audio/wav"
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
            <Mic
              className={cn(
                "size-6",
                recording ? "text-destructive" : "text-muted-foreground",
              )}
            />
            <p className="flex items-center gap-2 text-sm font-medium">
              {recording && (
                <Square className="size-3 fill-destructive text-destructive" />
              )}
              {recording ? t("recordActive") : t("recordIdle")}
            </p>
          </button>
        )}
      </div>
      {sampleError && (
        <p className="mt-2 text-xs text-destructive">{sampleError}</p>
      )}
      {micError && <p className="mt-2 text-xs text-destructive">{micError}</p>}
      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t("recentSamples")}
        </p>
        <AudioHistory
          entries={history.entries}
          activeId={sample?.id}
          onRemoveAction={history.remove}
          onSelectAction={(entry) =>
            onSampleChangeAction({
              id: entry.id,
              name: entry.name,
              blob: entry.blob,
            })
          }
          emptyLabel={t("noRecentSamples")}
        />
      </div>
    </div>
  );
}
