import { get, set } from "./cache";
import { getAppAuthentication } from "./get-app-authentication";
import { toTokenAuthentication } from "./to-token-authentication";
import {
  RequestInterface,
  InstallationAuthOptions,
  StrategyOptionsWithDefaults,
  InstallationAccessTokenAuthentication,
} from "./types";

export async function getInstallationAuthentication(
  state: StrategyOptionsWithDefaults,
  options: InstallationAuthOptions,
  customRequest?: RequestInterface
): Promise<InstallationAccessTokenAuthentication> {
  const installationId = (options.installationId ||
    state.installationId) as number;

  if (!options.refresh) {
    const result = await get(state.cache, options);
    if (result) {
      const {
        token,
        expiresAt,
        permissions,
        repositoryIds,
        singleFileName,
        repositorySelection,
      } = result;

      return toTokenAuthentication({
        installationId,
        token,
        expiresAt,
        permissions,
        repositorySelection,
        repositoryIds,
        singleFileName,
      });
    }
  }

  const appAuthentication = await getAppAuthentication(
    state.id,
    state.privateKey
  );
  const request = customRequest || state.request;

  const {
    data: {
      token,
      expires_at: expiresAt,
      repositories,
      permissions,
      // @ts-ignore
      repository_selection: repositorySelection,
      // @ts-ignore
      single_file: singleFileName,
    },
  } = await request("POST /app/installations/:installation_id/access_tokens", {
    installation_id: installationId,
    repository_ids: options.repositoryIds,
    permissions: options.permissions,
    mediaType: {
      previews: ["machine-man"],
    },
    headers: {
      authorization: `bearer ${appAuthentication.token}`,
    },
  });

  const repositoryIds = repositories
    ? repositories.map((r: { id: number }) => r.id)
    : void 0;

  await set(state.cache, options, {
    token,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    singleFileName,
  });

  return toTokenAuthentication({
    installationId,
    token,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    singleFileName,
  });
}
