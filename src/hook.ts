import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";
import { requiresAppAuth } from "./requires-app-auth";
import {
  AnyResponse,
  EndpointDefaults,
  EndpointOptions,
  RequestParameters,
  RequestInterface,
  Route,
  State
} from "./types";

export async function hook(
  state: State,
  request: RequestInterface,
  route: Route | EndpointOptions,
  parameters?: RequestParameters
): Promise<AnyResponse> {
  let endpoint: EndpointDefaults = request.endpoint.merge(
    route as string,
    parameters
  );

  if (requiresAppAuth(endpoint.url)) {
    const { token } = await getAppAuthentication(state.id, state.privateKey);
    endpoint.headers.authorization = `bearer ${token}`;

    return request(endpoint as EndpointOptions);
  }

  const { token } = await getInstallationAuthentication(state, {}, request);

  endpoint.headers.authorization = `token ${token}`;
  return request(endpoint as EndpointOptions);
}
