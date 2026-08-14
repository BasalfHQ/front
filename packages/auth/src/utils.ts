const ADMIN_EMAILS = ["alfgoto@gmail.com"];
const ADMIN_DOMAIN = "@basalf.com";

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email) || email.endsWith(ADMIN_DOMAIN);
}

export function getTokenExpiry(token: string): number {
  try {
    const payload = token.split(".")[1];
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const claims = JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
    return (claims.exp as number) * 1000;
  } catch {
    return 0;
  }
}

export function decodeCognitoToken(idToken: string): {
  groups: string[];
  currentOrganization?: string;
  currentWebsite?: string;
  email?: string;
  username?: string;
} {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      return { groups: [] };
    }

    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = Buffer.from(paddedPayload, "base64").toString("utf-8");
    const claims = JSON.parse(decoded);

    const groups = claims["cognito:groups"];
    const groupsArray = Array.isArray(groups) ? groups : [];

    const currentOrganization = claims["custom:currentOrganization"];
    const currentWebsite = claims["custom:currentWebsite"];
    const email = claims["email"];
    const username = claims["cognito:username"] ?? claims["username"];

    return {
      groups: groupsArray,
      currentOrganization: currentOrganization || undefined,
      currentWebsite: currentWebsite || undefined,
      email: email || undefined,
      username: username || undefined,
    };
  } catch (error) {
    console.error("Error decoding Cognito token:", error);
    return { groups: [] };
  }
}
