import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useTranslations,
} from "next-intl";
import { getMessages } from "next-intl/server";
import pick from "pick-deep";

export type Namespace = Exclude<
  Parameters<typeof useTranslations>[0],
  undefined
>;

export async function I18nClientProvider({
  children,
  namespace,
}: {
  children: React.ReactNode;
  namespace: Namespace | Namespace[];
}) {
  const messages = await getMessages();
  const namespaceMessages = pick(messages, namespace) as AbstractIntlMessages;

  return (
    <NextIntlClientProvider messages={namespaceMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
