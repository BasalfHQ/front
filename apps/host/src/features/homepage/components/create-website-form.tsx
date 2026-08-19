"use client";

import { Button, Card, CardHeader, Input, toast } from "@repo/ui";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { checkDomainAvailability, getSignedUrl as getSignedUrlAction } from "../actions";
import { Loader2 } from "@repo/ui/icons";
import { WebsiteUpload } from "./folder-upload";
import { validateDomain } from "../utils";
import { UploadUrl } from "@repo/apis";

type variants = "closed" | "domain" | "upload" | "success";

export function CreateWebsiteForm() {
  const [variant, setVariant] = useState<variants>("closed");
  const [domainIdInput, setDomainIdInput] = useState<string>("");
  const [domainId, setDomainId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [signedUrl, setSignedUrl] = useState<UploadUrl | undefined>(undefined);
  const [domainError, setDomainError] = useState<string | null>(null);

  const t = useTranslations("homepage");

  async function getDomainAvailability() {
    setLoading(true);
    try {
      setLoading(true);
      const res = await checkDomainAvailability(domainIdInput);
      if (res?.available) {
        setDomainId(domainIdInput);
        getSignedUrl();
      } else {
        console.log("res:", res);
        toast.error(t("domainUnavailable"));
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(t("domainUnavailable"));
    } finally {
      setLoading(false);
    }
  }

  async function getSignedUrl() {
    setLoading(true);
    try {
      setLoading(true);
      const res = await getSignedUrlAction(domainId);
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
        <div className="flex w-full gap-2">
          <div className="flex gap-0">
            <Input
              type="text"
              className="min-w-[200px]"
              placeholder={t("enterSubDomain")}
              value={domainIdInput}
              onChange={(e) => {
                const val = e.target.value;
                setDomainIdInput(val);
                setDomainError(val ? validateDomain(val) : null);
              }}
            />
            <p className="py-1.5">.host.basalf.com</p>
          </div>
          <Button onClick={getDomainAvailability} disabled={loading || !!domainError || !domainIdInput}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t("check")
            )}
          </Button>
        </div>
        {domainError && (
          <p className="text-sm text-destructive">{t(`error.${domainError}`)}</p>
        )}
        <p
          className="text-sm hover:underline cursor-pointer text-muted-foreground"
          onClick={getSignedUrl}
        >
          <>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("dontWantSubDomain")}
          </>
        </p>
      </Card>
    );
  }

  console.log("signedUrl:", signedUrl);

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
        {signedUrl && <WebsiteUpload uploadUrl={signedUrl} />}
      </Card>
    );
  }
}
