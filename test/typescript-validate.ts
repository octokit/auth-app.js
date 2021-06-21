// ************************************************************
// THIS CODE IS NOT EXECUTED. IT IS JUST FOR TYPECHECKING
// ************************************************************

import { createAppAuth } from "../src";
function isString(what: string) {}

export async function readmeExample() {
  const auth = createAppAuth({
    appId: 1,
    privateKey: "-----BEGIN PRIVATE KEY-----\n...",
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef12341234567890abcdef1234",
  });

  // Retrieve an oauth-access token
  await auth({ type: "oauth-user", code: "123456" });
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
