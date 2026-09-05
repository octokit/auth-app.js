// ************************************************************
// THIS CODE IS NOT EXECUTED. IT IS JUST FOR TYPECHECKING
// ************************************************************

import { getAppAuthentication } from "../src/get-app-authentication.js";
import { request } from "@octokit/request";
import { createAppAuth } from "../src/index.js";
import { State, StrategyOptions } from "../src/types.js";
import { getCache } from "../src/cache.js";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
function isString(what: string) {}

function expectType<T>(what: T) {}

const auth = createAppAuth({
  appId: 1,
  privateKey: "-----BEGIN PRIVATE KEY-----\n...",
  clientId: "lv1.1234567890abcdef",
  clientSecret: "1234567890abcdef12341234567890abcdef1234",
});

export async function readmeExample() {
  // Retrieve an oauth-access token
  const userAuthentication = await auth({ type: "oauth-user", code: "123456" });

  expectType<"token">(userAuthentication.type);
}

export async function issue268() {
  // Retrieve an oauth-access token
  const userAuthentication = await auth({ type: "installation" });

  expectType<"token">(userAuthentication.type);
  expectType<"tokenType">(userAuthentication.tokenType);
}

export async function readmeJwtSigningExample() {
  const auth = createAppAuth({
    appId: 1,
    createJwt: async (clientId: string | number) => {
      return { jwt: "", expiresAt: "" };
    },
  });

  await auth({ type: "app" });
}

// https://github.com/octokit/auth-app.js/issues/282
export async function issue282() {
  const auth = createAppAuth({
    appId: 1,
    privateKey: "",
  });

  const authentication = await auth({
    type: "installation",
    installationId: 123,
  });

  isString(authentication.token);
}

// https://github.com/octokit/auth-app.js/issues/603
export async function issue603() {
  createAppAuth({
    appId: "Iv1.0123456789abcdef",
    privateKey: "",
  });

  const options: StrategyOptions = {
    appId: "Iv1.0123456789abcdef",
    privateKey: "",
  };

  const state: State = Object.assign(
    {
      request,
      cache: getCache(),
    },
    options,
    options.installationId
      ? { installationId: Number(options.installationId) }
      : {},
    {
      log: {
        warn: console.warn.bind(console),
      },
      oauthApp: createOAuthAppAuth({
        clientType: "github-app",
        clientId: options.clientId || "",
        clientSecret: options.clientSecret || "",
        request,
      }),
    },
  );

  getAppAuthentication(state);
}
