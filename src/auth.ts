import { AuthOptions, StrategyOptionsWithDefaults } from "./types";
import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";

export async function auth(
  state: StrategyOptionsWithDefaults,
  options: AuthOptions
) {
  if (options.type === "app") {
    return getAppAuthentication(state.id, state.privateKey);
  }

  return getInstallationAuthentication(state, options);
}
