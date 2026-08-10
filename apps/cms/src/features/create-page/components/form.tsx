"use client";

import { usePageCreated } from "@/shared/storage-hooks";
import { useSession } from "next-auth/react";
import { useTranslations } from "@repo/i18n";
import { Button, CardInput } from "@repo/ui";
import { Block, Locales } from "@repo/apis";
import { ISO_639_1_CODES_WITH_FLAGS } from "@repo/apis";
import { BlockForm } from "@/shared/blocks";
import { useState } from "react";
import { baseUrl } from "@repo/config";
import router from "next/router";

export function CreatePageForm({ locales }: { locales: Locales }) {
  const { data: session, status } = useSession();
  const t = useTranslations("createPage");
  const [page, setPage] = usePageCreated(session);

  if (status === "unauthenticated") return router.push(baseUrl);
  if (status === "loading" || !page) return <div>Loading...</div>;

  const languages = ISO_639_1_CODES_WITH_FLAGS.filter((locale) =>
    locales.includes(locale.code),
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <CardInput
          label={t("url.label")}
          description={t("url.description")}
          value={page.url}
          onChange={(value) => setPage({ ...page, url: value })}
          className="min-w-[300px] bg-accent/20 flex-1"
          classNameInput="max-w-[300px]"
          placeholder={t("url.placeholder")}
          type="input"
        />
        <CardInput
          label={t("locale.label")}
          description={t("locale.description")}
          value={page.locale}
          onChange={(value) => setPage({ ...page, locale: value })}
          className="min-w-[300px] bg-accent/20 flex-1"
          classNameInput="max-w-[200px]"
          placeholder={t("locale.placeholder")}
          type="select"
          options={languages.map((locale) => ({
            component: (
              <div className="flex items-center gap-2">
                <p className="text-[1.2rem]">{locale.flag}</p>
                <p>{locale.name}</p>
              </div>
            ),
            value: locale.code,
          }))}
        />
      </div>
      <BlockForm
        value={page.slices}
        onChange={(s) => setPage({ ...page, slices: s })}
        title={t.rich("blockTitle")}
        description={
          <p>
            {t.rich("blockDescription", {
              br: () => <br />,
            })}
          </p>
        }
        className="pt-8"
      />
      <div className="w-full flex justify-end mt-6">
        <Button variant="success" className="w-full md:w-[200px]">
          {t("save")}
        </Button>
      </div>
    </div>
  );
}
