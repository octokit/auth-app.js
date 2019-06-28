export function toTokenAuthentication(
  installationId: number,
  token: string,
  expiresAt: string,
  repositoryIds?: number[]
) {
  return Object.assign({
    type: "token",
    token: token,
    tokenType: "installation",
    installationId,
    expiresAt,
    headers: {
      authorization: `token ${token}`
    },
    query: {}
  }, repositoryIds ? {repositoryIds} : null)
}
