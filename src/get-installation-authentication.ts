import { get, set } from "./cache";
import { getAppAuthentication } from "./get-app-authentication";
import { toTokenAuthentication } from "./to-token-authentication";
import {
  InstallationAuthOptions,
  InstallationAccessTokenAuthentication,
  RequestInterface,
  State,
} from "./types";

export async function getInstallationAuthentication(
  state: State,
  options: InstallationAuthOptions,
  customRequest?: RequestInterface
): Promise<InstallationAccessTokenAuthentication> {
  const installationId = Number(options.installationId || state.installationId);

  if (!installationId) {
    throw new Error(
      "[@octokit/auth-app] installationId option is required for installation authentication."
    );
  }

  if (options.factory) {
    // @ts-ignore if `options.factory` is set, the return type for `auth()` should be `Promise<ReturnType<options.factory>>`
    return options.factory({
      cache: state.cache,
      appId: state.appId,
      privateKey: state.privateKey,
      log: state.log,
      request: state.request,
      clientId: state.clientId,
      clientSecret: state.clientSecret,
      timeDifference: state.timeDifference,
      installationId,
    });
  }

  const optionsWithInstallationTokenFromState = Object.assign(
    { installationId },
    options
  );

  if (!options.refresh) {
    const result = await get(
      state.cache,
      optionsWithInstallationTokenFromState
    );
    if (result) {
      const {
        token,
        createdAt,
        expiresAt,
        permissions,
        repositoryIds,
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
        singleFileName,
      });
    }
  }

  const appAuthentication = await getAppAuthentication(state);
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

  const createdAt = new Date().toISOString();
  await set(state.cache, optionsWithInstallationTokenFromState, {
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    singleFileName,
  });

  return toTokenAuthentication({
    installationId,
    token,
    createdAt,
    expiresAt,
    repositorySelection,
    permissions,
    repositoryIds,
    singleFileName,
  });
}
