import { githubAppJwt } from "universal-github-app-jwt";

import { AppAuthentication, State } from "./types";

export async function getAppAuthentication({
  id,
  privateKey,
  timeDifference,
}: State): Promise<AppAuthentication> {
  const appAuthentication = await githubAppJwt({
    id,
    privateKey,
    now: timeDifference && Math.floor(Date.now() / 1000) + timeDifference,
  });

  return {
    type: "app",
    token: appAuthentication.token,
    appId: appAuthentication.appId,
    expiresAt: new Date(appAuthentication.expiration * 1000).toISOString(),
  };
}
