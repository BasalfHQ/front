"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@repo/i18n";
import { PageTitle, PageDescription, Button } from "@repo/ui";
import { Loader2 } from "@repo/ui/icons";
import { usePollSubscription } from "./use-poll-subscription";
import { isUsableSubscription } from "./needs-subscription";

export function SubscribeReturnStatus() {
  const t = useTranslations("billing");
  const { poll, isPolling } = usePollSubscription();
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    poll(isUsableSubscription).then(({ confirmed }) => setConfirmed(confirmed));
    // Only ever runs once per mount - poll/setConfirmed are stable across
    // renders, re-running this on their identity would just restart the poll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (confirmed === null || isPolling) {
    return (
      <>
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-muted-foreground" />
        <PageTitle className="mb-4">{t("confirmingTitle")}</PageTitle>
        <PageDescription className="mb-8">{t("confirmingDescription")}</PageDescription>
      </>
    );
  }

  return (
    <>
      <PageTitle className="mb-4">
        {confirmed ? t("subscribeSuccessTitle") : t("confirmTimeoutTitle")}
      </PageTitle>
      <PageDescription className="mb-8">
        {confirmed ? t("subscribeSuccessDescription") : t("confirmTimeoutDescription")}
      </PageDescription>
      <Button asChild>
        <Link href="/billing">{t("backToBilling")}</Link>
      </Button>
    </>
  );
}
