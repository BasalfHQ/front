import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { getAuthOptions } from "./config";

export async function auth() {
  const session = await getServerSession(getAuthOptions());
  if (!session || isSessionExpired(session)) {
    return null;
  }
  return session;
}

export async function getSession() {
  return await getServerSession(getAuthOptions());
}

export function isSessionExpired(session: Session | null) {
  if (!session) {
    return false;
  }
  return new Date(session.expires) < new Date();
}

export function getAuthHeaders(session: Session | null) {
  if (!session?.idToken) {
    throw new Error("No session or idToken found");
  }
  return { Authorization: session.idToken };
}
