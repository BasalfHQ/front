"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

export function LoginModal() {
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
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(newUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (challengeData) {
        if (newPassword !== confirmNewPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

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
            setError(errorData.message || "Failed to change password");
          } catch {
            setError(result.error);
          }
          setLoading(false);
        } else if (result?.ok) {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("login");
          const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
          window.location.href = newUrl;
        }
      } else {
        const result = await signIn("cognito", {
          username: email,
          password,
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
          setError("Invalid credentials");
          setLoading(false);
        } else if (result?.ok) {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("login");
          const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
          window.location.href = newUrl;
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed");
      setLoading(false);
    }
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
            {challengeData ? "Set New Password" : "Login"}
          </DialogTitle>
          <DialogDescription>
            {challengeData
              ? "Please set a new password for your account"
              : "Enter your credentials to sign in"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="newPassword">New Password</Label>
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
                  Min 8 chars, uppercase, lowercase, number, special char
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
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
              ? "Loading..."
              : challengeData
                ? "Set Password"
                : "Sign In"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
