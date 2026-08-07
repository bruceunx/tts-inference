"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/landing/audio-player";
import type { AudioEntry } from "@/lib/audio-db";

export function AudioHistory({
  entries,
  onRemoveAction,
  onSelectAction,
  emptyLabel,
}: {
  entries: AudioEntry[];
  onRemoveAction: (id: string) => void;
  onSelectAction?: (entry: AudioEntry) => void;
  emptyLabel: string;
}) {
  const t = useTranslations("Workspace");

  if (entries.length === 0)
    return <p className="text-xs text-muted-foreground">{emptyLabel}</p>;

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="rounded-lg border border-border bg-background p-2"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onSelectAction?.(entry)}
              disabled={!onSelectAction}
              className="truncate text-left text-xs font-medium text-muted-foreground hover:text-foreground disabled:cursor-default disabled:hover:text-muted-foreground"
            >
              {entry.name}
            </button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("removeSample")}
              onClick={() => onRemoveAction(entry.id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          <AudioPlayer blob={entry.blob} showSpeed={false} />
        </div>
      ))}
    </div>
  );
}
