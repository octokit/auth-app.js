import { getUserAgent } from "universal-user-agent";
import { request as defaultRequest } from "@octokit/request";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

import { auth } from "./auth.js";
import { hook } from "./hook.js";
import { getCache } from "./cache.js";
import type { AuthInterface, State, StrategyOptions } from "./types.js";
import { VERSION } from "./version.js";

export { createOAuthUserAuth } from "@octokit/auth-oauth-user";
export type {
  // strategy options
  StrategyOptions,
  // auth options
  AppAuthOptions,
  OAuthAppAuthOptions,
  InstallationAuthOptions,
  OAuthWebFlowAuthOptions,
  OAuthDeviceFlowAuthOptions,
  // authentication objects
  Authentication,
  AppAuthentication,
  OAuthAppAuthentication,
  InstallationAccessTokenAuthentication,
  GitHubAppUserAuthentication,
  GitHubAppUserAuthenticationWithExpiration,
} from "./types.js";

export function createAppAuth(options: StrategyOptions): AuthInterface {
  if (!options.appId) {
    throw new Error("[@octokit/auth-app] appId option is required");
  }
  if (!Number.isFinite(+options.appId)) {
    throw new Error(
      "[@octokit/auth-app] appId option must be a number or numeric string",
    );
  }
  if (!options.privateKey) {
    throw new Error("[@octokit/auth-app] privateKey option is required");
  }
  if ("installationId" in options && !options.installationId) {
    throw new Error(
      "[@octokit/auth-app] installationId is set to a falsy value",
    );
  }

  const log = Object.assign(
    {
      warn: console.warn.bind(console),
    },
    options.log,
  );
  const request =
    options.request ||
    defaultRequest.defaults({
      headers: {
        "user-agent": `octokit-auth-app.js/${VERSION} ${getUserAgent()}`,
      },
    });

  const state: State = Object.assign(
    {
      request,
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
        request,
      }),
    },
  );

  // @ts-expect-error not worth the extra code to appease TS
  return Object.assign(auth.bind(null, state), {
    hook: hook.bind(null, state),
  });
}
