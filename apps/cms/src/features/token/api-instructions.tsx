"use client";

import { useTranslations } from "@repo/i18n";
import { Copy, PageDescription, PageTitle } from "@repo/ui";

function CodeBlock({ label, code }: { label?: string; code: string }) {
  return (
    <div className="space-y-1">
      {label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
      <div className="relative rounded-md border bg-muted/50">
        <pre className="overflow-x-auto p-4 text-xs">
          <code>{code}</code>
        </pre>
        <div className="absolute top-2 right-2">
          <Copy text={code} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex items-center gap-2">
        <code className="flex-1 overflow-x-auto rounded-md border bg-muted/50 p-2 text-xs">
          {value}
        </code>
        <Copy text={value} />
      </div>
    </div>
  );
}

export function ApiInstructions({
  token,
  apiUrl,
}: {
  token: string;
  apiUrl: string | null;
}) {
  const t = useTranslations("token");

  const cmsInitSnippet = `import CMS from "@basalf/cms";

const cms = new CMS("${token}");`;

  const cmsGetPagesSnippet = `const pages = await cms.getPages();`;

  const cmsGetPageSnippet = `const page = await cms.getPage(pageId);`;

  const cmsNextEnvSnippet = `BASALF_CMS_TOKEN=${token}`;

  const cmsNextPageSnippet = `import { Page } from "@basalf/cms-next";

export default function PricingPage() {
  return <Page slug="pricing" locale="en" url="https://example.com/en/pricing" />;
}`;

  const cmsNextMetadataSnippet = `import { getPageMetadata } from "@basalf/cms-next";

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  return getPageMetadata(slug, locale);
}`;

  const cmsNextListSnippet = `import { getAllPages, getPageBySlug } from "@basalf/cms-next";

// Listing pages, sitemaps, generateStaticParams...
const pages = await getAllPages("en");
const page = await getPageBySlug("pricing", "en");`;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">{t("connectionDetails")}</h2>
        <p className="text-muted-foreground text-sm">{t("connectionDetailsDescription")}</p>
        <Field label={t("token")} value={token} />
        {apiUrl && <Field label={t("apiUrl")} value={apiUrl} />}
        <p className="text-destructive text-xs">{t("tokenWarning")}</p>
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">{t("cmsLibTitle")}</h2>
        <p className="text-muted-foreground text-sm">{t("cmsLibDescription")}</p>
        <CodeBlock code="npm install @basalf/cms" />
        <CodeBlock label={t("initLabel")} code={cmsInitSnippet} />
        <CodeBlock label={t("getPagesLabel")} code={cmsGetPagesSnippet} />
        <CodeBlock label={t("getPageLabel")} code={cmsGetPageSnippet} />
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">{t("cmsNextLibTitle")}</h2>
        <p className="text-muted-foreground text-sm">{t("cmsNextLibDescription")}</p>
        <CodeBlock code="npm install @basalf/cms-next" />
        <p className="text-sm">{t("cmsNextEnvInstructions")}</p>
        <CodeBlock label={t("envVarLabel")} code={cmsNextEnvSnippet} />
        <CodeBlock label={t("pageComponentLabel")} code={cmsNextPageSnippet} />
        <CodeBlock label={t("metadataLabel")} code={cmsNextMetadataSnippet} />
        <CodeBlock label={t("listPagesLabel")} code={cmsNextListSnippet} />
      </div>
    </div>
  );
}
