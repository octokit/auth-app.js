import { AuthOptions, Permissions } from "./types";

export function optionsToCacheKey({
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
    .join("|")
    .replace(/\|+$/, "");
}

// export function cacheKeyToData(key) {
//   const [
//     installationId,
//     repositoryIdsString = "",
//     permissionsString = ""
//   ] = key.split("|");

//   const permissions = permissionsString
//     .split(/,/)
//     .reduce((permissions: Permissions, string) => {
//       if (/!$/.test(string)) {
//         permissions[string.slice(0, -1)] = "write";
//       } else {
//         permissions[string] = "read";
//       }

//       return permissions;
//     }, {});

//   return {
//     installationId,
//     repositoryIds: repositoryIdsString.split(","),
//     permissions
//   };
// }
