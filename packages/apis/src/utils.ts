export function headers(session: { idToken: string }): {
  Authorization: string;
} {
  return {
    Authorization: session.idToken,
  };
}

// Mirrors @basalf/cms's and @basalf/slot's own createApiClient - the token
// carries the API Gateway id, so the URL these libraries hit doesn't need to
// be configured separately, just decoded from the token for display.
export function decodeApiUrl(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.apiId) return null;
    return `https://${payload.apiId}.execute-api.eu-central-1.amazonaws.com`;
  } catch {
    return null;
  }
}
