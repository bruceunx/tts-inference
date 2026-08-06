"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModelSelect } from "@/components/landing/model-select";
import { MODEL_LIMITS, type ModelId } from "@/lib/tts-config";
import { countScript } from "@/lib/text-count";

export function ScriptPanel({
  script,
  onScriptChangeAction,
  model,
  onModelChangeAction,
  disabled,
  generating,
  onGenerateAction,
}: {
  script: string;
  onScriptChangeAction: (script: string) => void;
  model: ModelId;
  onModelChangeAction: (id: ModelId) => void;
  disabled: boolean;
  generating: boolean;
  onGenerateAction: () => void;
}) {
  const t = useTranslations("Workspace");
  const limit = MODEL_LIMITS[model];
  const count = countScript(script, limit.unit);
  const overLimit = count > limit.max;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-mono text-primary">
        <span>{t("step2")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h3 className="mt-2 text-lg font-semibold">{t("step2Title")}</h3>
      <p className="text-sm text-muted-foreground">{t("step2Sub")}</p>

      <textarea
        value={script}
        onChange={(e) => onScriptChangeAction(e.target.value)}
        maxLength={limit.unit === "chars" ? limit.max : undefined}
        placeholder={t("scriptPlaceholder")}
        rows={4}
        className="mt-4 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
      <p
        className={cn(
          "mt-1 text-right text-xs",
          overLimit ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {t(limit.unit === "words" ? "charCountWords" : "charCountChars", {
          count,
          max: limit.max,
        })}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium">{t("modelTitle")}</p>
          <ModelSelect value={model} onChangeAction={onModelChangeAction} />
        </div>
        <Button
          disabled={disabled || generating || overLimit}
          onClick={onGenerateAction}
          className="sm:w-auto"
        >
          {generating ? t("generating") : t("generate")}
        </Button>
      </div>
    </div>
  );
}
