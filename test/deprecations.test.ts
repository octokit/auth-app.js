import { request } from "@octokit/request";
import fetchMock, { MockMatcherFunction } from "fetch-mock";
import { Deprecation } from "deprecation";

import { createAppAuth } from "../src";

describe("deprecations", () => {
  test("auth({ type: 'oauth' }) - #263", async () => {
    const matchCreateOAuthAccessToken: MockMatcherFunction = (
      url,
      { body, headers }
    ) => {
      expect(url).toEqual("https://github.com/login/oauth/access_token");
      expect(headers).toStrictEqual({
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      });
      expect(JSON.parse(String(body))).toStrictEqual({
        client_id: "12345678901234567890",
        client_secret: "1234567890123456789012345678901234567890",
        code: "123456",
      });
      return true;
    };

    const createOAuthAccessTokenResponseData = {
      access_token: "secret123",
      scope: "",
      token_type: "bearer",
    };

    const warn = jest.fn();
    const auth = createAppAuth({
      appId: "1",
      privateKey: "1",
      clientId: "12345678901234567890",
      clientSecret: "1234567890123456789012345678901234567890",
      log: { warn },
      request: request.defaults({
        headers: {
          "user-agent": "test",
        },
        request: {
          fetch: fetchMock
            .sandbox()
            .postOnce(
              matchCreateOAuthAccessToken,
              createOAuthAccessTokenResponseData
            ),
        },
      }),
    });

    await auth({
      type: "oauth",
      code: "123456",
    });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      new Deprecation(
        '[@octokit/auth-app] {type: "oauth"} is deprecated. Use {type: "oauth-app"} instead'
      )
    );
  });

  // example:
  //
  // test("createAppAuth({ id }) - #44", () => {
  //   const warn = jest.fn();

  //   createAppAuth({
  //     id: 1,
  //     privateKey: "...",
  //     log: {
  //       warn,
  //     },
  //   });

  //   expect(warn).toHaveBeenCalledTimes(1);
  //   expect(warn).toHaveBeenCalledWith(
  //     new Deprecation(
  //       '[@octokit/auth-app] "createAppAuth({ id })" is deprecated, use "createAppAuth({ appId })" instead'
  //     )
  //   );
  // });
});
