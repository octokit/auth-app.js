import fetchMock, { type MockMatcherFunction } from "fetch-mock";

import { request } from "@octokit/request";
import { vi, beforeEach, test, expect } from "vitest";

import { createAppAuth, createOAuthUserAuth } from "../src/index.ts";
import type { FactoryInstallation } from "../src/types.ts";

const APP_ID = 1;
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1c7+9z5Pad7OejecsQ0bu3aozN3tihPmljnnudb9G3HECdnH
lWu2/a1gB9JW5TBQ+AVpum9Okx7KfqkfBKL9mcHgSL0yWMdjMfNOqNtrQqKlN4kE
p6RD++7sGbzbfZ9arwrlD/HSDAWGdGGJTSOBM6pHehyLmSC3DJoR/CTu0vTGTWXQ
rO64Z8tyXQPtVPb/YXrcUhbBp8i72b9Xky0fD6PkEebOy0Ip58XVAn2UPNlNOSPS
ye+Qjtius0Md4Nie4+X8kwVI2Qjk3dSm0sw/720KJkdVDmrayeljtKBx6AtNQsSX
gzQbeMmiqFFkwrG1+zx6E7H7jqIQ9B6bvWKXGwIDAQABAoIBAD8kBBPL6PPhAqUB
K1r1/gycfDkUCQRP4DbZHt+458JlFHm8QL6VstKzkrp8mYDRhffY0WJnYJL98tr4
4tohsDbqFGwmw2mIaHjl24LuWXyyP4xpAGDpl9IcusjXBxLQLp2m4AKXbWpzb0OL
Ulrfc1ZooPck2uz7xlMIZOtLlOPjLz2DuejVe24JcwwHzrQWKOfA11R/9e50DVse
hnSH/w46Q763y4I0E3BIoUMsolEKzh2ydAAyzkgabGQBUuamZotNfvJoDXeCi1LD
8yNCWyTlYpJZJDDXooBU5EAsCvhN1sSRoaXWrlMSDB7r/E+aQyKua4KONqvmoJuC
21vSKeECgYEA7yW6wBkVoNhgXnk8XSZv3W+Q0xtdVpidJeNGBWnczlZrummt4xw3
xs6zV+rGUDy59yDkKwBKjMMa42Mni7T9Fx8+EKUuhVK3PVQyajoyQqFwT1GORJNz
c/eYQ6VYOCSC8OyZmsBM2p+0D4FF2/abwSPMmy0NgyFLCUFVc3OECpkCgYEA5OAm
I3wt5s+clg18qS7BKR2DuOFWrzNVcHYXhjx8vOSWV033Oy3yvdUBAhu9A1LUqpwy
Ma+unIgxmvmUMQEdyHQMcgBsVs10dR/g2xGjMLcwj6kn+xr3JVIZnbRT50YuPhf+
ns1ScdhP6upo9I0/sRsIuN96Gb65JJx94gQ4k9MCgYBO5V6gA2aMQvZAFLUicgzT
u/vGea+oYv7tQfaW0J8E/6PYwwaX93Y7Q3QNXCoCzJX5fsNnoFf36mIThGHGiHY6
y5bZPPWFDI3hUMa1Hu/35XS85kYOP6sGJjf4kTLyirEcNKJUWH7CXY+00cwvTkOC
S4Iz64Aas8AilIhRZ1m3eQKBgQCUW1s9azQRxgeZGFrzC3R340LL530aCeta/6FW
CQVOJ9nv84DLYohTVqvVowdNDTb+9Epw/JDxtDJ7Y0YU0cVtdxPOHcocJgdUGHrX
ZcJjRIt8w8g/s4X6MhKasBYm9s3owALzCuJjGzUKcDHiO2DKu1xXAb0SzRcTzUCn
7daCswKBgQDOYPZ2JGmhibqKjjLFm0qzpcQ6RPvPK1/7g0NInmjPMebP0K6eSPx0
9/49J6WTD++EajN7FhktUSYxukdWaCocAQJTDNYP0K88G4rtC2IYy5JFn9SWz5oh
x//0u+zd/R/QRUzLOw4N72/Hu+UG6MNt5iDZFCtapRaKt6OvSBwy8w==
-----END RSA PRIVATE KEY-----`;
// see https://runkit.com/gr2m/reproducable-jwt
const BEARER =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0zMCwiZXhwIjo1NzAsImlzcyI6MX0.q3foRa78U3WegM5PrWLEh5N0bH1SD62OqW66ZYzArp95JBNiCbo8KAlGtiRENCIfBZT9ibDUWy82cI4g3F09mdTq3bD1xLavIfmTksIQCz5EymTWR5v6gL14LSmQdWY9lSqkgUG0XCFljWUglEP39H4yeHbFgdjvAYg3ifDS12z9oQz2ACdSpvxPiTuCC804HkPVw8Qoy0OSXvCkFU70l7VXCVUxnuhHnk8-oCGcKUspmeP6UdDnXk-Aus-eGwDfJbU2WritxxaXw6B4a3flTPojkYLSkPBr6Pi0H2-mBsW_Nvs0aLPVLKobQd4gqTkosX3967DoAG8luUMhrnxe8Q";

beforeEach(() => {
  vi.useFakeTimers().setSystemTime(0);
});

test("README example for app auth", async () => {
  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
  });

  const authentication = await auth({ type: "app" });

  expect(authentication).toEqual({
    type: "app",
    token: BEARER,
    appId: 1,
    expiresAt: "1970-01-01T00:09:30.000Z",
  });
});

test("README example for OAuth app auth", async () => {
  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef1234567890abcdef12345678",
  });

  const authentication = await auth({ type: "oauth-app" });

  expect(authentication).toMatchInlineSnapshot(`
    {
      "clientId": "lv1.1234567890abcdef",
      "clientSecret": "1234567890abcdef1234567890abcdef12345678",
      "clientType": "github-app",
      "headers": {
        "authorization": "basic bHYxLjEyMzQ1Njc4OTBhYmNkZWY6MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3OA==",
      },
      "type": "oauth-app",
    }
  `);
});

test("throws if invalid 'type' is provided", async () => {
  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
  });

  // @ts-expect-error TS2322
  await expect(auth({ type: "app2" })).rejects.toEqual(
    new Error("Invalid auth type: app2"),
  );
});

test("throws if invalid Private Key is provided", async () => {
  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: "INVALID_PRIVATE_KEY",
  });

  await expect(auth({ type: "app" })).rejects.toEqual(expect.anything());
});

test("throws if incomplete Private Key is provided", async () => {
  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: "-----BEGIN RSA PRIVATE KEY-----",
  });

  await expect(auth({ type: "app" })).rejects.toEqual(
    new Error(
      "The 'privateKey` option contains only the first line '-----BEGIN RSA PRIVATE KEY-----'. If you are setting it using a `.env` file, make sure it is set on a single line with newlines replaced by '\n'",
    ),
  );
});

