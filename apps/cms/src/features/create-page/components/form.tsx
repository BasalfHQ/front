"use client";

import { usePageCreated } from "@/shared/storage-hooks";
import { useSession } from "next-auth/react";
import { useTranslations } from "@repo/i18n";
import { CardInput } from "@repo/ui";


export function CreatePageForm() {
  const { data: session } = useSession();
  const t = useTranslations("createPage");

  const [page, setPage] = usePageCreated(session!);

  return (
    <div className="flex flex-col gap-2">
      <CardInput
        label={t("url.label")}
        description={t("url.description")}
        value={page.url}
        onChange={(value) => setPage({ ...page, url: value })}
        className="max-w-[400px] bg-accent/20"
        placeholder={t("url.placeholder")}
      />
    </div>
  );
}
