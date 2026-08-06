"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Play, Pause } from "lucide-react";
import { Waveform } from "@/components/landing/waveform";
import { Button } from "@/components/ui/button";
import { decodePeaks } from "@/lib/waveform";
import { formatTime } from "@/lib/format-time";
import { cn } from "@/lib/utils";

const SPEEDS = [1, 1.25, 1.5, 2] as const;

export function ResultsPanel({
  generating,
  result,
  error,
}: {
  generating: boolean;
  result: Blob | null;
  error: string | null;
}) {
  const t = useTranslations("Workspace");
  const [url, setUrl] = useState<string | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!result) {
      setUrl(null);
      setPeaks([]);
      setCurrentTime(0);
      setDuration(0);
      return;
    }
    const objectUrl = URL.createObjectURL(result);
    setUrl(objectUrl);
    decodePeaks(result)
      .then(setPeaks)
      .catch(() => setPeaks([]));
    return () => URL.revokeObjectURL(objectUrl);
  }, [result]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  function togglePlay() {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
  }

  function seek(fraction: number) {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = fraction * duration;
  }

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <h3 className="text-lg font-semibold">{t("resultsTitle")}</h3>

      <div className="mt-4 flex flex-1 items-center justify-center">
        {generating ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <Waveform className="h-8" active />
            <p className="text-sm text-muted-foreground">{t("generating")}</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-sm font-medium text-destructive">
              {t("generateError")}
            </p>
            <p className="mt-1 max-w-56 text-xs text-muted-foreground">
              {error}
            </p>
          </div>
        ) : url ? (
          <div className="w-full space-y-2">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
              <Button
                variant="default"
                size="icon"
                aria-label="Play"
                onClick={togglePlay}
              >
                {playing ? <Pause /> : <Play />}
              </Button>
              <Waveform
                className="h-8 flex-1"
                peaks={peaks}
                progress={progress}
                onSeekAction={seek}
                active={playing}
              />
              <Button variant="ghost" size="icon" aria-label="Download">
                <a href={url} download="output.wav">
                  <Download />
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span className="font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <div className="flex gap-1">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono transition-colors",
                      speed === s
                        ? "bg-primary/10 text-primary"
                        : "hover:text-foreground",
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>

            <audio
              ref={audioRef}
              src={url}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              className="hidden"
            />
          </div>
        ) : (
          <div className="text-center">
            <Waveform className="mx-auto h-8 opacity-20" />
            <p className="mt-3 text-sm font-medium">{t("resultsEmptyTitle")}</p>
            <p className="mt-1 max-w-56 text-xs text-muted-foreground">
              {t("resultsEmptySub")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
