import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="absolute top-4 right-4 flex gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {t("title")}
      </h1>
    </main>
  );
}
