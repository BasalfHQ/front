"use client";

import { Button } from "@repo/ui";
import { useTranslations, useRouter, usePathname } from "@repo/i18n";

export function LoginPrompt() {
  const t = useTranslations("homepage");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-muted-foreground">{t("loginRequired")}</p>
      <Button onClick={() => router.push(`${pathname}?login=true`)}>
        {t("login")}
      </Button>
    </div>
  );
}
