import {
  Request,
  OAuthOptions,
  StrategyOptionsWithDefaults,
  OAuthAccesTokenAuthentication
} from "./types";

export async function getOAuthAuthentication(
  state: StrategyOptionsWithDefaults,
  options: OAuthOptions,
  customRequest?: Request
): Promise<OAuthAccesTokenAuthentication> {
  const request = customRequest || state.request;

  // The "/login/oauth/access_token" is not part of the REST API hosted on api.github.com,
  // instead it’s using the github.com domain.
  const route = /^https:\/\/(api\.)?github\.com$/.test(
    state.request.endpoint.DEFAULTS.baseUrl
  )
    ? "POST https://github.com/login/oauth/access_token"
    : `POST ${state.request.endpoint.DEFAULTS.baseUrl.replace(
        "/api/v3",
        "/login/oauth/access_token"
      )}`;

  const parameters = {
    headers: {
      accept: `application/json`
    },
    client_id: state.clientId,
    client_secret: state.clientSecret,
    code: options.code,
    state: options.state,
    redirect_uri: options.redirectUrl
  };

  const {
    data: { access_token: token, scope }
  } = await request(route, parameters);

  return {
    type: "token",
    tokenType: "oauth",
    token,
    scopes: scope.split(/,\s*/).filter(Boolean)
  };
}
