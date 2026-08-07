import { useTranslations } from "next-intl";

export const FOOTER_ENABLED = true;

export function Footer() {
  const t = useTranslations("Footer");

  if (!FOOTER_ENABLED) return null;

  return (
    <footer className="mt-auto border-t border-border/60 px-4 py-6 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
        <span>{t("tagline")}</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/bruceunx/tts-inference"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            {t("github")}
          </a>
          <span>{t("version", { version: "0.1.0" })}</span>
        </div>
      </div>
    </footer>
  );
}
