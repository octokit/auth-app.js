import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";
import { requiresAppAuth } from "./requires-app-auth";
import {
  AnyResponse,
  EndpointOptions,
  RequestParameters,
  RequestInterface,
  Route,
  State,
} from "./types";

const FIVE_SECONDS_IN_MS = 5 * 1000;

export async function hook(
  state: State,
  request: RequestInterface,
  route: Route | EndpointOptions,
  parameters?: RequestParameters
): Promise<AnyResponse> {
  let endpoint = request.endpoint.merge(route as string, parameters);

  if (
    requiresAppAuth(
      (endpoint.url as string).replace(request.endpoint.DEFAULTS.baseUrl, "")
    )
  ) {
    const { token } = await getAppAuthentication(state.id, state.privateKey);
    endpoint.headers.authorization = `bearer ${token}`;

    return request(endpoint as EndpointOptions);
  }

  const { token, createdAt } = await getInstallationAuthentication(
    state,
    {},
    request
  );

  endpoint.headers.authorization = `token ${token}`;

  return sendRequestWithRetries(
    request,
    endpoint as EndpointOptions,
    createdAt
  );
}

/**
 * Newly created tokens might not be accessible immediately after creation.
 * In case of a 401 response, we retry with an exponential delay until more
 * than five seconds pass since the creation of the token.
 *
 * @see https://github.com/octokit/auth-app.js/issues/65
 */
async function sendRequestWithRetries(
  request: RequestInterface,
  options: EndpointOptions,
  createdAt: string,
  retries: number = 0
): Promise<AnyResponse> {
  const timeSinceTokenCreationInMs = +new Date() - +new Date(createdAt);

  try {
    return await request(options);
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }

    if (timeSinceTokenCreationInMs >= FIVE_SECONDS_IN_MS) {
      if (retries > 0) {
        error.message = `[@octokit/auth-app] After ${retries} retries within ${
          timeSinceTokenCreationInMs / 1000
        }s after creating the installation access token, the response remains 401. At this point it's unlikely a replication lag, but a legit authentication problem or a system outage, please check https://www.githubstatus.com/`;
      }
      throw error;
    }

    ++retries;

    const awaitTime = retries * 1000;
    console.warn(
      `[@octokit/auth-app] Retrying after 401 response to account for token replication delay (retry: ${retries}, wait: ${
        awaitTime / 1000
      }s)`
    );
    await new Promise((resolve) => setTimeout(resolve, awaitTime));

    return sendRequestWithRetries(request, options, createdAt, retries);
  }
}
