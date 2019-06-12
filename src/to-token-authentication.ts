export function toTokenAuthentication(
  installationId: number,
  token: string,
  expiresAt: string
) {
  return {
    type: "token",
    token: token,
    tokenType: "installation",
    installationId: installationId,
    expiresAt,
    headers: {
      authorization: `token ${token}`
    },
    query: {}
  };
}
