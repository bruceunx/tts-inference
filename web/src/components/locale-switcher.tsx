"use client";

import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = { en: "EN", zh: "中文" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: string) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="flex gap-1">
      {routing.locales.map((l) => (
        <Button
          key={l}
          variant={l === locale ? "default" : "outline"}
          size="sm"
          onClick={() => switchTo(l)}
        >
          {labels[l]}
        </Button>
      ))}
    </div>
  );
}
