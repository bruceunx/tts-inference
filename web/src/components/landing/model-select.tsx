"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { MODEL_IDS, type ModelId } from "@/lib/tts-config";

export function ModelSelect({
  value,
  onChangeAction,
}: {
  value: ModelId;
  onChangeAction: (id: ModelId) => void;
}) {
  const t = useTranslations("Models");

  return (
    <div className="flex gap-2">
      {MODEL_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onChangeAction(id)}
          className={cn(
            "flex-1 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
            value === id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-foreground/30",
          )}
        >
          <p className="font-medium">{t(`${id}.name`)}</p>
          <p className="text-xs text-muted-foreground">{t(`${id}.desc`)}</p>
        </button>
      ))}
    </div>
  );
}
