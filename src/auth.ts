import { Deprecation } from "deprecation";

import { AuthOptions, Authentication, State } from "./types";
import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";
import { getOAuthAuthentication } from "./get-oauth-authentication";

export async function auth(
  state: State,
  options: AuthOptions
): Promise<Authentication> {
  switch (options.type) {
    case "app":
      return getAppAuthentication(state);
    case "oauth-app":
      return state.oauthApp({ type: "oauth-app" });
    case "installation":
      return getInstallationAuthentication(state, {
        ...options,
        // TypeScript is making us do this
        type: "installation",
      });
    case "oauth":
      state.log.warn(
        // @ts-expect-error
        new Deprecation(
          `[@octokit/auth-app] {type: "oauth"} is deprecated. Use {type: "oauth-app"} instead`
        )
      );
    case "oauth-user":
      return getOAuthAuthentication(state, options);
    default:
      throw new Error(`Invalid auth type: ${options.type}`);
  }
}
