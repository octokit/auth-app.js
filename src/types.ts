import { request } from "@octokit/request";

export type StrategyOptions = {
  id: number;
  privateKey: string;
  request?: typeof request;
};

export type StrategyOptionsWithRequest = StrategyOptions & {
  request: typeof request;
};

export type AuthOptions = {
  url?: string;
  installationId?: number;
};