test("README example for installation auth", async () => {
  const matchCreateInstallationAccessToken: MockMatcherFunction = (
    url,
    { body, headers },
  ) => {
    expect(url).toEqual(
      "https://api.github.com/app/installations/123/access_tokens",
    );
    expect(headers).toStrictEqual(
      expect.objectContaining({
        accept: "application/vnd.github.v3+json",
        "user-agent": "test",
        authorization: `bearer ${BEARER}`,
      }),
    );
    expect(body).toBeUndefined();

    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read",
    },
    repository_selection: "all",
  };

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateInstallationAccessToken,
            createInstallationAccessTokenResponseData,
          ),
      },
    }),
  });

  const authentication = await auth({
    type: "installation",
    installationId: 123,
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
    },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
  });
});

test("README example for oauth", async () => {
  const matchCreateOAuthAccessToken: MockMatcherFunction = (
    url,
    { body, headers },
  ) => {
    expect(url).toEqual("https://github.com/login/oauth/access_token");
    expect(headers).toStrictEqual({
      accept: "application/json",
      "user-agent": "test",
      "content-type": "application/json; charset=utf-8",
    });
    expect(JSON.parse(String(body))).toStrictEqual({
      client_id: "lv1.1234567890abcdef",
      client_secret: "1234567890abcdef1234567890abcdef12345678",
      code: "123456",
    });
    return true;
  };

  const createOAuthAccessTokenResponseData = {
    access_token: "secret123",
    scope: "",
    token_type: "bearer",
  };

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef1234567890abcdef12345678",
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateOAuthAccessToken,
            createOAuthAccessTokenResponseData,
          ),
      },
    }),
  });

  const authentication = await auth({
    type: "oauth-user",
    code: "123456",
  });

  expect(authentication).toMatchInlineSnapshot(`
    {
      "clientId": "lv1.1234567890abcdef",
      "clientSecret": "1234567890abcdef1234567890abcdef12345678",
      "clientType": "github-app",
      "token": "secret123",
      "tokenType": "oauth",
      "type": "token",
    }
  `);
});

test("installationId strategy option", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce(
          "https://api.github.com/app/installations/123/access_tokens",
          {
            token: "secret123",
            expires_at: "1970-01-01T01:00:00.000Z",
            permissions: {
              metadata: "read",
            },
            repository_selection: "all",
          },
        ),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
    request: requestMock,
  });

  const authentication = await auth({
    type: "installation",
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
    },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
  });
});

test("installationId strategy option fails with no installationId", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce(
          "https://api.github.com/app/installations/123/access_tokens",
          {
            token: "secret123",
            expires_at: "1970-01-01T01:00:00.000Z",
            permissions: {
              metadata: "read",
            },
            repository_selection: "all",
          },
        ),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock,
  });

  try {
    await auth({
      type: "installation",
    });
    expect(1).not.toBe(1);
  } catch (e) {
    expect(e).toEqual(
      new Error(
        "[@octokit/auth-app] installationId option is required for installation authentication.",
      ),
    );
  }
});

test("repositoryIds auth option", async () => {
  const matchCreateInstallationAccessToken: MockMatcherFunction = (
    _url,
    { body },
  ) => {
    expect(JSON.parse(String(body))).toStrictEqual({
      repositories: ["repoOne", "repoTwo", "repoThree"],
    });
    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read",
    },
    repositories: [
      { id: 1, name: "repoOne" },
      { id: 2, name: "repoTwo" },
      { id: 3, name: "repoThree" },
    ],
    repository_selection: "all",
  };

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateInstallationAccessToken,
            createInstallationAccessTokenResponseData,
          ),
      },
    }),
  });

  const authentication = await auth({
    type: "installation",
    installationId: 123,
    repositoryNames: ["repoOne", "repoTwo", "repoThree"],
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
    },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositoryIds: [1, 2, 3],
    repositoryNames: ["repoOne", "repoTwo", "repoThree"],
    repositorySelection: "all",
  });
});

test("repositoryNames auth option", async () => {
  const matchCreateInstallationAccessToken: MockMatcherFunction = (
    _url,
    { body },
  ) => {
    expect(JSON.parse(String(body))).toStrictEqual({
      repository_ids: [1, 2, 3],
    });
    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read",
    },
    repositories: [
      { id: 1, name: "repoOne" },
      { id: 2, name: "repoTwo" },
      { id: 3, name: "repoThree" },
    ],
    repository_selection: "all",
  };

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateInstallationAccessToken,
            createInstallationAccessTokenResponseData,
          ),
      },
    }),
  });

  const authentication = await auth({
    type: "installation",
    installationId: 123,
    repositoryIds: [1, 2, 3],
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
    },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositoryIds: [1, 2, 3],
    repositoryNames: ["repoOne", "repoTwo", "repoThree"],
    repositorySelection: "all",
  });
});

