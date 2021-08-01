import { githubAppJwt } from "universal-github-app-jwt";

import { AppAuthentication, State } from "./types";

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
    if (privateKey === "-----BEGIN RSA PRIVATE KEY-----") {
      throw new Error(
        "Private key is incomplete. Make sure it is a single line String and newlines have been replaced by '\n'"
      );
    } else {
      throw error;
    }
  }
}
