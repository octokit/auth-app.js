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

export type JWT = string;
export type UTC_TIMESTAMP = string;

type AppAuthentication = {
  type: "app";
  token: JWT;
  appId: number;
  exporation: number;
  headers: {
    authorization: string;
  };
  query: {};
};

type InstallationAccessTokenAuthentication = {
  type: "token";
  token: string;
  tokenType: "installation";
  expiresAt: UTC_TIMESTAMP;
  permissions: {
    [permission: string]: "read" | "write";
  };
  singleFileName?: string;
  repositoryIds?: number[];
  headers: {
    authorization: string;
  };
  query: {};
};

export type Authentication =
  | AppAuthentication
  | InstallationAccessTokenAuthentication;

export type StrategyOptions = {
  id: number;
  privateKey: string;
  installationId?: number;
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

export type AuthOptions = {
  installationId?: number;
  repositoryIds?: number[];
  permissions?: Permissions;
  url?: string;
  refresh?: boolean;
};

export type CacheData = {
  token: string;
  expires_at: string;
  permissions: Permissions;
  repositoryIds?: number[];
  singleFileName?: string;
};

export type WithInstallationId = {
  installationId: number;
};
