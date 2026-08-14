"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export interface AuthProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60}
      refetchOnWindowFocus
    >
      {children}
    </SessionProvider>
  );
}
