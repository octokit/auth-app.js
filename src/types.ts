import LRUCache from "lru-cache";
import { request } from "@octokit/request";

export type Cache =
  | LRUCache<string, string>
  | {
      get: (key: string) => string;
      set: (key: string, value: string) => any;
    };

export interface AppAuthStrategy {
  (options?: StrategyOptions): AppAuth;
}

export interface AppAuth {
  (options: AuthOptions): Promise<Authentication>;
}

export type APP_TYPE = "app";
export type TOKEN_TYPE = "token";
export type INSTALLATION_TOKEN_TYPE = "installation";
export type OAUTH_TOKEN_TYPE = "oauth";
export type REPOSITORY_SELECTION = "all" | "selected";
export type JWT = string;
export type ACCESS_TOKEN = string;
export type UTC_TIMESTAMP = string;

type AppAuthentication = {
  type: APP_TYPE;
  token: JWT;
  appId: number;
  exporation: number;
};

export type InstallationAccessTokenData = {
  token: ACCESS_TOKEN;
  expiresAt: UTC_TIMESTAMP;
  permissions: Permissions;
  repositorySelection: REPOSITORY_SELECTION;
  repositoryIds?: number[];
  singleFileName?: string;
};

export type CacheData = InstallationAccessTokenData;

export type InstallationAccessTokenAuthentication = InstallationAccessTokenData & {
  type: TOKEN_TYPE;
  tokenType: INSTALLATION_TOKEN_TYPE;
};

export type OAuthAccesTokenAuthentication = {
  type: TOKEN_TYPE;
  tokenType: OAUTH_TOKEN_TYPE;
  token: ACCESS_TOKEN;
  scopes: string[];
};

export type Authentication =
  | AppAuthentication
  | InstallationAccessTokenAuthentication
  | OAuthAccesTokenAuthentication;

export type StrategyOptions = {
  id: number;
  privateKey: string;
  installationId?: number;
  clientId?: string;
  clientSecret?: string;
  request?: typeof request;
  cache?: Cache;
};

export type StrategyOptionsWithDefaults = StrategyOptions & {
  request: typeof request;
  cache: Cache;
};

export type Permissions = {
  [name: string]: string;
};

export type InstallationAuthOptions = {
  installationId?: number;
  repositoryIds?: number[];
  permissions?: Permissions;
  refresh?: boolean;
};

export type OAuthOptions = {
  code?: string;
  redirectUrl?: string;
  state?: string;
};

export type AuthOptions = InstallationAuthOptions &
  OAuthOptions & {
    type: "app" | "installation" | "oauth";
  };

export type WithInstallationId = {
  installationId: number;
};

export type State = StrategyOptions & {
  request: typeof request;
  cache: Cache;
};

export type Request = typeof request;

// TODO: copied from @octokit/request, that should be dried up
import { Agent } from "http";
export type Fetch = any;
export type Signal = any;

export type Endpoint = Parameters & {
  method: Method;
  url: Url;
};

export type Method = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT";
export type Route = string;
export type Url = string;

export type Parameters = {
  /**
   * Base URL to be used when a relative URL is passed, such as `/orgs/:org`.
   * If `baseUrl` is `https://enterprise.acme-inc.com/api/v3`, then the request
   * will be sent to `https://enterprise.acme-inc.com/api/v3/orgs/:org`.
   */
  baseUrl?: string;

  /**
   * HTTP headers. Use lowercase keys.
   */
  headers?: RequestHeaders;

  /**
   * Media type options, see {@link https://developer.github.com/v3/media/|GitHub Developer Guide}
   */
  mediaType?: {
    /**
     * `json` by default. Can be `raw`, `text`, `html`, `full`, `diff`, `patch`, `sha`, `base64`. Depending on endpoint
     */
    format?: string;

    /**
     * Custom media type names of {@link https://developer.github.com/v3/media/|API Previews} without the `-preview` suffix.
     * Example for single preview: `['squirrel-girl']`.
     * Example for multiple previews: `['squirrel-girl', 'mister-fantastic']`.
     */
    previews?: string[];
  };

  /**
   * Pass custom meta information for the request. The `request` object will be returned as is.
   */
  request?: OctokitRequestOptions;

  /**
   * Any additional parameter will be passed as follows
   * 1. URL parameter if `':parameter'` or `{parameter}` is part of `url`
   * 2. Query parameter if `method` is `'GET'` or `'HEAD'`
   * 3. Request body if `parameter` is `'data'`
   * 4. JSON in the request body in the form of `body[parameter]` unless `parameter` key is `'data'`
   */
  [parameter: string]: any;
};

export type OctokitRequestOptions = {
  /**
   * Node only. Useful for custom proxy, certificate, or dns lookup.
   */
  agent?: Agent;
  /**
   * Custom replacement for built-in fetch method. Useful for testing or request hooks.
   */
  fetch?: Fetch;
  /**
   * Use an `AbortController` instance to cancel a request. In node you can only cancel streamed requests.
   */
  signal?: Signal;
  /**
   * Node only. Request/response timeout in ms, it resets on redirect. 0 to disable (OS limit applies). `options.request.signal` is recommended instead.
   */
  timeout?: number;

  [option: string]: any;
};

export type RequestHeaders = {
  /**
   * Avoid setting `accept`, use `mediaFormat.{format|previews}` instead.
   */
  accept?: string;
  /**
   * Use `authorization` to send authenticated request, remember `token ` / `bearer ` prefixes. Example: `token 1234567890abcdef1234567890abcdef12345678`
   */
  authorization?: string;
  /**
   * `user-agent` is set do a default and can be overwritten as needed.
   */
  "user-agent"?: string;

  [header: string]: string | number | undefined;
};

export type ResponseHeaders = {
  [header: string]: string;
};
export type OctokitResponse<T> = {
  headers: ResponseHeaders;
  /**
   * http response code
   */
  status: number;
  /**
   * URL of response after all redirects
   */
  url: string;
  /**
   *  This is the data you would see in https://developer.Octokit.com/v3/
   */
  data: T;
};
export type AnyResponse = OctokitResponse<any>;

export type Defaults = Parameters & {
  method: Method;
  baseUrl: string;
  headers: RequestHeaders & { accept: string; "user-agent": string };
  mediaType: {
    format: string;
    previews: string[];
  };
};
