import { auth } from "@repo/auth-ui";

export default async function UserPage() {
  const session = await auth();
  console.log("session: ", session);
  return <div>UserPage</div>;
}