test("Consistenly handling reposID & reposName", async () => {
  const matchCreateInstallationAccessToken: MockMatcherFunction = (
    _url,
    { body },
  ) => {
    expect(JSON.parse(String(body))).toStrictEqual({
      repository_ids: [1, 2, 3],
      repositories: ["repoOne", "repoTwo", "repoThree"],
    });
    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read",
    },
    repositories: [
      { id: 1, name: "repoOne" },
      { id: 2, name: "repoTwo" },
      { id: 3, name: "repoThree" },
    ],
    repository_selection: "all",
  };

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateInstallationAccessToken,
            createInstallationAccessTokenResponseData,
          ),
      },
    }),
  });

  const authentication = await auth({
    type: "installation",
    installationId: 123,
    repositoryIds: [1, 2, 3],
    repositoryNames: ["repoOne", "repoTwo", "repoThree"],
  });

  expect(authentication).toEqual({
    type: "token",
    tokenType: "installation",
    token: "secret123",
    installationId: 123,
    permissions: { metadata: "read" },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
    repositoryIds: [1, 2, 3],
    repositoryNames: ["repoOne", "repoTwo", "repoThree"],
  });
});

test("permissions auth option", async () => {
  const matchCreateInstallationAccessToken: MockMatcherFunction = (
    _url,
    { body },
  ) => {
    expect(JSON.parse(String(body))).toStrictEqual({
      permissions: {
        single_file: "write",
      },
    });
    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      single_file: "write",
    },
    single_file: ".github/myapp.yml",
    repository_selection: "all",
  };

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateInstallationAccessToken,
            createInstallationAccessTokenResponseData,
          ),
      },
    }),
  });

  const authentication = await auth({
    type: "installation",
    installationId: 123,
    permissions: {
      single_file: "write",
    },
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    permissions: {
      single_file: "write",
    },
    singleFileName: ".github/myapp.yml",
    repositorySelection: "all",
  });
});

test("installation auth from cache", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read",
            issues: "write",
          },
          repository_selection: "all",
        }),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock,
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
      issues: "write",
    },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123,
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123,
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
});

test("installation auth with selected repositories from cache", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read",
          },
          repository_selection: "all",
          repositories: [
            { id: 1, name: "repoOne" },
            { id: 2, name: "repoTwo" },
            { id: 3, name: "repoThree" },
          ],
        }),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock,
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
    },
    repositoryIds: [1, 2, 3],
    repositoryNames: ["repoOne", "repoTwo", "repoThree"],
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123,
    repositoryIds: [1, 2, 3],
    repositoryNames: ["repoOne", "repoTwo", "repoThree"],
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123,
    repositoryIds: [1, 2, 3],
    repositoryNames: ["repoOne", "repoTwo", "repoThree"],
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
});

test("installation auth with selected permissions from cache", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            issues: "write",
          },
          repository_selection: "all",
        }),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock,
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      issues: "write",
    },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123,
    permissions: {
      issues: "write",
    },
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123,
    permissions: {
      issues: "write",
    },
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
});

test("installation cache with different options", async () => {
  const matchCreateAccessToken1: MockMatcherFunction = (_url, { body }) => {
    expect(body).toBeUndefined();
    return true;
  };
  const matchCreateAccessToken2: MockMatcherFunction = (_url, { body }) => {
    expect(JSON.parse(String(body))).toStrictEqual({
      permissions: {
        metadata: "read",
      },
    });
    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read",
    },
    repository_selection: "all",
  };

  const mock = fetchMock
    .sandbox()
    .postOnce(
      matchCreateAccessToken1,
      createInstallationAccessTokenResponseData,
    )
    .postOnce(
      matchCreateAccessToken2,
      createInstallationAccessTokenResponseData,
    );

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock,
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
    },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123,
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
    },
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
  expect(mock.done()).toBe(true);
});

test("refresh option", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "path:/app/installations/123/access_tokens",
        {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read",
          },
          repository_selection: "all",
        },
        {
          repeat: 2,
        },
      ),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock,
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
    },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123,
    refresh: true,
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123,
    refresh: true,
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
});

test("oauth-user web flow", async () => {
  const matchCreateOAuthAccessToken: MockMatcherFunction = (
    url,
    { body, headers },
  ) => {
    expect(url).toEqual("https://github.com/login/oauth/access_token");
    expect(headers).toStrictEqual({
      accept: "application/json",
      "user-agent": "test",
      "content-type": "application/json; charset=utf-8",
    });
    expect(JSON.parse(String(body))).toStrictEqual({
      client_id: "lv1.1234567890abcdef",
      client_secret: "1234567890abcdef1234567890abcdef12345678",
      code: "123456",
      redirect_uri: "https://example.com/login",
    });

    return true;
  };

  const createOAuthAccessTokenResponseData = {
    access_token: "secret123",
    scope: "",
    token_type: "bearer",
  };

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef1234567890abcdef12345678",
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateOAuthAccessToken,
            createOAuthAccessTokenResponseData,
          ),
      },
    }),
  });

  const authentication = await auth({
    type: "oauth-user",
    code: "123456",
    state: "mystate123",
    redirectUrl: "https://example.com/login",
  });

  expect(authentication).toMatchInlineSnapshot(`
    {
      "clientId": "lv1.1234567890abcdef",
      "clientSecret": "1234567890abcdef1234567890abcdef12345678",
      "clientType": "github-app",
      "token": "secret123",
      "tokenType": "oauth",
      "type": "token",
    }
  `);
});

