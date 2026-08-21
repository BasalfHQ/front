"use client";

import { useTranslations } from "@repo/i18n";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  Input,
  DialogDescription,
} from "@repo/ui";
import { Check, Loader2, Pencil, Search } from "@repo/ui/icons";
import { useEffect, useState } from "react";
import { Website } from "@repo/apis";
import {
  changeDomain as changeDomainAction,
  checkDomainAvailability as checkDomainAvailabilityAction,
} from "../actions";

export function ChangeDomain({ website }: { website: Website }) {
  const t = useTranslations("homepage");
  const [isOpen, setIsOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notAvailable, setNotAvailable] = useState(false);

  useEffect(() => {
    setAvailable(false);
    setNotAvailable(false);
    const timeout = setTimeout(() => {
      if (newDomain) {
        checkDomainAvailability();
      }
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timeout);
  }, [newDomain]);

  async function checkDomainAvailability() {
    try {
      setLoading(true);
      const response = await checkDomainAvailabilityAction(newDomain);
      setAvailable(response?.available ?? false);
      setLoading(false);
      console.log("response:", response);
      if (!response?.available) {
        setNotAvailable(true);
      }
    } catch (error) {
      console.error(error);
      setNotAvailable(true);
      setLoading(false);
    }
  }

  async function changeDomain() {
    try {
      setLoading(true);
      await changeDomainAction(website.domainId, newDomain);
      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Pencil className="size-4" />
          {t("changeDomain")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("changeDomain")}</DialogTitle>
          <DialogDescription>{t("newDomainDescription")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-0">
          <div className="flex w-full min-w-0 items-center gap-2">
            <Input
              placeholder={t("newDomain")}
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="w-0 flex-1 max-w-full"
            />

            {loading ? (
              <Loader2 className="size-6 shrink-0 animate-spin" />
            ) : available ? (
              <Check className="size-6 shrink-0" />
            ) : (
              <Search className="size-6 shrink-0" />
            )}
          </div>

          {notAvailable && (
            <p className="text-sm text-destructive">{t("domainUnavailable")}</p>
          )}
        </div>

        <Button className="w-full" disabled={!available || loading} onClick={changeDomain}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            t("changeDomain")
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
