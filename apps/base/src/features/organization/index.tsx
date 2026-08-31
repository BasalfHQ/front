import { auth, isAdmin } from "@repo/auth-ui";
import { CreateOrgForm } from "./components/create-org-form";
import { OrgList } from "./components/org-list";
import { redirect } from "next/navigation";
import { getOrganizations as apiGetOrganizations } from "@repo/apis";
import { baseUrl } from "@repo/config";

export async function OrganizationPage() {
  const session = await auth();

  if (!isAdmin(session?.user?.email) || !session?.idToken) {
    return redirect(baseUrl);
  }

  const organizations = await apiGetOrganizations(session.idToken);

  return (
    <div>
      <CreateOrgForm />
      <OrgList organizations={organizations} />
    </div>
  );
}
