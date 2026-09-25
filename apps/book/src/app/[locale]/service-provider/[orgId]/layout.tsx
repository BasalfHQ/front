import { notFound } from "next/navigation";
import { isBlockedOrg } from "@/lib/blocked-orgs";

type Props = {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
};

export default async function Layout({ children, params }: Props) {
  const { orgId } = await params;
  if (isBlockedOrg(orgId)) notFound();
  return children;
}
