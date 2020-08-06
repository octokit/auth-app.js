// https://github.com/isaacs/node-lru-cache#readme
import LRU from "lru-cache";

/* istanbul ignore next */
import {
  InstallationAuthOptions,
  Cache,
  CacheData,
  Permissions,
  InstallationAccessTokenData,
  REPOSITORY_SELECTION,
} from "./types";

export function getCache() {
  return new LRU<number, string>({
    // cache max. 15000 tokens, that will use less than 10mb memory
    max: 15000,
    // Cache for 1 minute less than GitHub expiry
    maxAge: 1000 * 60 * 59,
  });
}

export async function get(
  cache: Cache,
  options: InstallationAuthOptions
): Promise<InstallationAccessTokenData | void> {
  const cacheKey = optionsToCacheKey(options);
  const result = await cache.get(cacheKey);

  if (!result) {
    return;
  }

  const [
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissionsString,
    singleFileName,
  ] = result.split("|");

  /* istanbul ignore if - this is to debug an exception we see in production */
  if (!options.permissions && typeof permissionsString === "undefined") {
    throw new Error(
      `[@octokit/auth-app] Invalid cache. Key: ${cacheKey}. Result: ${result}`
    );
  }

  const permissions =
    options.permissions ||
    permissionsString.split(/,/).reduce((permissions: Permissions, string) => {
      if (/!$/.test(string)) {
        permissions[string.slice(0, -1)] = "write";
      } else {
        permissions[string] = "read";
      }

      return permissions;
    }, {} as Permissions);

  return {
    token,
    createdAt,
    expiresAt,
    permissions,
    repositoryIds: options.repositoryIds,
    singleFileName,
    repositorySelection: repositorySelection as REPOSITORY_SELECTION,
  };
}
export async function set(
  cache: Cache,
  options: InstallationAuthOptions,
  data: CacheData
): Promise<void> {
  const key = optionsToCacheKey(options);

  const permissionsString = options.permissions
    ? ""
    : Object.keys(data.permissions)
        .map(
          (name) => `${name}${data.permissions[name] === "write" ? "!" : ""}`
        )
        .join(",");

  const value = [
    data.token,
    data.createdAt,
    data.expiresAt,
    data.repositorySelection,
    permissionsString,
    data.singleFileName,
  ]
    .join("|")
    .replace(/\|+$/, "");

  await cache.set(key, value);
}

function optionsToCacheKey({
  installationId,
  permissions = {},
  repositoryIds = [],
}: InstallationAuthOptions) {
  const permissionsString = Object.keys(permissions)
    .sort()
    .map((name) => (permissions[name] === "read" ? name : `${name}!`))
    .join(",");

  const repositoryIdsString = repositoryIds.sort().join(",");

  return [installationId, repositoryIdsString, permissionsString]
    .filter(Boolean)
    .join("|");
}