test("oauth-user device flow", async () => {
  const mock = fetchMock
    .sandbox()

    .postOnce(
      "https://github.com/login/device/code",
      {
        device_code: "devicecode123",
        user_code: "usercode123",
        verification_uri: "https://github.com/login/device",
        expires_in: 900,
        // use low number because vi.useFakeTimers() & vi.runAllTimers() didn't work for me
        interval: 0.005,
      },
      {
        headers: {
          accept: "application/json",
          "user-agent": "test",
          "content-type": "application/json; charset=utf-8",
        },
        body: {
          client_id: "lv1.1234567890abcdef",
        },
      },
    )
    .postOnce(
      "https://github.com/login/oauth/access_token",
      {
        access_token: "token123",
        scope: "",
      },
      {
        headers: {
          accept: "application/json",
          "user-agent": "test",
          "content-type": "application/json; charset=utf-8",
        },
        body: {
          client_id: "lv1.1234567890abcdef",
          device_code: "devicecode123",
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        },
        overwriteRoutes: false,
      },
    );

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef1234567890abcdef12345678",
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: mock,
      },
    }),
  });

  const onVerification = vi.fn();
  const authentication = await auth({
    type: "oauth-user",
    onVerification,
  });

  expect(authentication).toMatchInlineSnapshot(`
    {
      "clientId": "lv1.1234567890abcdef",
      "clientSecret": "1234567890abcdef1234567890abcdef12345678",
      "clientType": "github-app",
      "token": "token123",
      "tokenType": "oauth",
      "type": "token",
    }
  `);

  expect(onVerification).toHaveBeenCalledWith({
    device_code: "devicecode123",
    expires_in: 900,
    interval: 0.005,
    user_code: "usercode123",
    verification_uri: "https://github.com/login/device",
  });
});

test("oauth-user witth `factory` option", async () => {
  const mock = fetchMock.sandbox().postOnce(
    "https://github.com/login/oauth/access_token",
    {
      access_token: "secret123",
      scope: "",
      token_type: "bearer",
    },
    {
      headers: {
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        client_id: "lv1.1234567890abcdef",
        client_secret: "1234567890abcdef1234567890abcdef12345678",
        code: "random123",
      },
    },
  );

  const appAuth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef1234567890abcdef12345678",
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: mock,
      },
    }),
  });

  const userAuth = await appAuth({
    type: "oauth-user",
    code: "random123",
    factory: createOAuthUserAuth,
  });

  const authentication = await userAuth();

  expect(authentication).toEqual({
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef1234567890abcdef12345678",
    clientType: "github-app",
    type: "token",
    tokenType: "oauth",
    token: "secret123",
  });
});

test("caches based on installation id", async () => {
  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read",
    },
    repository_selection: "all",
  };

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce(
          "path:/app/installations/123/access_tokens",
          createInstallationAccessTokenResponseData,
        )
        .postOnce(
          "path:/app/installations/456/access_tokens",
          Object.assign({}, createInstallationAccessTokenResponseData, {
            token: "secret456",
          }),
        ),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock,
  });

  const authentication1 = await auth({
    type: "installation",
    installationId: 123,
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 456,
  });

  expect(authentication1).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: { metadata: "read" },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
  });
  expect(authentication2).toEqual({
    type: "token",
    token: "secret456",
    tokenType: "installation",
    installationId: 456,
    permissions: { metadata: "read" },
    createdAt: "1970-01-01T00:00:00.000Z",
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all",
  });
});

test("supports custom cache", async () => {
  const CACHE: { [key: string]: string } = {};
  const get = vi
    .fn<(key: string) => string>()
    .mockImplementation((key) => CACHE[key]);
  const set = vi
    .fn<(key: string, value: string) => void>()
    .mockImplementation((key, value) => {
      CACHE[key] = value;
    });

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .post("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read",
          },
          repository_selection: "all",
          repeat: 4,
        })
        .postOnce("path:/app/installations/456/access_tokens", {
          token: "secret456",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read",
          },
          repository_selection: "all",
        }),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    cache: {
      get,
      set,
    },
    request: requestMock,
  });

  await auth({
    type: "installation",
    installationId: 123,
  });

  await auth({
    type: "installation",
    installationId: 123,
  });

  await auth({
    type: "installation",
    installationId: 123,
    permissions: {
      content: "read",
    },
  });

  await auth({
    type: "installation",
    installationId: 456,
  });

  expect(get).toHaveBeenCalledTimes(4);
  expect(set).toHaveBeenCalledTimes(3);
  expect(get).toHaveBeenCalledWith("123");
  expect(set).toHaveBeenCalledWith(
    "123",
    "secret123|1970-01-01T00:00:00.000Z|1970-01-01T01:00:00.000Z|all|metadata|",
  );
  expect(CACHE).toStrictEqual({
    "123":
      "secret123|1970-01-01T00:00:00.000Z|1970-01-01T01:00:00.000Z|all|metadata|",
    "123|content":
      "secret123|1970-01-01T00:00:00.000Z|1970-01-01T01:00:00.000Z|all||",
    "456":
      "secret456|1970-01-01T00:00:00.000Z|1970-01-01T01:00:00.000Z|all|metadata|",
  });
});

test("supports custom cache with async get/set", async () => {
  const CACHE: { [key: string]: string } = {};
  const get = vi
    .fn<(key: string) => Promise<string>>()
    .mockImplementation(async (key) => CACHE[key]);
  const set = vi
    .fn<(key: string, value: string) => Promise<void>>()
    .mockImplementation(async (key, value) => {
      CACHE[key] = value;
    });

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read",
          },
          repository_selection: "all",
        }),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    cache: {
      get,
      set,
    },
    request: requestMock,
  });

  await auth({
    type: "installation",
    installationId: 123,
  });

  await auth({
    type: "installation",
    installationId: 123,
  });

  expect(get).toHaveBeenCalledTimes(2);
  expect(set).toHaveBeenCalledTimes(1);
  expect(get).toHaveBeenCalledWith("123");
  expect(set).toHaveBeenCalledWith(
    "123",
    "secret123|1970-01-01T00:00:00.000Z|1970-01-01T01:00:00.000Z|all|metadata|",
  );
});

