"use client";

import { Trash2, Check } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/landing/audio-player";
import type { AudioEntry } from "@/lib/audio-db";
import { MODEL_IDS, ModelId } from "@/lib/tts-config";

function isModelId(tag: string | undefined): tag is ModelId {
  return !!tag && (MODEL_IDS as readonly string[]).includes(tag);
}

export function AudioHistory({
  entries,
  onRemoveAction,
  onSelectAction,
  activeId,
  showDownload = false,
  emptyLabel,
}: {
  entries: AudioEntry[];
  onRemoveAction: (id: string) => void;
  onSelectAction?: (entry: AudioEntry) => void;
  activeId?: string;
  showDownload?: boolean;
  emptyLabel: string;
}) {
  const t = useTranslations("Workspace");
  const tm = useTranslations("Models");
  const format = useFormatter();

  if (entries.length === 0)
    return <p className="text-xs text-muted-foreground">{emptyLabel}</p>;

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => {
        const active = entry.id === activeId;
        return (
          <div
            key={entry.id}
            className={cn(
              "rounded-lg border p-2",
              active
                ? "border-primary bg-primary/5"
                : "border-border bg-background",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  #{index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-medium text-muted-foreground">
                      {entry.name}
                    </p>
                    {isModelId(entry.tag) && (
                      <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        {tm(`${entry.tag}.name`)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground/70">
                    {format.dateTime(new Date(entry.createdAt), {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {onSelectAction &&
                  (active ? (
                    <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      <Check className="size-3" /> {t("inUse")}
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectAction(entry)}
                    >
                      {t("useSample")}
                    </Button>
                  ))}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("removeSample")}
                  onClick={() => onRemoveAction(entry.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
            <AudioPlayer
              blob={entry.blob}
              showSpeed={false}
              downloadName={showDownload ? entry.name : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
