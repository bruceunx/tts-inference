import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/landing/site-header";
import { MODEL_IDS, MODEL_LIMITS } from "@/lib/tts-config";

export default async function ModelsPage() {
  const t = await getTranslations("Models");

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("pageSub")}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {MODEL_IDS.map((id) => {
            const limit = MODEL_LIMITS[id];
            return (
              <div
                key={id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="text-xs font-mono text-primary">
                  {t(`${id}.tag`)}
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  {t(`${id}.name`)}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`${id}.desc`)}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {t("limitLabel", { max: limit.max, unit: limit.unit })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
