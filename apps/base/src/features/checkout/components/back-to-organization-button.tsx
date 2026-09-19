"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { abandonDraftOrganization } from "../actions";

// Abandoning the draft is destructive - if the user already finished paying
// and landed back here (browser back, slow return-url redirect), this would
// orphan the org they just paid for and let them create a second one. A
// confirmation is the only guard available client-side since there's no
// public endpoint to check whether the draft already has a subscription.
export function BackToOrganizationButton() {
  const t = useTranslations("checkout");
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm(t("backToOrganizationConfirm"))) return;
    startTransition(() => {
      abandonDraftOrganization();
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-sm text-gray-500 hover:underline disabled:opacity-50"
    >
      {t("backToOrganization")}
    </button>
  );
}
