import githubAppJwt from "universal-github-app-jwt";

import type { AppAuthentication, State } from "./types.js";

export async function getAppAuthentication({
  appId,
  privateKey,
  timeDifference,
}: State & {
  timeDifference?: number | undefined;
}): Promise<AppAuthentication> {
  try {
    const authOptions = {
      id: appId,
      privateKey,
    };

    if (timeDifference) {
      Object.assign(authOptions, {
        now: Math.floor(Date.now() / 1000) + timeDifference,
      });
    }

    const appAuthentication = await githubAppJwt(authOptions);

    return {
      type: "app",
      token: appAuthentication.token,
      appId: appAuthentication.appId,
      expiresAt: new Date(appAuthentication.expiration * 1000).toISOString(),
    };
  } catch (error) {
    if (privateKey === "-----BEGIN RSA PRIVATE KEY-----") {
      throw new Error(
        "The 'privateKey` option contains only the first line '-----BEGIN RSA PRIVATE KEY-----'. If you are setting it using a `.env` file, make sure it is set on a single line with newlines replaced by '\n'",
      );
    } else {
      throw error;
    }
  }
}
