"use client";

import type { ModelId } from "@/lib/tts-config";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { MODEL_IDS } from "@/lib/tts-config";

export function ModelSelect({
  value,
  onChangeAction,
}: {
  value: ModelId;
  onChangeAction: (id: ModelId) => void;
}) {
  const t = useTranslations("Models");

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {MODEL_IDS.map((id) => {
        const selected = id === value;
        return (
          <label
            key={id}
            className={cn(
              "cursor-pointer rounded-lg border px-3 py-2.5 transition-colors",
              selected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-foreground/30",
            )}
          >
            <input
              type="radio"
              name="model"
              value={id}
              checked={selected}
              onChange={() => onChangeAction(id)}
              className="sr-only"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t(`${id}.name`)}</span>
              <span
                className={cn(
                  "size-3.5 shrink-0 rounded-full border",
                  selected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40",
                )}
              />
            </div>
            <p className="mt-1 text-xs text-primary">{t(`${id}.tag`)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(`${id}.desc`)}
            </p>
          </label>
        );
      })}
    </div>
  );
}
