import NextAuth from "next-auth";
import { getAuthOptions } from "@repo/auth-ui";

const handler = NextAuth(getAuthOptions());

export { handler as GET, handler as POST };
