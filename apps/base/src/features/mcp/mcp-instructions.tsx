"use client";

import { useTranslations } from "next-intl";
import { Copy, PageDescription, PageTitle } from "@repo/ui";

interface McpInstructionsProps {
  token: string | undefined;
  mcpUrl: string | undefined;
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative rounded-md border bg-muted/50">
      <pre className="overflow-x-auto p-4 text-xs">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <Copy text={code} />
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

export function McpInstructions({ token, mcpUrl }: McpInstructionsProps) {
  const t = useTranslations("mcp");

  if (!token || !mcpUrl) {
    return (
      <div className="space-y-2">
        <PageTitle>{t("title")}</PageTitle>
        <p className="text-destructive text-sm">{t("tokenUnavailable")}</p>
      </div>
    );
  }

  const claudeDesktopConfig = `{
  "mcpServers": {
    "basalf-cms": {
      "url": "${mcpUrl}",
      "headers": {
        "Token": "${token}"
      }
    }
  }
}`;

  const claudeCodeCommand = `claude mcp add --transport http basalf-cms ${mcpUrl} --header "Token: ${token}"`;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
        <p className="text-muted-foreground text-sm">{t("intro")}</p>
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">{t("connectionDetails")}</h2>
        <Field label={t("serverUrl")} value={mcpUrl} />
        <Field label={t("token")} value={token} />
        <p className="text-destructive text-xs">{t("tokenWarning")}</p>
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">{t("claudeAi")}</h2>
        <p className="text-muted-foreground text-sm">{t("claudeAiInstructions")}</p>
        <Field label={t("claudeAiHeaderName")} value="x-token" />
        <Field label={t("claudeAiHeaderValue")} value={token} />
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">{t("claudeDesktop")}</h2>
        <p className="text-muted-foreground text-sm">
          {t("claudeDesktopInstructions")}
        </p>
        <CodeBlock code={claudeDesktopConfig} />
        <p className="text-muted-foreground text-sm">
          {t("claudeDesktopRestart")}
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">{t("claudeCode")}</h2>
        <p className="text-muted-foreground text-sm">
          {t("claudeCodeInstructions")}
        </p>
        <CodeBlock code={claudeCodeCommand} />
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">{t("otherClients")}</h2>
        <p className="text-muted-foreground text-sm">
          {t("otherClientsInstructions")}
        </p>
        <CodeBlock code={`Token: ${token}`} />
        <p className="text-muted-foreground text-xs">
          {t("otherClientsNote")}
        </p>
      </div>
    </div>
  );
}
