import { Deprecation } from "deprecation";

import { AuthOptions, Authentication, State } from "./types";
import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";
import { getOAuthAuthentication } from "./get-oauth-authentication";

export async function auth(
  state: State,
  options: AuthOptions
): Promise<Authentication> {
  const { type } = options;

  switch (type) {
    case "app":
      return getAppAuthentication(state);
    case "installation":
      return getInstallationAuthentication(state, options);
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
      throw new Error(`Invalid auth type: ${type}`);
  }
}
