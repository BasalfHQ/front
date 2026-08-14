"use client";

import { Locales, ISO_639_1_CODES_WITH_FLAGS } from "@repo/apis";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from "@repo/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { updateLocales } from "../actions";

export function LocalesModale({ locales }: { locales: Locales }) {
  const [isOpen, setIsOpen] = useState(locales.length > 0 ? false : true);
  const [selectedLocale, setSelectedLocale] = useState<Locales>(locales || []);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const t = useTranslations("pages.LocalesModale");

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await updateLocales(selectedLocale);
      setIsOpen(false);
      toast.success(t("success"));
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center rounded-md border px-4 py-1 hover:cursor-pointer">
          <p className="text-sm text-muted-foreground">
            {t("yourLocales", { count: locales?.length || 0 })}
          </p>
          <div className="flex gap-2 items-center">
            {locales?.map((locale) => {
              const localeObject = ISO_639_1_CODES_WITH_FLAGS.find(
                (l) => l.code === locale,
              );
              if (!localeObject) return null;
              return (
                <p key={localeObject.code} className="text-sm">
                  {localeObject.flag}
                </p>
              );
            })}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Popover>
          <PopoverTrigger asChild>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                {t("addLocale")}
              </Button>
              <div className="flex-1 flex gap-1 items-center">
                {selectedLocale.map((locale) => (
                  <p
                    key={locale}
                    className="cursor-pointer text-[22px]"
                    onClick={() =>
                      setSelectedLocale(
                        selectedLocale.filter((l) => l !== locale),
                      )
                    }
                  >
                    {
                      ISO_639_1_CODES_WITH_FLAGS.find((l) => l.code === locale)
                        ?.flag
                    }
                  </p>
                ))}
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-[230px] p-2" align="start">
            <Input
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="mt-2 max-h-[220px] overflow-y-auto">
              {ISO_639_1_CODES_WITH_FLAGS.filter((locale) =>
                locale.name.toLowerCase().includes(search.toLowerCase()),
              ).map((locale) => {
                const isSelected = selectedLocale.includes(locale.code);

                return (
                  <div
                    key={locale.code}
                    className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-muted"
                    onClick={() =>
                      setSelectedLocale(
                        isSelected
                          ? selectedLocale.filter((l) => l !== locale.code)
                          : [...selectedLocale, locale.code],
                      )
                    }
                  >
                    <Checkbox checked={isSelected} />
                    <p>{locale.flag}</p>
                    <p>{locale.name}</p>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || selectedLocale.length === 0}
          variant="success"
        >
          {t("submit")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
