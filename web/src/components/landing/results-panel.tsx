"use client";

import { useTranslations } from "next-intl";
import { Waveform } from "@/components/landing/waveform";
import { AudioPlayer } from "@/components/landing/audio-player";

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
        ) : result ? (
          <AudioPlayer blob={result} downloadName="output.wav" />
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
