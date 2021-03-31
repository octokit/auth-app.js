// ************************************************************
// THIS CODE IS NOT EXECUTED. IT IS JUST FOR TYPECHECKING
// ************************************************************

import { createAppAuth } from "../src";

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
