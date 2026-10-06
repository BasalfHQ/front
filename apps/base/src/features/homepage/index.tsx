import { auth } from "@repo/auth-ui";
import { Dashboard } from "./dashboard";
import { PublicHome } from "./public-home";

export async function Homepage() {
  const session = await auth();

  return session?.idToken ? <Dashboard session={session} /> : <PublicHome />;
}
