"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "@repo/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/button";

function getRawSearchParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  const pair = window.location.search
    .slice(1)
    .split("&")
    .find((p) => p.slice(0, p.indexOf("=")) === name);
  if (pair === undefined) return null;
  const raw = pair.slice(pair.indexOf("=") + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function LoginModal() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("login") === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [challengeData, setChallengeData] = useState<{
    session: string;
    username: string;
  } | null>(null);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");
    params.delete("callbackUrl");
    params.delete("error");
    params.delete("username");
    params.delete("code");
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(newUrl);
  };

  const stripInviteParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("username");
    params.delete("code");
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newUrl);
  };

  const attemptSignIn = async (
    username: string,
    pwd: string,
    fromInviteLink = false,
  ) => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("cognito", {
        username,
        password: pwd,
        redirect: false,
      });

      if (result?.error) {
        try {
          const errorData = JSON.parse(result.error);
          if (errorData.challengeName === "NEW_PASSWORD_REQUIRED") {
            setChallengeData({
              session: errorData.session,
              username: errorData.username,
            });
            setLoading(false);
            return;
          }
        } catch {
          // Not a challenge error
        }
        // A user who followed an invite link never typed anything, so
        // "invalid credentials" would be meaningless to them — the link
        // itself (which silently carries a one-time code) is what failed.
        setError(fromInviteLink ? t("accountLinkIssue") : t("invalidCredentials"));
        setLoading(false);
      } else if (result?.ok) {
        closeModal();
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(fromInviteLink ? t("accountLinkIssue") : t("loginFailed"));
      setLoading(false);
    }
  };

  // Invite links from the "new account" email carry ?username=&code= (the
  // temporary password) so the user lands straight on the "set new password"
  // step instead of retyping what the email already gave them.
  useEffect(() => {
    if (!isOpen) return;
    // Cognito's email template substitutes {username} without
    // URL-encoding it, so an address like "alfred+1@x.com" reaches the
    // browser as a literal "+". URLSearchParams (used by
    // useSearchParams()) follows form-encoding rules and decodes that "+"
    // as a space, corrupting the email. Parse the raw query string instead
    // so "+" is read literally.
    const inviteUsername = getRawSearchParam("username");
    const inviteCode = getRawSearchParam("code");
    if (!inviteUsername || !inviteCode) return;

    setEmail(inviteUsername);
    stripInviteParams();
    void attemptSignIn(inviteUsername, inviteCode, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (challengeData) {
      setLoading(true);
      setError("");

      if (newPassword !== confirmNewPassword) {
        setError(t("passwordsMismatch"));
        setLoading(false);
        return;
      }

      try {
        const result = await signIn("cognito", {
          username: challengeData.username,
          password: "",
          session: challengeData.session,
          newPassword: newPassword,
          redirect: false,
        });

        if (result?.error) {
          try {
            const errorData = JSON.parse(result.error);
            setError(errorData.message || t("passwordChangeFailed"));
          } catch {
            setError(result.error);
          }
          setLoading(false);
        } else if (result?.ok) {
          closeModal();
          router.refresh();
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(t("loginFailed"));
        setLoading(false);
      }
      return;
    }

    await attemptSignIn(email, password);
  };

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setError("");
      setChallengeData(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {challengeData ? t("setNewPasswordTitle") : t("signInTitle")}
          </DialogTitle>
          <DialogDescription>
            {challengeData
              ? t("setNewPasswordDescription")
              : t("signInDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              value={challengeData?.username || email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!challengeData || loading}
              required
              autoComplete="email"
              className="max-w-[300px] w-full"
            />
          </div>

          {!challengeData && (
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="current-password"
              />
            </div>
          )}

          {challengeData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("newPassword")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  {t("passwordHint")}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">{t("confirmNewPassword")}</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? t("signingIn")
              : challengeData
                ? t("setPassword")
                : t("signIn")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
