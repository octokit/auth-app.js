import { Deprecation } from "deprecation";

import { AuthOptions, Authentication, State } from "./types";
import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";

export async function auth(
  state: State,
  options: AuthOptions
): Promise<Authentication> {
  const { type, ...authOptions } = options;
  switch (type) {
    case "app":
      return getAppAuthentication(state);
    case "oauth-app":
      return state.oauthApp({ type: "oauth-app" });
    case "installation":
      return getInstallationAuthentication(state, {
        ...authOptions,
        type: "installation",
      });
    // @ts-expect-error
    case "oauth":
      state.log.warn(
        // @ts-expect-error
        new Deprecation(
          `[@octokit/auth-app] {type: "oauth"} is deprecated. Use {type: "oauth-app"} instead`
        )
      );
    case "oauth-user":
      // @ts-expect-error TODO: infer correct auth options type based on type. authOptions should be typed as "WebFlowAuthOptions | GitHubAppDeviceFlowAuthOptions"
      return state.oauthApp(authOptions);
    default:
      throw new Error(`Invalid auth type: ${type}`);
  }
}
