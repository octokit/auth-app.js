import { AuthOptions, StrategyOptionsWithDefaults } from "./types";
import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";
import { getOAuthAuthentication } from "./get-oauth-authentication";

export async function auth(
  state: StrategyOptionsWithDefaults,
  options: AuthOptions
) {
  if (options.type === "app") {
    return getAppAuthentication(state.id, state.privateKey);
  }

  if (options.type === "installation") {
    return getInstallationAuthentication(state, options);
  }

  return getOAuthAuthentication(state, options);
}
