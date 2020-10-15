import * as OctokitTypes from "@octokit/types";
import LRUCache from "lru-cache";

export type AnyResponse = OctokitTypes.OctokitResponse<any>;
export type EndpointDefaults = OctokitTypes.EndpointDefaults;
export type EndpointOptions = OctokitTypes.EndpointOptions;
export type RequestParameters = OctokitTypes.RequestParameters;
export type Route = OctokitTypes.Route;
export type RequestInterface = OctokitTypes.RequestInterface;
export type StrategyInterface = OctokitTypes.StrategyInterface<
  [StrategyOptions],
  [AuthOptions],
  Authentication
>;

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

export type AppAuthentication = {
  type: APP_TYPE;
  token: JWT;
  appId: number;
  expiresAt: string;
};

export type InstallationAccessTokenData = {
  token: ACCESS_TOKEN;
  createdAt: UTC_TIMESTAMP;
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
  id: number | string;
  privateKey: string;
  installationId?: number | string;
  clientId?: string;
  clientSecret?: string;
  request?: OctokitTypes.RequestInterface;
  cache?: Cache;
  timeDifference?: number;
  log?: {
    warn: (message: string, additionalInfo?: object) => any;
    [key: string]: any;
  };
};

export type StrategyOptionsWithDefaults = StrategyOptions & {
  id: number;
  request: OctokitTypes.RequestInterface;
  cache: Cache;
};

export type Permissions = {
  [name: string]: string;
};

export type InstallationAuthOptions = {
  installationId?: number | string;
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
  id: number;
  installationId?: number;
  request: OctokitTypes.RequestInterface;
  cache: Cache;
  log: {
    warn: (message: string, additionalInfo?: object) => any;
    [key: string]: any;
  };
};
