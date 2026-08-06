"use client";

import type { ModelId } from "@/lib/tts-config";

import { useTranslations } from "next-intl";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelSelect } from "@/components/landing/model-select";

const MAX_CHARS = 1000;

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
  onScriptChangeAction: (value: string) => void;
  model: ModelId;
  onModelChangeAction: (id: ModelId) => void;
  disabled: boolean;
  generating: boolean;
  onGenerateAction: () => void;
}) {
  const t = useTranslations("Workspace");

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-mono text-primary">
        <span>{t("step2")}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h3 className="mt-2 text-lg font-semibold">{t("step2Title")}</h3>
      <p className="text-sm text-muted-foreground">{t("step2Sub")}</p>

      <div className="mt-4">
        <textarea
          value={script}
          onChange={(e) =>
            onScriptChangeAction(e.target.value.slice(0, MAX_CHARS))
          }
          placeholder={t("scriptPlaceholder")}
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <p className="mt-1 text-right font-mono text-xs text-muted-foreground">
          {t("charCount", { count: script.length, max: MAX_CHARS })}
        </p>
      </div>

      <div className="mt-2">
        <p className="mb-2 text-sm font-medium">{t("modelTitle")}</p>
        <ModelSelect value={model} onChangeAction={onModelChangeAction} />
      </div>

      <Button
        size="lg"
        className="mt-5 w-full gap-2"
        disabled={disabled || generating}
        onClick={onGenerateAction}
      >
        <Wand2 />
        {generating ? t("generating") : t("generate")}
      </Button>
    </div>
  );
}
