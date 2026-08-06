"use client";

import { useTranslations } from "next-intl";
import { Download, Play } from "lucide-react";
import { Waveform } from "@/components/landing/waveform";
import { Button } from "@/components/ui/button";

export function ResultsPanel({
  generating,
  hasResult,
}: {
  generating: boolean;
  hasResult: boolean;
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
        ) : hasResult ? (
          <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <Button variant="default" size="icon" aria-label="Play">
              <Play />
            </Button>
            <Waveform className="h-6 flex-1" />
            <Button variant="ghost" size="icon" aria-label="Download">
              <Download />
            </Button>
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
