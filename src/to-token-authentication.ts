export function toTokenAuthentication(
  installationId: number,
  token: string,
  expiresAt: string,
  permissions: { [name: string]: string },
  repositoryIds?: number[],
  singleFileName?: string
) {
  return Object.assign(
    {
      type: "token",
      token: token,
      tokenType: "installation",
      installationId,
      permissions,
      expiresAt,
      headers: {
        authorization: `token ${token}`
      },
      query: {}
    },
    repositoryIds ? { repositoryIds } : null,
    singleFileName ? { singleFileName } : null
  );
}
