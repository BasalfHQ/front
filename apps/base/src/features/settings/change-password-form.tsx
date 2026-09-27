"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button, Input, Label, toast } from "@repo/ui";
import { Loader2 } from "@repo/ui/icons";
import { changePassword } from "./actions";

export function ChangePasswordForm() {
  const t = useTranslations("settings");
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await changePassword(formData);
      if (result.success) {
        formRef.current?.reset();
        toast(t("passwordChanged"));
      } else {
        setError(t(`errors.${result.error ?? "changeFailed"}`));
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex w-full max-w-md flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">{t("newPassword")}</Label>
        <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("changePassword")}
      </Button>
    </form>
  );
}
