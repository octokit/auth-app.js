import { getUserAgent } from "universal-user-agent";
import { request } from "@octokit/request";

import { auth } from "./auth";
import { hook } from "./hook";
import { getCache } from "./cache";
import {
  StrategyInterface,
  State,
  StrategyOptions,
  AuthOptions,
  Authentication,
} from "./types";
import { VERSION } from "./version";

export type Types = {
  StrategyOptions: StrategyOptions;
  AuthOptions: AuthOptions;
  Authentication: Authentication;
};

export const createAppAuth: StrategyInterface = function createAppAuth(
  options: StrategyOptions
) {
  const state: State = Object.assign(
    {
      request: request.defaults({
        headers: {
          "user-agent": `octokit-auth-app.js/${VERSION} ${getUserAgent()}`,
        },
      }),
      cache: getCache(),
    },
    options,
    {
      id: Number(options.id),
    },
    options.installationId
      ? { installationId: Number(options.installationId) }
      : {},
    {
      log: Object.assign(
        {
          warn: console.warn.bind(console),
        },
        options.log
      ),
    }
  );

  return Object.assign(auth.bind(null, state), {
    hook: hook.bind(null, state),
  });
};
