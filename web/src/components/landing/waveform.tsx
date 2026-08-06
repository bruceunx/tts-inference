"use client";

import { cn } from "@/lib/utils";

const PLACEHOLDER_HEIGHTS = [
  30, 55, 40, 70, 45, 90, 50, 65, 35, 80, 45, 60, 30, 50,
];

export function Waveform({
  active = false,
  peaks,
  className,
  barClassName,
}: {
  active?: boolean;
  peaks?: number[];
  className?: string;
  barClassName?: string;
}) {
  const heights = peaks && peaks.length > 0 ? peaks : PLACEHOLDER_HEIGHTS;
  return (
    <div
      className={cn("flex items-center gap-0.75", className)}
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <span
          key={`bar-${i}-${h}`}
          className={cn(
            "w-0.75 rounded-full bg-primary/70 motion-reduce:animate-none",
            active && "animate-[waveform_1s_ease-in-out_infinite]",
            barClassName,
          )}
          style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
        />
      ))}
    </div>
  );
}