test("auth.hook() creates token and uses it for succeeding requests", async () => {
  const mock = fetchMock
    .sandbox()
    .postOnce("https://api.github.com/app/installations/123/access_tokens", {
      token: "secret123",
      expires_at: "1970-01-01T01:00:00.000Z",
      permissions: {
        metadata: "read",
      },
      repository_selection: "all",
    })
    .get(
      "https://api.github.com/repos/octocat/hello-world",
      { id: 123 },
      {
        headers: {
          authorization: "token secret123",
        },
        repeat: 4,
      },
    )
    .getOnce(
      "https://api.github.com/app",
      { id: 123 },
      {
        headers: {
          accept: "application/vnd.github.v3+json",
          "user-agent": "test",
          authorization: `bearer ${BEARER}`,
        },
      },
    );

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  await auth.hook(requestWithMock, "GET /repos/octocat/hello-world");
  await auth.hook(requestWithMock, "GET /repos/octocat/hello-world");

  await requestWithAuth("GET /repos/octocat/hello-world");
  await requestWithAuth("GET /repos/octocat/hello-world");

  await requestWithAuth("GET /app");

  expect(mock.done()).toBe(true);
});

test("auth.hook() uses app auth for full URLs", async () => {
  const mock = fetchMock
    .sandbox()
    .getOnce("https://api.github.com/app/installations?per_page=100", [], {
      headers: {
        authorization: `bearer ${BEARER}`,
      },
    });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  await requestWithAuth("GET https://api.github.com/app/installations", {
    per_page: 100,
  });

  expect(mock.done()).toBe(true);
});

test("auth.hook() uses app auth for marketplace URL", async () => {
  const mock = fetchMock.sandbox().getOnce(
    "path:/marketplace_listing/accounts/1",
    {},
    {
      headers: {
        authorization: `bearer ${BEARER}`,
      },
    },
  );

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  await requestWithAuth("GET /marketplace_listing/accounts/{account_id}", {
    account_id: 1,
  });

  expect(mock.done()).toBe(true);
});

test("auth.hook() uses client ID/client secret Basic Authentication for /applications/* requests", async () => {
  const mock = fetchMock
    .sandbox()
    .postOnce("https://github.com/login/oauth/access_token", {
      access_token: "secret123",
      scope: "",
    })
    .postOnce(
      "https://api.github.com/applications/123/token",
      {
        token: "secret123",
      },
      {
        body: {
          access_token: "secret123",
        },
      },
    );

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "123",
    clientSecret: "secret",
  });

  const requestWithAuth = request.defaults({
    request: {
      fetch: mock,
      hook: auth.hook,
    },
  });

  const response = await requestWithAuth(
    "POST /applications/{client_id}/token",
    {
      client_id: "123",
      access_token: "secret123",
    },
  );

  expect(response.data.token).toEqual("secret123");
});

test("auth.hook(): handle 401 due to an exp timestamp in the past", async () => {
  const mock = fetchMock
    .sandbox()
    .get("https://api.github.com/app", (_url, options) => {
      const auth = (options.headers as { [key: string]: string | undefined })[
        "authorization"
      ];
      const [_, jwt] = (auth || "").split(" ");
      const payload = JSON.parse(
        Buffer.from(jwt.split(".")[1], "base64").toString(),
      );

      // By default the mocked time will set the payload to 570 (10 minutes - 30 seconds in seconds)
      // By returning an error for that exp with an API time of 30 seconds in the future,
      // the new request will be made with a JWT that has an expiration set 30 seconds further in the future.
      if (payload.exp < 600) {
        return {
          status: 401,
          body: {
            message:
              "'Expiration time' claim ('exp') must be a numeric value representing the future time at which the assertion expires.",
            documentation_url: "https://docs.github.com/",
          },
          headers: {
            date: new Date(Date.now() + 30000).toUTCString(),
          },
        };
      }

      return {
        status: 200,
        body: {
          id: 1,
        },
      };
    });

  global.console.warn = vi.fn();

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    log: global.console,
  });

  const requestWithMock = request.defaults({
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  const promise = requestWithAuth("GET /app");
  const { data } = await promise;

  // @ts-ignore - jest complains about data being possible null
  expect(data.id).toStrictEqual(1);
  expect(mock.done()).toBe(true);

  // @ts-ignore
  expect(global.console.warn.mock.calls.length).toEqual(2);
  expect(global.console.warn).toHaveBeenNthCalledWith(
    1,
    "'Expiration time' claim ('exp') must be a numeric value representing the future time at which the assertion expires. - https://docs.github.com/",
  );
  expect(global.console.warn).toHaveBeenNthCalledWith(
    2,
    `[@octokit/auth-app] GitHub API time and system time are different by 30 seconds. Retrying request with the difference accounted for.`,
  );
});

