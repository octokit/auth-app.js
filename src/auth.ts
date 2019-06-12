import jsonwebtoken from "jsonwebtoken";
import { request } from "@octokit/request";

import { StrategyOptionsWithRequest, AuthOptions } from "./types";
import { isAppRoute } from "./is-app-route";

export async function auth(
  state: StrategyOptionsWithRequest,
  options?: AuthOptions
) {
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + 60 * 10; // JWT expiration time (10 minute maximum)
  const payload = {
    iat: now, // Issued at time
    exp: expiration,
    iss: state.id
  };

  const JWT = jsonwebtoken.sign(payload, state.privateKey, {
    algorithm: "RS256"
  });

  const appAuthentication = {
    type: "app",
    token: JWT,
    appId: state.id,
    expiration,
    headers: {
      authorization: `bearer ${JWT}`
    },
    query: {}
  };

  if (!options || isAppRoute(options.url)) {
    return appAuthentication;
  }

  const {
    data: { token, expires_at }
  } = await state.request(
    "POST /app/installations/:installation_id/access_tokens",
    {
      installation_id: options.installationId,
      previews: ["machine-man"],
      headers: appAuthentication.headers
    }
  );

  return {
    type: "token",
    token: token,
    tokenType: "installation",
    installationId: options.installationId,
    expiresAt: expires_at,
    headers: {
      authorization: `token ${token}`
    },
    query: {}
  };
}
