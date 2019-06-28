import { request } from "@octokit/request";

import { StrategyOptionsWithDefaults, AuthOptions, Permissions } from "./types";
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
      const [
        token,
        expiresAt,
        permissionsString,
        repositoryIdsString,
        singleFileName
      ] = result.split("|");

      const permissions = permissionsString
        .split(/,/)
        .reduce((permissions: Permissions, string) => {
          if (/!$/.test(string)) {
            permissions[string.slice(0, -1)] = "write";
          } else {
            permissions[string] = "read";
          }

          return permissions;
        }, {});

      return toTokenAuthentication(
        options.installationId,
        token,
        expiresAt,
        permissions,
        repositoryIdsString
          ? repositoryIdsString.split(",").map(id => parseInt(id, 10))
          : undefined,
        singleFileName
      );
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
      permissions: options.permissions,
      previews: ["machine-man"],
      headers: appAuthentication.headers
    }
  );

  const {
    data: { permissions, single_file_name: singleFileName }
  } = await state.request("GET /app/installations/:installation_id", {
    installation_id: options.installationId,
    previews: ["machine-man"],
    headers: appAuthentication.headers
  });

  const permissionsString = Object.keys(permissions)
    .map(name => `${name}${permissions[name] === "write" ? "!" : ""}`)
    .join(",");
  // @ts-ignore
  const repositoryIds = repositories ? repositories.map(r => r.id) : undefined;
  const repositoryIdsString = repositories
    ? repositoryIds.join(",")
    : undefined;

  state.cache.set(
    options.installationId,
    [token, expires_at, permissionsString, repositoryIdsString, singleFileName]
      .join("|")
      .replace(/\|+$/, "")
  );

  return toTokenAuthentication(
    options.installationId,
    token,
    expires_at,
    permissions,
    repositoryIds,
    singleFileName
  );
}
