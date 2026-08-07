import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/landing/site-header";

export default async function DocsPage() {
  const t = await getTranslations("Docs");

  const sections = [
    "gettingStarted",
    "voiceSample",
    "script",
    "models",
    "limits",
  ] as const;

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("pageSub")}</p>

        <div className="mt-10 space-y-8">
          {sections.map((id) => (
            <section key={id}>
              <h2 className="text-lg font-semibold">{t(`${id}.title`)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`${id}.body`)}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
