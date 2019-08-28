import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";
import { requiresAppAuth } from "./requires-app-auth";
import {
  AnyResponse,
  Defaults,
  Endpoint,
  Parameters,
  Request,
  Route,
  State
} from "./types";

export async function hook(
  state: State,
  request: Request,
  route: Route | Endpoint,
  parameters?: Parameters
): Promise<AnyResponse> {
  let endpoint: Defaults = request.endpoint.merge(route as string, parameters);

  if (requiresAppAuth(endpoint.url)) {
    const { token } = getAppAuthentication(state.id, state.privateKey);
    endpoint.headers.authorization = `bearer ${token}`;

    return request(endpoint as Endpoint);
  }

  const { token } = await getInstallationAuthentication(state, {}, request);

  endpoint.headers.authorization = `token ${token}`;
  return request(endpoint as Endpoint);
}
