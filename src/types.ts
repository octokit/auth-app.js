import * as OctokitTypes from "@octokit/types";
import LRUCache from "lru-cache";
// import {
//   GitHubAuthInterface as OAuthAppGitHubAuthInterface,
//   AppAuthentication as OAuthAppAuthentication,
//   GitHubAppUserAuthentication,
//   GitHubAppUserAuthenticationWithExpiration,
//   AppAuthOptions as OAuthAppAuthOptions,
//   WebFlowAuthOptions,
//   GitHubAppDeviceFlowAuthOptions,
// } from "@octokit/auth-oauth-app";
import * as OAuthAppAuth from "@octokit/auth-oauth-app";

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

export type OAuthAppAuthentication = OAuthAppAuth.AppAuthentication;
export type GitHubAppUserAuthentication = OAuthAppAuth.GitHubAppUserAuthentication;
export type GitHubAppUserAuthenticationWithExpiration = OAuthAppAuth.GitHubAppUserAuthenticationWithExpiration;

export type Authentication =
  | AppAuthentication
  | OAuthAppAuthentication
  | InstallationAccessTokenAuthentication
  | GitHubAppUserAuthentication
  | GitHubAppUserAuthenticationWithExpiration;

type OAuthStrategyOptions = {
  clientId?: string;
  clientSecret?: string;
};

type CommonStrategyOptions = {
  appId: number | string;
  privateKey: string;
  installationId?: number | string;
  request?: OctokitTypes.RequestInterface;
  cache?: Cache;
  log?: {
    warn: (message: string, additionalInfo?: object) => any;
    [key: string]: any;
  };
};

export type StrategyOptions = OAuthStrategyOptions &
  CommonStrategyOptions & { [key: string]: unknown };

export type FactoryOptions = Required<Omit<StrategyOptions, keyof State>> &
  State;

export type Permissions = {
  [name: string]: string;
};

export type AuthType =
  | "app"
  | "installation"
  | "oauth"
  | "oauth-app"
  | "oauth-user";

export type AppAuthOptions = {
  type: "app";
};

export type InstallationAuthOptions = {
  type: "installation";
  installationId?: number | string;
  repositoryIds?: number[];
  permissions?: Permissions;
  refresh?: boolean;
  // TODO: return type of `auth({ type: "installation", installationId, factory })`
  //       should be Promise<ReturnType<factory>>
  factory?: (options: FactoryOptions) => unknown;
  [key: string]: unknown;
};

export type OAuthAppAuthOptions = OAuthAppAuth.AppAuthOptions;
export type OAuthWebFlowAuthOptions = OAuthAppAuth.WebFlowAuthOptions;
export type OAuthDeviceFlowAuthOptions = OAuthAppAuth.GitHubAppDeviceFlowAuthOptions;

export type AuthOptions =
  | AppAuthOptions
  | OAuthAppAuthOptions
  | InstallationAuthOptions
  | OAuthWebFlowAuthOptions
  | OAuthDeviceFlowAuthOptions;

export type WithInstallationId = {
  installationId: number;
};

export type State = Required<Omit<CommonStrategyOptions, "installationId">> & {
  installationId?: number;
} & OAuthStrategyOptions & {
    oauthApp: OAuthAppAuth.GitHubAuthInterface;
  };
