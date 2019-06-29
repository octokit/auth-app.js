// https://github.com/isaacs/node-lru-cache#readme
import LRU from "lru-cache";

import { AuthOptions, Cache, CacheData, Permissions } from "./types";

export function getCache() {
  return new LRU<number, string>({
    // cache max. 15000 tokens, that will use less than 10mb memory
    max: 15000,
    // Cache for 1 minute less than GitHub expiry
    maxAge: 1000 * 60 * 59
  });
}

export function get(cache: Cache, options: AuthOptions) {
  const cacheKey = optionsToCacheKey(options);
  const result = cache.get(cacheKey);

  if (!result) {
    return;
  }

  const [token, expiresAt, permissionsString, singleFileName] = result.split(
    "|"
  );

  const permissions =
    options.permissions ||
    permissionsString.split(/,/).reduce(
      (permissions: Permissions, string) => {
        if (/!$/.test(string)) {
          permissions[string.slice(0, -1)] = "write";
        } else {
          permissions[string] = "read";
        }

        return permissions;
      },
      {} as Permissions
    );

  return {
    token,
    expiresAt,
    permissions,
    repositoryIds: options.repositoryIds,
    singleFileName
  };
}
export function set(cache: Cache, options: AuthOptions, data: CacheData) {
  const cacheKey = optionsToCacheKey(options);

  const permissionsString = options.permissions
    ? ""
    : Object.keys(data.permissions)
        .map(name => `${name}${data.permissions[name] === "write" ? "!" : ""}`)
        .join(",");

  cache.set(
    cacheKey,
    [data.token, data.expires_at, permissionsString, data.singleFileName]
      .join("|")
      .replace(/\|+$/, "")
  );
}

function optionsToCacheKey({
  installationId,
  permissions = {},
  repositoryIds = []
}: AuthOptions) {
  const permissionsString = Object.keys(permissions)
    .sort()
    .map(name => (permissions[name] === "read" ? name : `${name}!`))
    .join(",");

  const repositoryIdsString = repositoryIds.sort().join(",");

  return [installationId, repositoryIdsString, permissionsString]
    .filter(Boolean)
    .join("|");
}
