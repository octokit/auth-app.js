import { githubAppJwt } from "universal-github-app-jwt";

import type { AppAuthentication, State } from "./types";

export async function getAppAuthentication({
  appId,
  privateKey,
  timeDifference,
}: State & { timeDifference?: number }): Promise<AppAuthentication> {
  try {
    const appAuthentication = await githubAppJwt({
      id: +appId,
      privateKey,
      now: timeDifference && Math.floor(Date.now() / 1000) + timeDifference,
    });

    return {
      type: "app",
      token: appAuthentication.token,
      appId: appAuthentication.appId,
      expiresAt: new Date(appAuthentication.expiration * 1000).toISOString(),
    };
  } catch (error) {
    if (/^-----BEGIN .* PRIVATE KEY-----$/.test(privateKey.trim()) === false) {
      throw new Error(
        "[@octokit/auth-app] privateKey only contains the first line. Try replacing line breaks with \n if you are setting it as multiline string (e.g. environment variable)"
      );
    } else {
      throw error;
    }
  }
}
