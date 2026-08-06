"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Download } from "lucide-react";
import { Waveform } from "@/components/landing/waveform";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/format-time";
import { decodePeaks } from "@/lib/waveform";

const SPEEDS = [1, 1.25, 1.5, 2] as const;

export function AudioPlayer({
  blob,
  showSpeed = true,
  downloadName,
}: {
  blob: Blob;
  showSpeed?: boolean;
  downloadName?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    decodePeaks(blob)
      .then(setPeaks)
      .catch(() => setPeaks([]));
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

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

  if (!url) return null;
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
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
        {downloadName && (
          <Button variant="ghost" size="icon" aria-label="Download">
            <a href={url} download={downloadName}>
              <Download />
            </a>
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span className="font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        {showSpeed && (
          <div className="flex gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`rounded px-1.5 py-0.5 font-mono transition-colors ${speed === s ? "bg-primary/10 text-primary" : "hover:text-foreground"}`}
              >
                {s}×
              </button>
            ))}
          </div>
        )}
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
  );
}
