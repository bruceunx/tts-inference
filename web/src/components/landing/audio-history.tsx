"use client";

import { Trash2, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/landing/audio-player";
import type { AudioEntry } from "@/lib/audio-db";

export function AudioHistory({
  entries,
  onRemoveAction,
  onSelectAction,
  activeId,
  emptyLabel,
}: {
  entries: AudioEntry[];
  onRemoveAction: (id: string) => void;
  onSelectAction?: (entry: AudioEntry) => void;
  activeId?: string;
  emptyLabel: string;
}) {
  const t = useTranslations("Workspace");

  if (entries.length === 0) return <p className="text-xs text-muted-foreground">{emptyLabel}</p>;

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const active = entry.id === activeId;
        return (
          <div
            key={entry.id}
            className={cn("rounded-lg border p-2", active ? "border-primary bg-primary/5" : "border-border bg-background")}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-medium text-muted-foreground">{entry.name}</span>
              <div className="flex shrink-0 items-center gap-1">
                {onSelectAction &&
                  (active ? (
                    <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      <Check className="size-3" /> {t("inUse")}
                    </span>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => onSelectAction(entry)}>
                      {t("useSample")}
                    </Button>
                  ))}
                <Button variant="ghost" size="icon-sm" aria-label={t("removeSample")} onClick={() => onRemoveAction(entry.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
            <AudioPlayer blob={entry.blob} showSpeed={false} />
          </div>
        );
      })}
    </div>
  );
}
