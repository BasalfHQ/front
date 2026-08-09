"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@repo/i18n";
import { useTransition } from "react";
import { routing } from "@repo/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

const localeData: Record<string, { flag: string; name: string }> = {
  en: { flag: "🇬🇧", name: "EN" },
  fr: { flag: "🇫🇷", name: "FR" },
};

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onLocaleChange(newLocale: string) {
    console.log("before", window.location.href);
    console.log("locales", currentLocale, newLocale);

    if (newLocale === currentLocale) return;

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; samesite=lax`;

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <Select defaultValue={currentLocale} onValueChange={onLocaleChange}>
      <SelectTrigger className={className} disabled={isPending}>
        <SelectValue>
          {localeData[currentLocale].flag} {localeData[currentLocale].name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeData[loc].flag} {localeData[loc].name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
