import { useTranslations } from "next-intl";
import { Gauge, Layers, ShieldCheck } from "lucide-react";
import { Waveform } from "@/components/landing/waveform";

function Badge({
  icon: Icon,
  children,
}: {
  icon: typeof Gauge;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-primary" />
      {children}
    </div>
  );
}

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-20 text-center sm:pt-24 sm:pb-28">
      <Waveform
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-40 max-w-3xl opacity-[0.07]"
        barClassName="animate-[waveform_2.4s_ease-in-out_infinite]"
      />

      <div className="relative mx-auto max-w-2xl">
        <p className="mb-4 font-mono text-xs tracking-wide text-primary uppercase">
          {t("eyebrow")}
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {t("title")} <span className="text-primary">{t("titleAccent")}</span>
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground text-balance sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Badge icon={Gauge}>{t("badgeSpeed")}</Badge>
          <Badge icon={Layers}>{t("badgeModels")}</Badge>
          <Badge icon={ShieldCheck}>{t("badgePrivacy")}</Badge>
        </div>
      </div>
    </section>
  );
}
