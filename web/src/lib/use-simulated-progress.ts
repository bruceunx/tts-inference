"use client";

import { useEffect, useRef, useState } from "react";

export function useSimulatedProgress(active: boolean, estimateMs = 20_000) {
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      startRef.current = null;
      return;
    }
    startRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - (startRef.current ?? Date.now());
      const fraction = 1 - Math.exp(-elapsed / estimateMs);
      setProgress(Math.min(92, Math.round(fraction * 100)));
    }, 200);
    return () => clearInterval(interval);
  }, [active, estimateMs]);

  return progress;
}
