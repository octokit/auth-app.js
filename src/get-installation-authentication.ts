import { get, set } from "./cache.js";
import { getAppAuthentication } from "./get-app-authentication.js";
import { toTokenAuthentication } from "./to-token-authentication.js";
import type {
  InstallationAuthOptions,
  InstallationAccessTokenAuthentication,
  RequestInterface,
  State,
} from "./types.js";

export async function getInstallationAuthentication(
  state: State,
  options: InstallationAuthOptions,
  customRequest?: RequestInterface,
): Promise<InstallationAccessTokenAuthentication> {
  const installationId = Number(options.installationId || state.installationId);

  if (!installationId) {
    throw new Error(
      "[@octokit/auth-app] installationId option is required for installation authentication.",
    );
  }

  if (options.factory) {
    const { type, factory, oauthApp, ...factoryAuthOptions } = {
      ...state,
      ...options,
    };
    // @ts-expect-error if `options.factory` is set, the return type for `auth()` should be `Promise<ReturnType<options.factory>>`
    return factory(factoryAuthOptions);
  }

  const optionsWithInstallationTokenFromState = Object.assign(
    { installationId },
    options,
  );

  if (!options.refresh) {
    const result = await get(
      state.cache,
      optionsWithInstallationTokenFromState,
    );

    if (result) {
      const {
        token,
        createdAt,
        expiresAt,
        permissions,
        repositoryIds,
        repositoryNames,
        singleFileName,
        repositorySelection,
      } = result;

      return toTokenAuthentication({
        installationId,
        token,
        createdAt,
        expiresAt,
        permissions,
        repositorySelection,
        repositoryIds,
        repositoryNames,
        singleFileName,
      });
    }
  }

  const appAuthentication = await getAppAuthentication(state);
  const request = customRequest || state.request;

  const payload = {
    installation_id: installationId,
    mediaType: {
      previews: ["machine-man"],
    },
    headers: {
      authorization: `bearer ${appAuthentication.token}`,
    },
  };

  if (options.repositoryIds) {
    Object.assign(payload, { repository_ids: options.repositoryIds });
  }

  if (options.repositoryNames) {
    Object.assign(payload, {
      repositories: options.repositoryNames,
    });
  }

  if (options.permissions) {
    Object.assign(payload, { permissions: options.permissions });
  }

  const {
    data: {
      token,
      expires_at: expiresAt,
      repositories,
      permissions: permissionsOptional,
      repository_selection: repositorySelectionOptional,
      single_file: singleFileName,
    },
  } = await request(
    "POST /app/installations/{installation_id}/access_tokens",
    payload,
  );

  /* v8 ignore next - permissions are optional per OpenAPI spec, but we think that is incorrect */
  const permissions = permissionsOptional || {};
  /* v8 ignore next - repositorySelection are optional per OpenAPI spec, but we think that is incorrect */
  const repositorySelection = repositorySelectionOptional || "all";

  const repositoryIds = repositories
    ? repositories.map((r: { id: number }) => r.id)
    : void 0;

  const repositoryNames = repositories
    ? repositories.map((repo: { name: string }) => repo.name)
    : void 0;

  const createdAt = new Date().toISOString();
  const cacheOptions = {
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    repositoryNames,
  };

  if (singleFileName) {
    Object.assign(payload, { singleFileName });
  }

  await set(state.cache, optionsWithInstallationTokenFromState, cacheOptions);

  const cacheData = {
    installationId,
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    repositoryNames,
  };

  if (singleFileName) {
    Object.assign(cacheData, { singleFileName });
  }

  return toTokenAuthentication(cacheData);
}
