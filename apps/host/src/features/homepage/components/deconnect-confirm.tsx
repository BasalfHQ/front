"use client";

import { useTranslations } from "@repo/i18n";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { Loader2, Trash2 } from "@repo/ui/icons";
import { useState } from "react";
import { deleteDeployment } from "../actions";

export function DeconnectConfirm() {
  const t = useTranslations("homepage");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await deleteDeployment();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="w-full">
        <Button variant="destructive">
          <Trash2 />
          {t("deleteDeployment")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteDeployment")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {t("deleteDeploymentDescription")}
        </DialogDescription>
        {error && <p className="text-red-500">{t("deleteError")}</p>}
        <DialogFooter>
          <Button variant="destructive" disabled={isLoading} onClick={onDelete}>
            {isLoading ? <Loader2 /> : <Trash2 />}
            <p>{t("delete")}</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