test("auth.hook(): handle 401 due to an exp timestamp in the past with 800 second clock skew", async () => {
  const fakeTimeMs = 1029392939;
  const githubTimeMs = fakeTimeMs + 800000;

  vi.setSystemTime(fakeTimeMs);

  const mock = fetchMock
    .sandbox()
    .get("https://api.github.com/app", (_url, options) => {
      const auth = (options.headers as { [key: string]: string | undefined })[
        "authorization"
      ];
      const [_, jwt] = (auth || "").split(" ");
      const payload = JSON.parse(
        Buffer.from(jwt.split(".")[1], "base64").toString(),
      );

      // The first request will send an expiration that is 200 seconds before GitHub's mocked API time.
      // The second request will send an adjusted expiration claim based on the 800 seconds skew and trigger a 200 response.
      if (payload.exp <= Math.floor(githubTimeMs / 1000)) {
        return {
          status: 401,
          body: {
            message:
              "'Expiration time' claim ('exp') must be a numeric value representing the future time at which the assertion expires.",
            documentation_url: "https://docs.github.com/",
          },
          headers: {
            date: new Date(githubTimeMs).toUTCString(),
          },
        };
      }

      return {
        status: 200,
        body: { id: 1 },
      };
    });

  global.console.warn = vi.fn();

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    log: global.console,
  });

  const requestWithMock = request.defaults({
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  const promise = requestWithAuth("GET /app");
  const { data } = await promise;

  // @ts-ignore - jest complains about data being possible null
  expect(data.id).toStrictEqual(1);
  expect(mock.done()).toBe(true);

  // @ts-ignore
  expect(global.console.warn.mock.calls.length).toEqual(2);
  expect(global.console.warn).toHaveBeenNthCalledWith(
    1,
    "'Expiration time' claim ('exp') must be a numeric value representing the future time at which the assertion expires. - https://docs.github.com/",
  );
  expect(global.console.warn).toHaveBeenNthCalledWith(
    2,
    `[@octokit/auth-app] GitHub API time and system time are different by 800 seconds. Retrying request with the difference accounted for.`,
  );
});

test("auth.hook(): handle 401 due to an iat timestamp in the future", async () => {
  const mock = fetchMock
    .sandbox()
    .get("https://api.github.com/app", (_url, options) => {
      const auth = (options.headers as { [key: string]: string | undefined })[
        "authorization"
      ];
      const [_, jwt] = (auth || "").split(" ");
      const payload = JSON.parse(
        Buffer.from(jwt.split(".")[1], "base64").toString(),
      );

      // By default the mocked time will set the payload.iat to -30.
      // By returning an error for that exp with an API time of 30 seconds in the future,
      // the new request will be made with a JWT that has an issued_at set 30 seconds further in the future.
      if (payload.iat < 0) {
        return {
          status: 401,
          body: {
            message:
              "'Issued at' claim ('iat') must be an Integer representing the time that the assertion was issued.",
            documentation_url: "https://docs.github.com/",
          },
          headers: {
            date: new Date(Date.now() + 30000).toUTCString(),
          },
        };
      }

      return {
        status: 200,
        body: { id: 1 },
      };
    });

  global.console.warn = vi.fn();

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    log: global.console,
  });

  const requestWithMock = request.defaults({
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  const promise = requestWithAuth("GET /app");
  const { data } = await promise;

  // @ts-ignore - jest complains about data being possible null
  expect(data.id).toStrictEqual(1);
  expect(mock.done()).toBe(true);

  // @ts-ignore
  expect(global.console.warn.mock.calls.length).toEqual(2);
  expect(global.console.warn).toHaveBeenNthCalledWith(
    1,
    "'Issued at' claim ('iat') must be an Integer representing the time that the assertion was issued. - https://docs.github.com/",
  );
  expect(global.console.warn).toHaveBeenNthCalledWith(
    2,
    `[@octokit/auth-app] GitHub API time and system time are different by 30 seconds. Retrying request with the difference accounted for.`,
  );
});

test("auth.hook(): throw 401 error in app auth flow without timing errors", async () => {
  const mock = fetchMock
    .sandbox()
    .get("https://api.github.com/app", {
      status: 401,
      body: {
        message: "Bad credentials",
        documentation_url: "https://docs.github.com/",
      },
    })
    .get("https://api.github.com/marketplace_listing/plan", {
      status: 401,
      body: {
        message:
          "'Issued at' claim ('iat') must be an Integer representing the time that the assertion was issued.",
        documentation_url: "https://docs.github.com/",
      },
    });

  global.console.warn = vi.fn();

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    log: global.console,
  });

  const requestWithMock = request.defaults({
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  try {
    await requestWithAuth("GET /app");
    throw new Error("Should not resolve");
  } catch (error: any) {
    expect(error.status).toEqual(401);
  }

  try {
    await requestWithAuth("GET /marketplace_listing/plan");
    throw new Error("Should not resolve");
  } catch (error: any) {
    expect(error.status).toEqual(401);
  }
});

// skipping flaky test, see https://github.com/octokit/auth-app.js/pull/580
test.skip("auth.hook(): handle 401 in first 5 seconds (#65)", async () => {
  const FIVE_SECONDS_IN_MS = 1000 * 5;

  const mock = fetchMock
    .sandbox()
    .postOnce("https://api.github.com/app/installations/123/access_tokens", {
      token: "secret123",
      expires_at: "1970-01-01T01:00:00.000Z",
      permissions: {
        metadata: "read",
      },
      repository_selection: "all",
    })
    .get("https://api.github.com/repos/octocat/hello-world", () => {
      if (Date.now() < FIVE_SECONDS_IN_MS) {
        return {
          status: 401,
          body: {
            message: "Bad credentials",
            documentation_url: "https://docs.github.com/",
          },
        };
      }

      return {
        status: 200,
        body: { id: 123 },
      };
    })
    .getOnce(
      "https://api.github.com/repos/octocat/hello-world2",
      {
        status: 401,
        body: {
          message: "Bad credentials",
          documentation_url: "https://docs.github.com/",
        },
      },
      {
        headers: {
          authorization: "token secret123",
        },
      },
    );

  global.console.warn = vi.fn();

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
    log: global.console,
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  const promise = requestWithAuth("GET /repos/octocat/hello-world");

  // it takes 3 retries until a total time of more than 5s pass
  // Note sure why the first advance is needed, but it helped unblock https://github.com/octokit/auth-app.js/pull/580
  await vi.advanceTimersByTimeAsync(100);
  await vi.advanceTimersByTimeAsync(1000);
  await vi.advanceTimersByTimeAsync(2000);
  await vi.advanceTimersByTimeAsync(3000);

  const { data } = await promise;

  try {
    await requestWithAuth("GET /repos/octocat/hello-world2");
    throw new Error("Should not resolve");
  } catch (error: any) {
    expect(error.status).toEqual(401);
  }

  expect(data).toEqual({ id: 123 });
  expect(mock.done()).toBe(true);

  // @ts-ignore
  expect(global.console.warn.mock.calls.length).toEqual(3);
});

