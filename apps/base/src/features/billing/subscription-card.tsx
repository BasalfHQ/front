"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Button,
  Card,
  CardHeader,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  toast,
  formatDate,
} from "@repo/ui";
import { CreditCard, RotateCcw, XCircle, Loader2 } from "@repo/ui/icons";
import type { Stripe } from "@repo/apis";
import { cancelSubscription, restartSubscription, createPortalSession } from "./actions";
import { usePollSubscription } from "./use-poll-subscription";

const BADGE_VARIANT_BY_STATUS: Record<string, "success" | "destructive" | "secondary"> = {
  active: "success",
  trialing: "success",
  past_due: "destructive",
  unpaid: "destructive",
  canceled: "destructive",
  incomplete_expired: "destructive",
};

export function SubscriptionCard({
  subscription: initialSubscription,
}: {
  subscription: Stripe.Subscription;
}) {
  const t = useTranslations("billing");
  const locale = useLocale();
  const [subscription, setSubscription] = useState(initialSubscription);
  const [loading, setLoading] = useState<"cancel" | "restart" | "portal" | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const { poll, isPolling } = usePollSubscription();

  const handleCancel = async () => {
    setLoading("cancel");
    try {
      const result = await cancelSubscription();
      if (!result.success) {
        toast(result.error || t("cancelFailed"));
        return;
      }
      const { confirmed, subscription: updated } = await poll((s) => s?.cancelAtPeriodEnd === true);
      if (confirmed && updated) setSubscription(updated);
      toast(confirmed ? t("cancelSuccess") : t("cancelPendingTimeout"));
    } finally {
      setLoading(null);
      setConfirmingCancel(false);
    }
  };

  const handleRestart = async () => {
    setLoading("restart");
    try {
      const result = await restartSubscription();
      if (!result.success) {
        toast(result.error || t("restartFailed"));
        return;
      }
      const { confirmed, subscription: updated } = await poll((s) => s?.cancelAtPeriodEnd === false);
      if (confirmed && updated) setSubscription(updated);
      toast(confirmed ? t("restartSuccess") : t("restartPendingTimeout"));
    } finally {
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setLoading("portal");
    try {
      const result = await createPortalSession();
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      toast(result.error || t("portalFailed"));
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <p className="font-medium">{subscription.planId}</p>
            <Badge variant={BADGE_VARIANT_BY_STATUS[subscription.status] ?? "secondary"}>
              {subscription.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {subscription.cancelAtPeriodEnd
              ? t("endsOn", { date: formatDate(subscription.currentPeriodEnd, locale) })
              : t("renewsOn", { date: formatDate(subscription.currentPeriodEnd, locale) })}
          </p>
        </CardHeader>

        <div className="flex flex-col w-full gap-2 pt-2">
          <Button variant="outline" onClick={handlePortal} disabled={loading !== null} className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            {t("managePayment")}
          </Button>

          {subscription.cancelAtPeriodEnd ? (
            <Button onClick={handleRestart} disabled={loading !== null} className="w-full">
              {loading === "restart" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="mr-2 h-4 w-4" />
              )}
              {loading === "restart" ? (isPolling ? t("confirming") : t("restarting")) : t("restart")}
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => setConfirmingCancel(true)}
              disabled={loading !== null}
              className="w-full"
            >
              <XCircle className="mr-2 h-4 w-4" />
              {t("cancel")}
            </Button>
          )}
        </div>
      </Card>

      <Dialog open={confirmingCancel} onOpenChange={setConfirmingCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cancelConfirmTitle")}</DialogTitle>
            <DialogDescription>
              {t("cancelConfirmDescription", {
                date: formatDate(subscription.currentPeriodEnd, locale),
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmingCancel(false)} disabled={loading !== null}>
              {t("cancelConfirmDismiss")}
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={loading !== null}>
              {loading === "cancel" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading === "cancel" ? (isPolling ? t("confirming") : t("canceling")) : t("cancelConfirmAction")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
