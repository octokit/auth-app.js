import { request } from "@octokit/request";

import { StrategyOptionsWithDefaults, AuthOptions } from "./types";
import { isAppRoute } from "./is-app-route";
import { toTokenAuthentication } from "./to-token-authentication";
import { toAppAuthentication } from "./to-app-authentication";

export async function auth(
  state: StrategyOptionsWithDefaults,
  options?: AuthOptions
) {
  if (options) {
    const result = state.cache.get(options.installationId);
    if (result) {
      const [token, expiresAt] = result.split("|");
      return toTokenAuthentication(options.installationId, token, expiresAt);
    }
  }

  const appAuthentication = toAppAuthentication(state.id, state.privateKey);

  if (!options || isAppRoute(options.url)) {
    return appAuthentication;
  }

  const {
    data: { token, expires_at, repositories }
  } = await state.request(
    "POST /app/installations/:installation_id/access_tokens",
    {
      installation_id: options.installationId,
      repository_ids: options.repositoryIds,
      previews: ["machine-man"],
      headers: appAuthentication.headers
    }
  );

  // @ts-ignore
  const repositoryIds = repositories ? repositories.map(r => r.id) : undefined;

  state.cache.set(
    options.installationId,
    [token, expires_at, repositoryIds].filter(Boolean).join("|")
  );
  return toTokenAuthentication(
    options.installationId,
    token,
    expires_at,
    repositoryIds
  );
}
