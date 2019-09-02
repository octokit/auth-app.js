import { githubAppJwt } from "universal-github-app-jwt";

export async function getAppAuthentication(id: number, privateKey: string) {
  const appAuthentication = await githubAppJwt({ id, privateKey });

  return {
    type: "app",
    token: appAuthentication.token,
    appId: appAuthentication.appId,
    expiresAt: new Date(appAuthentication.expiration * 1000).toISOString()
  };
}
