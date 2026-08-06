"use client";

import { cn } from "@/lib/utils";

const BAR_HEIGHTS = [30, 55, 40, 70, 45, 90, 50, 65, 35, 80, 45, 60, 30, 50];

export function Waveform({
  active = false,
  className,
  barClassName,
}: {
  active?: boolean;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-0.75", className)}
      aria-hidden="true"
    >
      {BAR_HEIGHTS.map((h, i) => (
        <span
          key={`bar-${i}-${h}`}
          className={cn(
            "w-0.75 rounded-full bg-primary/70 motion-reduce:animate-none",
            active && "animate-[waveform_1s_ease-in-out_infinite]",
            barClassName,
          )}
          style={{
            height: `${h}%`,
            animationDelay: `${i * 70}ms`,
          }}
        />
      ))}
    </div>
  );
}
