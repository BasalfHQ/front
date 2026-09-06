"use client";

import { useState } from "react";

import {
  Button,
  Label,
  Dialog,
  DialogContent,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Textarea,
} from "@repo/ui";

import getPrompt from "./prompt";
import { Cms } from "@repo/apis";
import { Bot } from "@repo/ui/icons";
import { PAGE_CREATED_KEY } from "../../../shared/storage-hooks";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function CreatePageWithAIButton({
  locales,
  pages,
}: {
  locales: Cms.Locales;
  pages: Cms.AllPages;
}) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [locale, setLocale] = useState<Cms.Locales[number]>(locales[0]);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedTempState, setCopiedTempState] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations("pages.CreatePageWithAIButton");

  const copyPrompt = async () => {
    const generatedPrompt = getPrompt(
      locale,
      prompt,
      pages.map((page) => ({
        url: page.url,
        title: page.seo.title,
        description: page.seo.description,
      })),
    );
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setCopiedTempState(true);
    setTimeout(() => {
      setCopiedTempState(false);
    }, 2000);
  };

  const pasteResponse = async () => {
    const text = await navigator.clipboard.readText();
    setResponse(text);
  };

  const languages = Cms.ISO_639_1_CODES_WITH_FLAGS.filter((loc) =>
    locales.includes(loc.code),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bot />
          <p>{t("cta")}</p>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[500px]">
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">{t("title")}</h2>

            <p className="text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-locale">{t("language")}</Label>

            <Select
              onValueChange={(value) => setLocale(value as Cms.Locales[number])}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <p className="text-[1.2rem]">
                    {languages.find((l) => l.code === locale)?.flag}
                  </p>
                  <p>{languages.find((l) => l.code === locale)?.name}</p>
                </div>
              </SelectTrigger>
              <SelectContent portal={false}>
                {languages.map((locale) => (
                  <SelectItem key={locale.code} value={locale.code}>
                    <div className="flex items-center gap-2">
                      <p className="text-[1.2rem]">{locale.flag}</p>
                      <p>{locale.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-prompt">{t("whatPage")}</Label>

            <Textarea
              id="page-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("placeholder")}
              className="min-h-[100px] h-fit text-wrap"
            />
          </div>

          {prompt && locale && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={!prompt || !locale}
                onClick={copyPrompt}
              >
                {copiedTempState ? t("copied") : t("copyPrompt")}
              </Button>

              <p className="text-xs text-muted-foreground">
                {t("copyHint")}
              </p>
            </div>
          )}

          {copied && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="page-response">{t("aiResponse")}</Label>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={pasteResponse}
                >
                  {t("pasteResponse")}
                </Button>
              </div>

              <Textarea
                id="page-response"
                value={response}
                onChange={(e) => setResponse(e.target.value.trim())}
                placeholder={t("pastePlaceholder")}
                className=" font-mono text-xs"
                rows={2}
              />
            </div>
          )}

          <Button
            type="button"
            className="w-full"
            disabled={!response}
            onClick={() => {
              try {
                JSON.parse(response);
                localStorage.setItem(PAGE_CREATED_KEY, response);
                router.push("/create-page");
              } catch {
                setError(true);
              }
            }}
          >
            {t("createPage")}
          </Button>
          {error && (
            <p className="text-red-500">
              {t("invalidResponse")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
