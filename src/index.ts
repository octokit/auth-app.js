import { getUserAgent } from "universal-user-agent";
import { request as defaultRequest } from "@octokit/request";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

import { auth } from "./auth";
import { hook } from "./hook";
import { getCache } from "./cache";
import { AuthInterface, State, StrategyOptions } from "./types";
import { VERSION } from "./version";

export { createOAuthUserAuth } from "@octokit/auth-oauth-user";
export {
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
} from "./types";

export function createAppAuth(options: StrategyOptions): AuthInterface {
  if (!options.appId) {
    throw new Error("[@octokit/auth-app] appId option is required");
  }
  if (!options.privateKey) {
    throw new Error("[@octokit/auth-app] privateKey option is required");
  }
  if ("installationId" in options && !options.installationId) {
    throw new Error(
      "[@octokit/auth-app] installationId is set to a falsy value"
    );
  }

  const log = Object.assign(
    {
      warn: console.warn.bind(console),
    },
    options.log
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
    }
  );

  // @ts-expect-error not worth the extra code to appease TS
  return Object.assign(auth.bind(null, state), {
    hook: hook.bind(null, state),
  });
}
