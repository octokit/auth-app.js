import type * as OAuthAppAuth from "@octokit/auth-oauth-app";

import type {
  Authentication,
  State,
  AppAuthOptions,
  AppAuthentication,
  OAuthAppAuthentication,
  OAuthAppAuthOptions,
  InstallationAuthOptions,
  InstallationAccessTokenAuthentication,
  GitHubAppUserAuthentication,
  GitHubAppUserAuthenticationWithExpiration,
  OAuthWebFlowAuthOptions,
  OAuthDeviceFlowAuthOptions,
} from "./types.js";
import { getAppAuthentication } from "./get-app-authentication.js";
import { getInstallationAuthentication } from "./get-installation-authentication.js";

/** GitHub App authentication */
export async function auth(
  state: State,
  authOptions: AppAuthOptions,
): Promise<AppAuthentication>;

/** OAuth App authentication */
export async function auth(
  state: State,
  authOptions: OAuthAppAuthOptions,
): Promise<OAuthAppAuthentication>;

/** Installation authentication */
export async function auth(
  state: State,
  authOptions: InstallationAuthOptions,
): Promise<InstallationAccessTokenAuthentication>;

/** User Authentication via OAuth web flow */
export async function auth(
  state: State,
  authOptions: OAuthWebFlowAuthOptions,
): Promise<
  GitHubAppUserAuthentication | GitHubAppUserAuthenticationWithExpiration
>;

/** GitHub App Web flow with `factory` option */
export async function auth<T = unknown>(
  state: State,
  authOptions: OAuthWebFlowAuthOptions & {
    factory: OAuthAppAuth.FactoryGitHubWebFlow<T>;
  },
): Promise<T>;

/** User Authentication via OAuth Device flow */
export async function auth(
  state: State,
  authOptions: OAuthDeviceFlowAuthOptions,
): Promise<
  GitHubAppUserAuthentication | GitHubAppUserAuthenticationWithExpiration
>;

/** GitHub App Device flow with `factory` option */
export async function auth<T = unknown>(
  state: State,
  authOptions: OAuthDeviceFlowAuthOptions & {
    factory: OAuthAppAuth.FactoryGitHubDeviceFlow<T>;
  },
): Promise<T>;

export async function auth<T = unknown>(
  state: State,
  authOptions:
    | AppAuthOptions
    | OAuthAppAuthOptions
    | InstallationAuthOptions
    | OAuthWebFlowAuthOptions
    | OAuthDeviceFlowAuthOptions
    | (OAuthWebFlowAuthOptions & {
        factory: OAuthAppAuth.FactoryGitHubWebFlow<T>;
      })
    | (OAuthDeviceFlowAuthOptions & {
        factory: OAuthAppAuth.FactoryGitHubDeviceFlow<T>;
      }),
): Promise<Authentication> {
  switch (authOptions.type) {
    case "app":
      return getAppAuthentication(state);
    case "oauth-app":
      return state.oauthApp({ type: "oauth-app" });
    case "installation":
      authOptions;
      return getInstallationAuthentication(state, {
        ...authOptions,
        type: "installation",
      });
    case "oauth-user":
      // @ts-expect-error TODO: infer correct auth options type based on type. authOptions should be typed as "WebFlowAuthOptions | OAuthAppDeviceFlowAuthOptions | GitHubAppDeviceFlowAuthOptions"
      return state.oauthApp(authOptions);
    default:
      // @ts-expect-error type is "never" at this point
      throw new Error(`Invalid auth type: ${authOptions.type}`);
  }
}
