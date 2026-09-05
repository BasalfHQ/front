"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { useTranslations } from "next-intl";

const TABS = ["google", "iphone", "mac"] as const;
type Tab = (typeof TABS)[number];

export function CalendarSubscriptionClient({ url }: { url: string }) {
  const t = useTranslations("calendar");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("google");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4 bg-gray-50">
        <label className="text-sm font-medium mb-2 block">
          {t("subscriptionUrl")}
        </label>
        <div className="flex gap-2">
          <input
            readOnly
            value={url}
            className="flex-1 rounded-md border px-3 py-2 text-sm bg-white font-mono"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button onClick={handleCopy} variant="outline">
            {copied ? t("copied") : t("copy")}
          </Button>
        </div>
      </div>

      <div>
        <div className="flex border-b">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t(`${tab}.title`)}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {activeTab === "google" && (
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>{t("google.step1")}</li>
              <li>{t("google.step2")}</li>
              <li>{t("google.step3")}</li>
              <li>{t("google.step4")}</li>
              <li>{t("google.step5")}</li>
            </ol>
          )}
          {activeTab === "iphone" && (
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>{t("iphone.step1")}</li>
              <li>{t("iphone.step2")}</li>
              <li>{t("iphone.step3")}</li>
              <li>{t("iphone.step4")}</li>
              <li>{t("iphone.step5")}</li>
            </ol>
          )}
          {activeTab === "mac" && (
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>{t("mac.step1")}</li>
              <li>{t("mac.step2")}</li>
              <li>{t("mac.step3")}</li>
              <li>{t("mac.step4")}</li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
