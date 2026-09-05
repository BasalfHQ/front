"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { useTranslations } from "next-intl";

export function CalendarSubscriptionClient({ url }: { url: string }) {
  const t = useTranslations("calendar");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border p-4 bg-gray-50">
      <label className="text-sm font-medium mb-2 block">
        {t("subscriptionUrl")}
      </label>
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-white font-mono"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <Button onClick={handleCopy} variant="outline">
          {copied ? t("copied") : t("copy")}
        </Button>
      </div>
    </div>
  );
}
