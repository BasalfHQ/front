"use client";

import { useSession } from "next-auth/react";

export function ClientComponent() {
  const { data: session } = useSession();
  console.log("session: ", session);
  return <div>ClientComponent</div>;
}
