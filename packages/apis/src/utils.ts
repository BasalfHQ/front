export function headers(session: { idToken: string }): {
  Authorization: string;
} {
  return {
    Authorization: session.idToken,
  };
}
