"use client";

import { usePageCreated } from "@/shared/storage-hooks";
import { useSession } from "next-auth/react";
import { useLocale, useRouter, useTranslations } from "@repo/i18n";
import { Button, CardInput, toast } from "@repo/ui";
import { Cms } from "@repo/apis";
import { BlockForm } from "@/shared/blocks";
import { baseUrl } from "@repo/config";
import { SeoForm } from "@/shared/seo";
import { useState } from "react";
import { createPage } from "../actions";

export type BlockErrors = Record<string, string>;
export type SchemaErrors = Record<string, string>;

function isHtmlEmpty(html: string): boolean {
  const text = html.replace(/<[^>]*>/g, "").trim();
  return text.length === 0;
}

type FormErrors = {
  url?: string;
  locale?: string;
  seoTitle?: string;
  seoDescription?: string;
  blocks?: (BlockErrors | null)[];
  schemas?: (SchemaErrors | null)[];
};

function validateBlock(
  block: Cms.Block,
  t: (key: string) => string,
): BlockErrors | null {
  const errors: BlockErrors = {};

  if (
    block.type === "description" ||
    block.type === "text" ||
    block.type === "heading"
  ) {
    if (isHtmlEmpty(block.content))
      errors.content = t("errors.blocks.contentRequired");
  }

  if (block.type === "image") {
    if (!block.content.src.trim()) errors.src = t("errors.blocks.srcRequired");
    if (!block.content.alt.trim()) errors.alt = t("errors.blocks.altRequired");
  }

  if (block.type === "list") {
    if (
      !block.content.items.length ||
      block.content.items.every((i) => !i.text.trim())
    )
      errors.items = t("errors.blocks.listItemRequired");
  }

  if (block.type === "faq") {
    if (
      block.content.some(
        (item) => !item.question.trim() || isHtmlEmpty(item.answer),
      )
    )
      errors.items = t("errors.blocks.faqFieldsRequired");
  }

  if (block.type === "related") {
    if (!block.content.length || block.content.every((s) => !s.trim()))
      errors.items = t("errors.blocks.relatedRequired");
  }

  return Object.keys(errors).length ? errors : null;
}

function validateSchema(
  schema: Cms.PageSeo["schemas"][number],
  t: (key: string) => string,
): SchemaErrors | null {
  const errors: SchemaErrors = {};

  if (schema.type === "article") {
    if (!schema.title.trim()) errors.title = t("errors.schemas.titleRequired");
    if (!schema.description.trim())
      errors.description = t("errors.schemas.descriptionRequired");
    if (!schema.date.trim()) errors.date = t("errors.schemas.dateRequired");
    if (!schema.readingTime || schema.readingTime <= 0)
      errors.readingTime = t("errors.schemas.readingTimeRequired");
    if (!schema.keywords.length)
      errors.keywords = t("errors.schemas.keywordsRequired");
  }

  if (schema.type === "person") {
    if (!schema.name.trim()) errors.name = t("errors.schemas.nameRequired");
  }

  if (schema.type === "product") {
    if (!schema.name.trim()) errors.name = t("errors.schemas.nameRequired");
  }

  return Object.keys(errors).length ? errors : null;
}

function validatePage(
  page: Omit<Cms.Page, "pageId">,
  t: (key: string) => string,
): FormErrors {
  const errors: FormErrors = {};

  if (!page.url.trim()) errors.url = t("errors.urlRequired");
  if (!page.locale) errors.locale = t("errors.localeRequired");
  if (!page.seo.title.trim()) errors.seoTitle = t("errors.seoTitleRequired");
  if (!page.seo.description.trim())
    errors.seoDescription = t("errors.seoDescriptionRequired");

  const blockErrors = page.slices.map((block) => validateBlock(block, t));
  if (blockErrors.some(Boolean)) errors.blocks = blockErrors;

  const schemaErrors = page.seo.schemas.map((schema) =>
    validateSchema(schema, t),
  );
  if (schemaErrors.some(Boolean)) errors.schemas = schemaErrors;

  return errors;
}

export function CreatePageForm({
  locales,
  pages,
}: {
  locales: Cms.Locales;
  pages: Cms.AllPages;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("createPage");
  const [page, setPage, clearPage] = usePageCreated(session);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (status === "unauthenticated") {
    router.push(baseUrl);
    return null;
  }
  if (status === "loading" || !page) return <div>Loading...</div>;

  const languages = Cms.ISO_639_1_CODES_WITH_FLAGS.filter((loc) =>
    locales.includes(loc.code),
  );

  async function handleSubmit() {
    setSubmitted(true);
    const validationErrors = validatePage(page!, t);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0 || !page || pageExist) return;

    setLoading(true);
    try {
      const newPage = await createPage(page);
      if (newPage) {
        toast.success(t("success"));
        clearPage();
        router.push(`/pages/${newPage.pageId}`, { locale });
      } else {
        toast.error(t("errors.createPageFailed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("errors.createPageFailed"));
    } finally {
      setLoading(false);
    }
  }

  function updatePage(updated: Omit<Cms.Page, "pageId">) {
    setPage(updated);
    if (submitted) {
      setErrors(validatePage(updated, t));
    }
  }

  const pageExist = pages.some(
    (p) => p.url === page.url && p.locale === page.locale,
  );
  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-wrap gap-2">
        <CardInput
          label={t("url.label")}
          description={t("url.description")}
          value={page.url}
          onChange={(value) => updatePage({ ...page, url: value })}
          className="min-w-[300px] bg-accent/20 flex-1"
          classNameInput="max-w-[300px]"
          placeholder={t("url.placeholder")}
          type="input"
          required
          error={errors.url}
        />
        <CardInput
          label={t("locale.label")}
          description={t("locale.description")}
          value={page.locale}
          onChange={(value) => updatePage({ ...page, locale: value })}
          className="min-w-[300px] bg-accent/20 flex-1"
          classNameInput="max-w-[200px]"
          placeholder={t("locale.placeholder")}
          type="select"
          required
          error={errors.locale}
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
        {pageExist && (
          <div className="text-red-500">
            <p>{t("errors.pageAlreadyExists")}</p>
          </div>
        )}
      </div>
      <BlockForm
        value={page.slices}
        onChange={(s) => updatePage({ ...page, slices: s })}
        title={t.rich("blockTitle")}
        description={
          <p>
            {t.rich("blockDescription", {
              br: () => <br />,
            })}
          </p>
        }
        errors={errors.blocks}
      />

      <SeoForm
        value={page.seo}
        onChange={(seo) => updatePage({ ...page, seo })}
        errors={{ title: errors.seoTitle, description: errors.seoDescription }}
        schemaErrors={errors.schemas}
      />

      <div className="w-full flex justify-end mt-6">
        <Button
          variant="success"
          className="w-full md:w-[200px]"
          onClick={handleSubmit}
          disabled={loading || pageExist}
        >
          {loading ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}
