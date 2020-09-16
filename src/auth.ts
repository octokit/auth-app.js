import { AuthOptions, Authentication, State } from "./types";
import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";
import { getOAuthAuthentication } from "./get-oauth-authentication";

export async function auth(
  state: State,
  options: AuthOptions
): Promise<Authentication> {
  if (options.type === "app") {
    return getAppAuthentication(state);
  }

  if (options.type === "installation") {
    return getInstallationAuthentication(state, options);
  }

  return getOAuthAuthentication(state, options);
}
