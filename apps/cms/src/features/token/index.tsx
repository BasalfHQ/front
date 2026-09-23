import { redirect } from "@repo/i18n";
import { auth } from "@repo/auth-ui";
import { Cms, decodeApiUrl } from "@repo/apis";
import { ApiInstructions } from "./api-instructions";

export async function Token({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [session, { locale }] = await Promise.all([auth(), params]);
  if (!session || !session.idToken) {
    return redirect({ href: "/", locale });
  }

  const token = await Cms.getToken(session.idToken);
  if (!token) {
    return redirect({ href: "/", locale });
  }

  return <ApiInstructions token={token} apiUrl={decodeApiUrl(token)} />;
}
