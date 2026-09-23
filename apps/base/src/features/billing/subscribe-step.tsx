import { redirect } from "next/navigation";
import { auth } from "@repo/auth-ui";
import { getTranslations, Link } from "@repo/i18n";
import { PageTitle, PageDescription } from "@repo/ui";
import { baseUrl } from "@repo/config";
import { SubscribeEmbed } from "./subscribe-embed";

export async function SubscribeStep() {
  const session = await auth();

  if (!session?.idToken) {
    return redirect(baseUrl);
  }

  const t = await getTranslations("billing");

  return (
    <div className="w-full px-4 py-10 sm:py-16">
      <PageTitle className="break-words">{t("subscribeStepTitle")}</PageTitle>
      <PageDescription className="mt-2 mb-2 max-w-lg">
        {t("subscribeStepDescription")}
      </PageDescription>
      <div className="mb-8">
        <Link href="/billing" className="text-sm text-gray-500 hover:underline">
          {t("backToBilling")}
        </Link>
      </div>
      <SubscribeEmbed />
    </div>
  );
}
