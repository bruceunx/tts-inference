"use client";

import type { AudioEntry } from "@/lib/audio-db";
import { useTranslations } from "next-intl";
import { Waveform } from "@/components/landing/waveform";
import { AudioPlayer } from "@/components/landing/audio-player";
import { useSimulatedProgress } from "@/lib/use-simulated-progress";
import { Loader2 } from "lucide-react";
import { AudioHistory } from "@/components/landing/audio-history";

export function ResultsPanel({
  generating,
  result,
  error,
  history,
}: {
  generating: boolean;
  result: Blob | null;
  error: string | null;
  history: { entries: AudioEntry[]; remove: (id: string) => void };
}) {
  const t = useTranslations("Workspace");
  const progress = useSimulatedProgress(generating);

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <h3 className="text-lg font-semibold">{t("resultsTitle")}</h3>
      <div className="mt-4 flex flex-1 items-center justify-center">
        {generating ? (
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t("generating")}</p>
            <div className="flex w-full max-w-56 items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {progress}%
              </span>
            </div>
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
      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {t("recentGenerations")}
        </p>
        <AudioHistory
          entries={history.entries}
          onRemoveAction={history.remove}
          showDownload
          emptyLabel={t("noRecentGenerations")}
        />
      </div>
    </div>
  );
}
