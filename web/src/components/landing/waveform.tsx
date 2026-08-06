"use client";

import { cn } from "@/lib/utils";

const PLACEHOLDER_HEIGHTS = [
  30, 55, 40, 70, 45, 90, 50, 65, 35, 80, 45, 60, 30, 50,
];

export function Waveform({
  active = false,
  peaks,
  progress = 0, // 0..1, fraction played
  onSeekAction,
  className,
  barClassName,
}: {
  active?: boolean;
  peaks?: number[];
  progress?: number;
  onSeekAction?: (fraction: number) => void;
  className?: string;
  barClassName?: string;
}) {
  const heights = peaks && peaks.length > 0 ? peaks : PLACEHOLDER_HEIGHTS;

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!onSeekAction) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onSeekAction(
      Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
    );
  }

  return (
    <div
      className={cn(
        "flex w-full items-center gap-0.75",
        onSeekAction && "cursor-pointer",
        className,
      )}
      onClick={handleSeek}
      role={onSeekAction ? "slider" : undefined}
      aria-valuenow={onSeekAction ? Math.round(progress * 100) : undefined}
    >
      {heights.map((h, i) => {
        const played =
          onSeekAction !== undefined && i / heights.length < progress;
        return (
          <span
            key={`bar-${i}-${h}`}
            className={cn(
              "min-w-0.75 flex-1 rounded-full bg-primary/30 transition-colors",
              played ? "bg-primary" : "bg-primary/30",
              active && "animate-[waveform_1s_ease-in-out_infinite]",
              barClassName,
            )}
            style={{
              height: `${h}%`,
              animationDelay: active ? `${i * 60}ms` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
