"use client";

import { Button, Card, CardHeader, Input, toast } from "@repo/ui";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  checkDomainAvailability,
  getSignedUrl as getSignedUrlAction,
} from "../actions";
import { Check, Loader2, Search } from "@repo/ui/icons";
import { WebsiteUpload } from "./folder-upload";
import { validateDomain } from "../utils";
import { Host } from "@repo/apis";

type variants = "closed" | "domain" | "upload" | "success";

export function CreateWebsiteForm() {
  const [variant, setVariant] = useState<variants>("closed");
  const [domainIdInput, setDomainIdInput] = useState<string>("");
  const [domainId, setDomainId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [signedUrl, setSignedUrl] = useState<Host.UploadUrl | undefined>(
    undefined,
  );
  const [domainError, setDomainError] = useState<string | null>(null);
  const [domainAvailable, setDomainAvailable] = useState(false);
  const [domainNotAvailable, setDomainNotAvailable] = useState(false);
  const [checkingDomain, setCheckingDomain] = useState(false);
  const router = useRouter();

  const t = useTranslations("homepage");

  useEffect(() => {
    setDomainAvailable(false);
    setDomainNotAvailable(false);
    const validationError = domainIdInput
      ? validateDomain(domainIdInput)
      : null;
    setDomainError(validationError);
    if (!domainIdInput || validationError) return;

    const timeout = setTimeout(async () => {
      try {
        setCheckingDomain(true);
        const res = await checkDomainAvailability(domainIdInput);
        setDomainAvailable(res?.available ?? false);
        if (!res?.available) setDomainNotAvailable(true);
      } catch {
        setDomainNotAvailable(true);
      } finally {
        setCheckingDomain(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [domainIdInput]);

  async function goToUpload(skipDomain?: boolean) {
    setLoading(true);
    try {
      const chosenDomain =
        !skipDomain && domainAvailable ? domainIdInput : undefined;
      const res = await getSignedUrlAction(chosenDomain);
      setDomainId(res.domainId);
      setSignedUrl(res);
      setVariant("upload");
    } catch (error) {
      console.log("error:", error);
      toast.error(t("error.uploadYourWebsiteError"));
    } finally {
      setLoading(false);
    }
  }

  if (variant === "closed") {
    return (
      <Button onClick={() => setVariant("domain")} className="w-[200px]">
        {t("createWebsite")}
      </Button>
    );
  }
  if (variant === "domain") {
    return (
      <Card className="max-w-[800px] flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <CardHeader>{t("choseSubDomain")}</CardHeader>
          <p className="text-sm text-muted-foreground word-break">
            {t("choseSubDomainDescription")}
          </p>
        </div>
        <div className="flex w-full min-w-0 items-center gap-2">
          <Input
            type="text"
            className="w-0 flex-1"
            placeholder={t("enterSubDomain")}
            value={domainIdInput}
            onChange={(e) => setDomainIdInput(e.target.value)}
          />
          <p className="shrink-0 py-1.5">.bslf.app</p>
          {checkingDomain ? (
            <Loader2 className="size-5 shrink-0 animate-spin" />
          ) : domainAvailable ? (
            <Check className="size-5 shrink-0 text-green-500" />
          ) : (
            <Search className="size-5 shrink-0 text-muted-foreground" />
          )}
        </div>
        {domainError && (
          <p className="text-sm text-destructive">
            {t(`error.${domainError}`)}
          </p>
        )}
        {domainNotAvailable && !domainError && (
          <p className="text-sm text-destructive">{t("domainUnavailable")}</p>
        )}
        <Button
          className="w-full"
          onClick={() => goToUpload(false)}
          disabled={loading || (!!domainIdInput && !domainAvailable)}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : t("next")}
        </Button>
        <p
          className="text-sm hover:underline cursor-pointer text-muted-foreground text-center"
          onClick={() => goToUpload(true)}
        >
          {t("dontWantSubDomain")}
        </p>
      </Card>
    );
  }

  if (variant === "upload") {
    return (
      <Card className="max-w-[800px] flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p
            className="text-sm hover:underline cursor-pointer text-muted-foreground"
            onClick={() => setVariant("domain")}
          >
            {domainId ? t("changeDomain") : t("addDomain")}
          </p>
          {domainId && <p>{t("websiteOnThisUrl", { url: domainId })}</p>}
        </div>
        {signedUrl && (
          <WebsiteUpload
            uploadUrl={signedUrl}
            onSuccess={() => setVariant("success")}
            onError={(error) => toast.error(error.message)}
          />
        )}
      </Card>
    );
  }

  if (variant === "success") {
    return (
      <SuccessPolling domainId={domainId} onReady={() => router.refresh()} />
    );
  }
}

function SuccessPolling({
  domainId,
  onReady,
}: {
  domainId: string | undefined;
  onReady: () => void;
}) {
  const t = useTranslations("homepage");

  useEffect(() => {
    if (!domainId) return;

    const stage = process.env.NEXT_PUBLIC_STAGE === "dev" ? ".dev" : "";
    const url = `https://${domainId}${stage}.bslf.app`;

    const id = setInterval(async () => {
      try {
        const res = await fetch(url, { mode: "no-cors" });
        if (res.type === "opaque" || res.ok) {
          clearInterval(id);
          onReady();
        }
      } catch {}
    }, 2000);

    return () => clearInterval(id);
  }, [domainId, onReady]);

  return (
    <Card className="max-w-[800px] flex flex-col gap-4 items-center">
      <CardHeader>{t("websiteCreated")}</CardHeader>
      <p className="text-sm text-muted-foreground">
        {t("websiteCreatedDescription", {
          url: domainId + ".bslf.app",
        })}
      </p>
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </Card>
  );
}
