"use client";

import { useTranslations } from "@repo/i18n";
import { Button } from "@repo/ui";
import { CheckIcon } from "@repo/ui/icons";
import { useState } from "react";

export function TokenCopy({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("token");

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <Button onClick={handleCopy} className="w-[200px]">
      {copied ? t("copied") : t("copy")}{" "}
      {copied ? <CheckIcon className="w-4 h-4" /> : null}
    </Button>
  );
}
