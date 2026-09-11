import { auth, isAdmin } from "@repo/auth-ui";
import { redirect } from "next/navigation";
import { Mcp } from "@repo/apis";
import { baseUrl, env } from "@repo/config";
import { McpInstructions } from "./mcp-instructions";

export async function McpPage() {
  const session = await auth();

  if (!isAdmin(session?.user?.email) || !session?.idToken) {
    return redirect(baseUrl);
  }

  const token = await Mcp.getToken(session.idToken);
  const mcpUrl = env.mcpUrl();

  return <McpInstructions token={token} mcpUrl={mcpUrl} />;
}