// skipping flaky test, see https://github.com/octokit/auth-app.js/pull/580
test.skip("auth.hook(): throw error with custom message after unsuccessful retries (#163)", async () => {
  expect.assertions(1);
  global.console.warn = vi.fn();

  const mock = fetchMock
    .sandbox()
    .postOnce("https://api.github.com/app/installations/123/access_tokens", {
      token: "secret123",
      expires_at: "1970-01-01T01:00:00.000Z",
      permissions: {
        metadata: "read",
      },
      repository_selection: "all",
    })
    .get("https://api.github.com/repos/octocat/hello-world", () => {
      return {
        status: 401,
        body: {
          message: "Bad credentials",
          documentation_url: "https://docs.github.com/",
        },
      };
    });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  const promise = requestWithAuth("GET /repos/octocat/hello-world");

  promise.catch((error) => {
    expect(error.message).toBe(
      `After 3 retries within 6s of creating the installation access token, the response remains 401. At this point, the cause may be an authentication problem or a system outage. Please check https://www.githubstatus.com for status information`,
    );
  });

  // it takes 3 retries until a total time of more than 5s pass
  // Note sure why the first advance is needed, but it helped unblock https://github.com/octokit/auth-app.js/pull/580
  await vi.advanceTimersByTimeAsync(100);
  await vi.advanceTimersByTimeAsync(1000);
  await vi.advanceTimersByTimeAsync(2000);
  await vi.advanceTimersByTimeAsync(3000);
  await vi.runAllTimersAsync();

  await promise;
});

test("auth.hook(): throws on 500 error without retries", async () => {
  const mock = fetchMock
    .sandbox()
    .postOnce("https://api.github.com/app/installations/123/access_tokens", {
      token: "secret123",
      expires_at: "1970-01-01T01:00:00.000Z",
      permissions: {
        metadata: "read",
      },
      repository_selection: "all",
    })
    .get("https://api.github.com/repos/octocat/hello-world", 500);

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  global.console.warn = vi.fn();

  try {
    await requestWithAuth("GET /repos/octocat/hello-world");
    throw new Error("Should not resolve");
  } catch (error: any) {
    expect(error.status).toEqual(500);
  }

  expect(mock.done()).toBe(true);

  // @ts-ignore
  expect(global.console.warn.mock.calls.length).toEqual(0);
});

test("oauth endpoint error", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://github.com/login/oauth/access_token", {
          status: 200,
          body: JSON.stringify({
            error: "incorrect_client_credentials",
            error_description:
              "The client_id and/or client_secret passed are incorrect.",
          }),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        }),
    },
  });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef1234567890abcdef12345678",
    request: requestMock,
  });

  await expect(
    auth({
      type: "oauth-user",
      code: "lv1.1234567890abcdef",
      redirectUrl: "https://example.com/login",
    }),
  ).rejects.toThrow("client_id");
});

test("auth.hook() and custom cache", async () => {
  const CACHE: { [key: string]: string } = {};
  const get = vi
    .fn<(key: string) => Promise<string>>()
    .mockImplementation(async (key) => CACHE[key]);
  const set = vi
    .fn<(key: string, value: string) => Promise<void>>()
    .mockImplementation(async (key, value) => {
      CACHE[key] = value;
    });

  const mock = fetchMock
    .sandbox()
    .post("https://api.github.com/app/installations/123/access_tokens", {
      token: "secret123",
      expires_at: "1970-01-01T01:00:00.000Z",
      permissions: {
        metadata: "read",
      },
      repository_selection: "all",
      repeat: 2,
    })
    .getOnce(
      "https://api.github.com/repos/octocat/hello-world",
      { id: 123 },
      {
        headers: {
          authorization: "token secret123",
        },
      },
    )
    .postOnce("https://api.github.com/app/installations/456/access_tokens", {
      token: "secret456",
      expires_at: "1970-01-01T01:00:00.000Z",
      permissions: {
        metadata: "read",
      },
      repository_selection: "all",
    })
    .getOnce(
      "https://api.github.com/repos/octocat/hello-world2",
      { id: 456 },
      {
        headers: {
          authorization: "token secret456",
        },
      },
    );

  const auth1 = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
    cache: { get, set },
  });

  const auth2 = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 456,
    cache: { get, set },
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth1 = requestWithMock.defaults({
    request: {
      hook: auth1.hook,
    },
  });
  const requestWithAuth2 = requestWithMock.defaults({
    request: {
      hook: auth2.hook,
    },
  });

  await requestWithAuth1("GET /repos/octocat/hello-world");
  await requestWithAuth2("GET /repos/octocat/hello-world2");

  expect(mock.done()).toBe(true);
  expect(CACHE).toStrictEqual({
    "123":
      "secret123|1970-01-01T00:00:00.000Z|1970-01-01T01:00:00.000Z|all|metadata|",
    "456":
      "secret456|1970-01-01T00:00:00.000Z|1970-01-01T01:00:00.000Z|all|metadata|",
  });
});

test("id and installationId can be passed as options", async () => {
  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read",
    },
    repository_selection: "all",
  };

  const auth = createAppAuth({
    appId: String(APP_ID),
    privateKey: PRIVATE_KEY,
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            "https://api.github.com/app/installations/123/access_tokens",
            createInstallationAccessTokenResponseData,
          ),
      },
    }),
  });

  const authentication = await auth({
    type: "installation",
    installationId: "123",
  });

  expect(authentication.token).toEqual("secret123");
});

