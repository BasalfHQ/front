import { auth, isAdmin } from "@repo/auth-ui";
import { CreateOrgForm } from "./components/create-org-form";
import { redirect } from "next/navigation";
import { getOrganizations as apiGetOrganizations } from "@repo/apis";
import { getTranslations } from "@repo/i18n";

export async function OrganizationPage() {
  const session = await auth();

  if (!isAdmin(session?.user?.email) || !session?.idToken) {
    return redirect(
      process.env.NEXT_PUBLIC_STAGE === "prod"
        ? "https://basalf.com/"
        : "http://localhost:3000/",
    );
  }

  const [t, organizations] = await Promise.all([
    getTranslations("organization"),
    apiGetOrganizations(session.idToken),
  ]);

  return (
    <div className="p-8 max-w-2xl">
      <CreateOrgForm />
      <h2 className="text-xl font-semibold mb-4">
        {t("existingOrganizations")}
      </h2>
      {organizations.length === 0 ? (
        <p className="text-gray-500">{t("noOrganizations")}</p>
      ) : (
        <ul className="space-y-2">
          {organizations.map((org) => (
            <li key={org.organizationId} className="p-3 border rounded">
              <span className="font-medium">{org.name}</span>
              <span className="text-gray-500 text-sm ml-2">
                ({org.organizationId})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
