const ADMIN_EMAILS = ["alfgoto@gmail.com"];
const ADMIN_DOMAIN = "@basalf.com";

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email) || email.endsWith(ADMIN_DOMAIN);
}

export function decodeCognitoToken(idToken: string): {
  groups: string[];
  currentOrganization?: string;
  email?: string;
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
    const email = claims["email"];

    return {
      groups: groupsArray,
      currentOrganization: currentOrganization || undefined,
      email: email || undefined,
    };
  } catch (error) {
    console.error("Error decoding Cognito token:", error);
    return { groups: [] };
  }
}