test("createAppAuth passed with log option", async () => {
  const calls: String[] = [];

  const mock = fetchMock
    .sandbox()
    .get("https://api.github.com/app", (_url, options) => {
      const auth = (options.headers as { [key: string]: string | undefined })[
        "authorization"
      ];
      const [_, jwt] = (auth || "").split(" ");
      const payload = JSON.parse(
        Buffer.from(jwt.split(".")[1], "base64").toString(),
      );
      if (payload.exp < 600) {
        return {
          status: 401,
          body: {
            message:
              "'Expiration time' claim ('exp') must be a numeric value representing the future time at which the assertion expires.",
            documentation_url: "https://docs.github.com/",
          },
          headers: {
            date: new Date(Date.now() + 30000).toUTCString(),
          },
        };
      }

      return {
        status: 200,
        body: { id: 1 },
      };
    });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    log: {
      warn: () => calls.push("warn"),
    },
  });

  const requestWithMock = request.defaults({
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  const promise = requestWithAuth("GET /app");
  const { data } = await promise;

  // @ts-ignore - jest complains about data being possible null
  expect(data.id).toStrictEqual(1);
  expect(mock.done()).toBe(true);

  expect(calls).toStrictEqual(["warn", "warn"]);
});

test("factory auth option", async () => {
  const appAuth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    extra1: "value1",
    extra2: "value2",
  });

  const factory = vi
    .fn<FactoryInstallation<any>>()
    .mockReturnValue({ token: "secret" });

  const customAuth = await appAuth({
    type: "installation",
    installationId: 123,
    extra1: "auth overide",
    factory,
  });

  expect(customAuth.token).toStrictEqual("secret");

  const factoryOptions = factory.mock.calls[0][0];
  expect(Object.keys(factoryOptions).sort()).toStrictEqual([
    "appId",
    "cache",
    "extra1",
    "extra2",
    "installationId",
    "log",
    "privateKey",
    "request",
  ]);

  expect(factoryOptions).toEqual(
    expect.objectContaining({
      appId: APP_ID,
      privateKey: PRIVATE_KEY,
      installationId: 123,
      extra1: "auth overide",
      extra2: "value2",
    }),
  );
});

test("Do not intercept auth.hook(request, 'POST https://github.com/login/oauth/access_token') requests (#49)", async () => {
  const mock = fetchMock
    .sandbox()
    .postOnce("https://github.com/login/oauth/access_token", {
      access_token: "secret123",
      scope: "",
    });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "123",
    clientSecret: "secret",
  });

  const requestWithAuth = request.defaults({
    request: {
      fetch: mock,
      hook: auth.hook,
    },
  });

  const result = await requestWithAuth(
    "POST https://github.com/login/oauth/access_token",
    {
      headers: {
        accept: "application/json",
      },
      type: "token",
      code: "random123",
      state: "mystate123",
    },
  );
  expect(result.data).toEqual({
    access_token: "secret123",
    scope: "",
  });
});

test("throws helpful error if `appId` is not set (#184)", async () => {
  expect(() => {
    createAppAuth({
      // @ts-ignore
      appId: undefined,
      privateKey: PRIVATE_KEY,
    });
  }).toThrowError("[@octokit/auth-app] appId option is required");
});

test("allows passing an `appId` as a non numeric value", async () => {
  expect(() => {
    createAppAuth({
      appId: "Iv1.0123456789abcdef",
      privateKey: PRIVATE_KEY,
    });
  }).not.toThrow();
});

test("throws helpful error if `privateKey` is not set properly (#184)", async () => {
  expect(() => {
    createAppAuth({
      appId: APP_ID,
      // @ts-ignore
      privateKey: undefined,
    });
  }).toThrowError("[@octokit/auth-app] privateKey option is required");
});

test("throws helpful error if `installationId` is set to a falsy value in createAppAuth() (#184)", async () => {
  expect(() => {
    createAppAuth({
      appId: APP_ID,
      privateKey: PRIVATE_KEY,
      installationId: "",
    });
  }).toThrowError("[@octokit/auth-app] installationId is set to a falsy value");
});

test("auth.hook() uses installation auth for /orgs/{org}/installations requests (#374)", async () => {
  const mock = fetchMock
    .sandbox()
    .post("https://api.github.com/app/installations/123/access_tokens", {
      token: "secret123",
      expires_at: "1970-01-01T01:00:00.000Z",
      permissions: {
        metadata: "read",
      },
      repository_selection: "all",
      repeat: 2,
    })
    .getOnce("https://api.github.com/orgs/octocat/installations", {
      headers: {
        authorization: "token secret123",
      },
    });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  await requestWithAuth("GET /orgs/{org}/installations", {
    org: "octocat",
  });

  expect(mock.done()).toBe(true);
});

test("auth.hook() uses app auth even for requests with query strings. (#374)", async () => {
  const mock = fetchMock
    .sandbox()
    .getOnce("https://api.github.com/orgs/octocat/installation?per_page=100", {
      headers: {
        authorization: `bearer ${BEARER}`,
      },
    });

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  await requestWithAuth("GET /orgs/{org}/installation?per_page=100", {
    org: "octocat",
  });

  expect(mock.done()).toBe(true);
});

test("auth.hook() respects `baseUrl` passed as part of request parameters #640", async () => {
  const mock = fetchMock
    .sandbox()
    .postOnce(
      "https://not-api.github.com/app/installations/123/access_tokens",
      {
        token: "secret123",
        expires_at: "1970-01-01T01:00:00.000Z",
        permissions: {
          metadata: "read",
        },
        repository_selection: "all",
      },
    )
    .get(
      "https://not-api.github.com/repos/octocat/hello-world",
      { id: 123 },
      {
        headers: {
          authorization: "token secret123",
        },
        repeat: 4,
      },
    );

  const auth = createAppAuth({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test",
    },
    request: {
      fetch: mock,
    },
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook,
    },
  });

  const { data } = await requestWithAuth("GET /repos/octocat/hello-world", {
    baseUrl: "https://not-api.github.com",
  });

  expect(data).toEqual({ id: 123 });
});
