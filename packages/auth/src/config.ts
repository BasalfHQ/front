import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCognito } from "./cognito";
import { env } from "@repo/config";
import { decodeCognitoToken } from "./utils";

interface UserWithTokens {
  id: string;
  email?: string | null;
  name?: string | null;
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

interface JWTToken {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  sub?: string;
  groups?: string[];
  currentOrganization?: string;
  email?: string;
  [key: string]: unknown;
}

interface SessionWithTokens {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    currentOrganization?: string;
    organizations?: string[];
  };
}

export function getAuthOptions(): NextAuthOptions {
  return {
  providers: [
    CredentialsProvider({
      id: "cognito",
      name: "Cognito",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        session: { label: "Session", type: "text" },
        newPassword: { label: "New Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.session &&
          credentials?.newPassword &&
          credentials?.username
        ) {
          try {
            const cognito = getCognito();
            const result = await cognito.completeNewPasswordChallenge({
              username: credentials.username,
              session: credentials.session,
              newPassword: credentials.newPassword,
            });

            return {
              id: result.user.sub || credentials.username,
              email: result.user.email,
              name: result.user.name,
              accessToken: result.token.accessToken,
              idToken: result.token.idToken,
              refreshToken: result.token.refreshToken,
            } as UserWithTokens;
          } catch (error: unknown) {
            console.error("Password change error:", error);
            if (error && typeof error === "object") {
              const cognitoError = error as {
                name?: string;
                message?: string;
              };

              if (cognitoError.name === "InvalidPasswordException") {
                const errorMessage =
                  cognitoError.message || "Password does not conform to policy";
                throw new Error(JSON.stringify({ message: errorMessage }));
              }
            }
            return null;
          }
        }

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const cognito = getCognito();

          const result = await cognito.signIn({
            username: credentials.username,
            password: credentials.password,
          });

          if ("challengeName" in result) {
            throw new Error(
              JSON.stringify({
                challengeName: result.challengeName,
                session: result.session,
                username: result.username,
              })
            );
          }

          return {
            id: result.user.sub || credentials.username,
            email: result.user.email,
            name: result.user.name,
            accessToken: result.token.accessToken,
            idToken: result.token.idToken,
            refreshToken: result.token.refreshToken,
          } as UserWithTokens;
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.message?.includes("challengeName")
          ) {
            throw error;
          }
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userWithTokens = user as UserWithTokens;
        const jwtToken = token as JWTToken;
        jwtToken.accessToken = userWithTokens.accessToken;
        jwtToken.idToken = userWithTokens.idToken;
        jwtToken.refreshToken = userWithTokens.refreshToken;
        jwtToken.sub = userWithTokens.id;

        if (userWithTokens.idToken) {
          const { groups, currentOrganization, email } = decodeCognitoToken(
            userWithTokens.idToken
          );
          jwtToken.groups = groups;
          jwtToken.currentOrganization = currentOrganization;
          jwtToken.email = email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const jwtToken = token as JWTToken;
      if (jwtToken && session.user) {
        const sessionWithTokens = session as unknown as SessionWithTokens;
        sessionWithTokens.accessToken = jwtToken.accessToken;
        sessionWithTokens.idToken = jwtToken.idToken;
        sessionWithTokens.refreshToken = jwtToken.refreshToken;
        sessionWithTokens.user.currentOrganization = jwtToken.currentOrganization;
        sessionWithTokens.user.organizations = jwtToken.groups || [];
        if (jwtToken.sub) {
          sessionWithTokens.user.id = jwtToken.sub;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/?login=true",
  },
  session: {
    strategy: "jwt",
  },
  cookies: env.auth.cookieDomain()
    ? {
        sessionToken: {
          name: `__Secure-next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: true,
            domain: env.auth.cookieDomain(),
          },
        },
      }
    : undefined,
  secret: env.auth.secret(),
  };
}
