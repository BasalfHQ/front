import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      currentOrganization?: string;
      currentWebsite?: string;
      organizations?: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    groups?: string[];
    currentOrganization?: string;
    currentWebsite?: string;
    email?: string;
  }
}
