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
    if (newLocale === currentLocale) return;
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
