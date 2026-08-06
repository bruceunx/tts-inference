import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Waveform } from "@/components/landing/waveform";

export function SiteHeader() {
  const t = useTranslations("Nav");

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <Waveform
            className="h-4"
            barClassName="animate-[waveform_1.8s_ease-in-out_infinite]"
          />
          Timbre
        </div>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#workspace" className="hover:text-foreground">
            {t("workspace")}
          </a>
          <a href="#models" className="hover:text-foreground">
            {t("models")}
          </a>
          <a href="/docs" className="hover:text-foreground">
            {t("docs")}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
