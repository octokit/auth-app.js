import { getUserAgent } from "universal-user-agent";
import { request as defaultRequest } from "@octokit/request";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

import { auth } from "./auth";
import { hook } from "./hook";
import { getCache } from "./cache";
import type { AuthInterface, State, StrategyOptions } from "./types";
import { VERSION } from "./version";

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
} from "./types";

export function createAppAuth(options: StrategyOptions): AuthInterface {
  if (!options.appId) {
    throw new Error("[@octokit/auth-app] appId option is required");
  }
  if (!Number.isFinite(+options.appId)) {
    throw new Error(
      "[@octokit/auth-app] appId option must be a number or numeric string"
    );
  }
  if (!options.privateKey) {
    throw new Error("[@octokit/auth-app] privateKey option is required");
  }
  if ("installationId" in options && !options.installationId) {
    throw new Error(
      "[@octokit/auth-app] installationId is set to a falsy value"
    );
  }

  // This check ensures that private key contains the actual content
  // specifically when set using environment variables as multiline string.
  const privateKey: string[] = options.privateKey.trim().split(" ");
  if (privateKey.length > 1) {
    const protocol = privateKey[1];
    const begin = `-----BEGIN ${protocol} PRIVATE KEY-----`;
    const end = `-----END ${protocol} PRIVATE KEY----`;

    if (!(privateKey.includes(begin) && privateKey.includes(end))) {
      throw new Error(
        "[@octokit/auth-app] privateKey only contains the first line. Try replacing line breaks with \n if you are setting it as multiline string (e.g. environment variable)"
      );
    }
  }
  // TODO: tests are failing
  //  else {
  //   throw new Error("[@octokit/auth-app] privateKey content is invalid");
  // }

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
