import { auth } from "@repo/auth-ui";
import { redirect } from "next/navigation";
import { getUsers } from "./actions";
import { UserList } from "./user-list";
import { baseUrl } from "@repo/config";

export default async function UserPage() {
  const session = await auth();

  if (!session) {
    return redirect(baseUrl);
  }

  const users = await getUsers();
  return <UserList initialUsers={users} />;
}
