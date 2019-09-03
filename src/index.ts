import { getUserAgent } from "universal-user-agent";
import { request } from "@octokit/request";

import { auth } from "./auth";
import { hook } from "./hook";
import { getCache } from "./cache";
import { State, StrategyOptions } from "./types";
import { VERSION } from "./version";

export function createAppAuth(options: StrategyOptions) {
  const state: State = Object.assign(
    {
      request: request.defaults({
        headers: {
          "user-agent": `octokit-auth-app.js/${VERSION} ${getUserAgent()}`
        }
      }),
      cache: getCache()
    },
    options
  );

  return Object.assign(auth.bind(null, state), {
    hook: hook.bind(null, state)
  });
}
