import LRUCache from "lru-cache";
import { request } from "@octokit/request";

type Cache =
  | LRUCache<number, string>
  | {
      get: (key: number) => string;
      set: (key: number, value: string) => any;
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
};
