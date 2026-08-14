"use client";

import { usePageUpdated } from "@/shared/storage-hooks";
import { useSession } from "next-auth/react";
import { useRouter, useTranslations } from "@repo/i18n";
import {
  Button,
  CardInput,
  toast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@repo/ui";
import { Locales, Page } from "@repo/apis";
import { ISO_639_1_CODES_WITH_FLAGS } from "@repo/apis";
import { BlockForm } from "@/shared/blocks";
import { baseUrl } from "@repo/config";
import { SeoForm } from "@/shared/seo";
import { useState } from "react";
import type { Block, PageSeo } from "@repo/apis";
import { updatePage, deletePage } from "../actions";
import type { BlockErrors, SchemaErrors } from "@/features/create-page/components/form";

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
  block: Block,
  t: (key: string) => string,
): BlockErrors | null {
  const errors: Record<string, string> = {};

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
  schema: PageSeo["schemas"][number],
  t: (key: string) => string,
): Record<string, string> | null {
  const errors: Record<string, string> = {};

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

function validatePage(page: Page, t: (key: string) => string): FormErrors {
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

export function UpdatePageForm({
  locales,
  initialPage,
}: {
  locales: Locales;
  initialPage: Page;
}) {
  const { data: session, status } = useSession();
  const t = useTranslations("updatePage");
  const [page, setPage, clearPage] = usePageUpdated(
    session!,
    initialPage,
  );
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (status === "unauthenticated") {
    window.location.href = baseUrl;
    return null;
  }
  if (status === "loading" || !page) return <div>Loading...</div>;

  const languages = ISO_639_1_CODES_WITH_FLAGS.filter((loc) =>
    locales.includes(loc.code),
  );

  async function handleSubmit() {
    setSubmitted(true);
    const validationErrors = validatePage(page!, t);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0 || !page) return;

    setLoading(true);
    try {
      await updatePage(page);
      toast.success(t("success"));
      clearPage();
    } catch (error) {
      console.error(error);
      toast.error(t("errors.updatePageFailed"));
    } finally {
      setLoading(false);
    }
  }

  function handleUpdatePage(updated: Page) {
    setPage(updated);
    if (submitted) {
      setErrors(validatePage(updated, t));
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deletePage(initialPage.pageId);
      toast.success(t("deleteSuccess"));
      clearPage();
      router.push("/pages");
    } catch (error) {
      console.error(error);
      toast.error(t("errors.deletePageFailed"));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-wrap gap-2">
        <CardInput
          label={t("url.label")}
          description={t("url.description")}
          value={page.url}
          onChange={(value) => handleUpdatePage({ ...page, url: value })}
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
          onChange={(value) => handleUpdatePage({ ...page, locale: value })}
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
      </div>
      <BlockForm
        value={page.slices}
        onChange={(s) => handleUpdatePage({ ...page, slices: s })}
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
        onChange={(seo) => handleUpdatePage({ ...page, seo })}
        errors={{ title: errors.seoTitle, description: errors.seoDescription }}
        schemaErrors={errors.schemas}
      />

      <div className="w-full flex justify-between mt-6">
        <Button
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
          disabled={deleting}
        >
          {t("delete")}
        </Button>
        <Button
          variant="success"
          className="w-full md:w-[200px]"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t("saving") : t("save")}
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteConfirmTitle")}</DialogTitle>
            <DialogDescription>{t("deleteConfirmDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("deleteCancel")}</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? t("deleting") : t("deleteConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
