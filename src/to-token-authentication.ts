import type {
  CacheData,
  InstallationAccessTokenAuthentication,
  WithInstallationId,
  TOKEN_TYPE,
  INSTALLATION_TOKEN_TYPE,
} from "./types.js";

export function toTokenAuthentication({
  installationId,
  token,
  createdAt,
  expiresAt,
  repositorySelection,
  permissions,
  repositoryIds,
  repositoryNames,
  singleFileName,
}: CacheData & WithInstallationId): InstallationAccessTokenAuthentication {
  return Object.assign(
    {
      type: "token" as TOKEN_TYPE,
      tokenType: "installation" as INSTALLATION_TOKEN_TYPE,
      token,
      installationId,
      permissions,
      createdAt,
      expiresAt,
      repositorySelection,
    },
    repositoryIds ? { repositoryIds } : null,
    repositoryNames ? { repositoryNames } : null,
    singleFileName ? { singleFileName } : null,
  );
}
