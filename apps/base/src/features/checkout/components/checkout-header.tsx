import Image from "next/image";
import { Link } from "@repo/i18n";
import { getDraftOrganization } from "../actions";

// Same visual shell as @repo/ui's Nav (logo, border-b, full width) but
// without nav items or the auth slot - checkout is public, no session yet.
// The draft org name stands in for "which org am I in", the closest
// equivalent to Nav's org switcher this pre-auth flow can offer.
export async function CheckoutHeader() {
  const draft = await getDraftOrganization();

  return (
    <nav className="flex items-center justify-between px-4 py-2 border-b w-full">
      <Link
        href={
          process.env.NEXT_PUBLIC_STAGE === "prod"
            ? "https://basalf.com"
            : "http://localhost:3000"
        }
      >
        <Image src="/logo.png" alt="Basalf" width={60} height={60} />
      </Link>
      {draft && (
        <span className="text-sm text-gray-500 truncate max-w-[50%]">{draft.name}</span>
      )}
    </nav>
  );
}
