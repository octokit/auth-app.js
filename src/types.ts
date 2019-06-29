import LRUCache from "lru-cache";
import { request } from "@octokit/request";

export type Cache =
  | LRUCache<string, string>
  | {
      get: (key: string) => string;
      set: (key: string, value: string) => any;
    };

export type StrategyOptions = {
  id: number;
  privateKey: string;
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
  installationId: number;
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
