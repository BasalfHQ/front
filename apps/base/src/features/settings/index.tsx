import { redirect } from "next/navigation";
import { auth, LocaleSwitcher } from "@repo/auth-ui";
import { getTranslations } from "@repo/i18n";
import { PageDescription, PageTitle } from "@repo/ui";
import { baseUrl } from "@repo/config";
import { SubscriptionSection } from "@/features/billing";
import { ChangePasswordForm } from "./change-password-form";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 border-t pt-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export async function SettingsPage() {
  const session = await auth();

  if (!session?.idToken) {
    return redirect(baseUrl);
  }

  const [t, tBilling] = await Promise.all([getTranslations("settings"), getTranslations("billing")]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <PageTitle>{t("title")}</PageTitle>
        <PageDescription>{t("description")}</PageDescription>
      </div>

      <Section title={t("languageTitle")} description={t("languageDescription")}>
        <LocaleSwitcher className="w-40" />
      </Section>

      <Section title={tBilling("title")} description={tBilling("description")}>
        <SubscriptionSection />
      </Section>

      <Section title={t("passwordTitle")} description={t("passwordDescription")}>
        <ChangePasswordForm />
      </Section>
    </div>
  );
}
