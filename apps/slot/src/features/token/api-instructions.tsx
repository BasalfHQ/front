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

  const initSnippet = `import SLOT from "@basalf/slot";

const slot = new SLOT("${token}");`;

  const getServicesSnippet = `const services = await slot.getServices();`;

  const getSlotsSnippet = `const slots = await slot.getSlots(
  "2026-01-01T00:00:00.000Z",
  "2026-02-01T00:00:00.000Z",
);`;

  const getSlotSnippet = `const slot_ = await slot.getSlot(slotId);`;

  const createBookingSnippet = `const booking = await slot.createBooking({
  serviceId,
  slotId,
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  startDate: "2026-01-15T10:00:00.000Z",
  endDate: "2026-01-15T10:30:00.000Z",
  numberOfPerson: 1,
});`;

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
        <h2 className="font-medium">{t("libTitle")}</h2>
        <p className="text-muted-foreground text-sm">{t("libDescription")}</p>
        <CodeBlock code="npm install @basalf/slot" />
        <CodeBlock label={t("initLabel")} code={initSnippet} />
        <CodeBlock label={t("getServicesLabel")} code={getServicesSnippet} />
        <CodeBlock label={t("getSlotsLabel")} code={getSlotsSnippet} />
        <CodeBlock label={t("getSlotLabel")} code={getSlotSnippet} />
        <CodeBlock label={t("createBookingLabel")} code={createBookingSnippet} />
      </div>
    </div>
  );
}
