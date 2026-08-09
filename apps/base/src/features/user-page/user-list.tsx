"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { User } from "@repo/apis";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Input,
  Label,
} from "@repo/ui";
import { createUser, deleteUser } from "./actions";

interface UserListProps {
  initialUsers: User[];
}

export function UserList({ initialUsers }: UserListProps) {
  const t = useTranslations("users");
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createUser(formData);
      if (result.success) {
        setOpen(false);
        const form = document.getElementById("create-user-form") as HTMLFormElement;
        form?.reset();
      } else {
        setError(t(result.error ?? "createFailed"));
      }
    });
  }

  async function handleDelete(userId: string) {
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result.success) {
        setUsers(users.filter((u) => u.userId !== userId));
      }
    });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>{t("addUser")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addNewUser")}</DialogTitle>
            </DialogHeader>
            <form id="create-user-form" action={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input id="lastName" name="lastName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mail">{t("email")}</Label>
                <Input id="mail" name="mail" type="email" required />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? t("creating") : t("create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {users.length === 0 ? (
        <p className="text-muted-foreground">{t("noUsers")}</p>
      ) : (
        <div className="border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">{t("name")}</th>
                <th className="text-left p-3 font-medium">{t("email")}</th>
                <th className="text-right p-3 font-medium">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="border-t">
                  <td className="p-3">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-3">{user.mail}</td>
                  <td className="p-3 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.userId)}
                      disabled={isPending}
                    >
                      {t("delete")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
