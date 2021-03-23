import { getUserAgent } from "universal-user-agent";
import { request } from "@octokit/request";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

import { auth } from "./auth";
import { hook } from "./hook";
import { getCache } from "./cache";
import { StrategyInterface, State, StrategyOptions } from "./types";
import { VERSION } from "./version";

export { createOAuthUserAuth } from "@octokit/auth-oauth-user";

export const createAppAuth: StrategyInterface = function createAppAuth(
  options: StrategyOptions
) {
  const log = Object.assign(
    {
      warn: console.warn.bind(console),
    },
    options.log
  );

  const state: State = Object.assign(
    {
      request: request.defaults({
        headers: {
          "user-agent": `octokit-auth-app.js/${VERSION} ${getUserAgent()}`,
        },
      }),
      cache: getCache(),
    },
    options,
    options.installationId
      ? { installationId: Number(options.installationId) }
      : {},
    {
      log,
      oauthApp: createOAuthAppAuth({
        clientType: "github-app",
        clientId: options.clientId || "",
        clientSecret: options.clientSecret || "",
      }),
    }
  );

  return Object.assign(auth.bind(null, state), {
    hook: hook.bind(null, state),
  });
};
