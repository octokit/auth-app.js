import fetchMock, { MockMatcherFunction } from "fetch-mock";
import { request } from "@octokit/request";
import { install, Clock } from "lolex";

import { createAppAuth } from "../src/index";

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
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjAsImV4cCI6NjAwLCJpc3MiOjF9.UYfZtE742hkMV5cKMwp6-gVUvsWnUGoCQkl2UZZEkN8-lgvqzq5V8e5KtTrJxAAgcK7Yn1ViAlDUpwc9hZxrZ-gLaR10GR2hubte3OgkRDH-m_lCQ1Sgb9VQpZnagh_PMyRwphOw3uDXU3D7h2jL86UP3Ora8i9SRgXLq8X_2R9jtr2FDT1wtmcOLdyIc0Q7c_4X1uIPNjZS2UY04QBT7VWePk81EGdJAVQ_nEygXIuWOpMwZvtD0K1hzqQQM9GyV2QOwFSvFLtdbMVyld6Qvs8eEA5VS6Y4vTrGuyUF_lH5XlPdfAFAyrzsGP4inLq3tq6y4mjsx3YIF0P8DcMNPw";

let clock: Clock;
beforeEach(() => {
  clock = install({ now: 0, toFake: ["Date", "setTimeout"] });
});

test("README example for app auth", async () => {
  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY
  });

  const authentication = await auth({ type: "app" });

  expect(authentication).toEqual({
    type: "app",
    token: BEARER,
    appId: 1,
    expiresAt: "1970-01-01T00:00:00.600Z"
  });
});

test("README example for installation auth", async () => {
  const matchCreateInstallationAccessToken: MockMatcherFunction = (
    url,
    { body, headers }
  ) => {
    expect(url).toEqual(
      "https://api.github.com/app/installations/123/access_tokens"
    );
    expect(headers).toStrictEqual({
      accept: "application/vnd.github.machine-man-preview+json",
      "user-agent": "test",
      "content-type": "application/json; charset=utf-8",
      authorization: `bearer ${BEARER}`
    });
    expect(JSON.parse(String(body))).toStrictEqual({});
    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read"
    },
    repository_selection: "all"
  };

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: request.defaults({
      headers: {
        "user-agent": "test"
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateInstallationAccessToken,
            createInstallationAccessTokenResponseData
          )
      }
    })
  });

  const authentication = await auth({
    type: "installation",
    installationId: 123
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  });
});

test("README example for oauth", async () => {
  const matchCreateOAuthAccessToken: MockMatcherFunction = (
    url,
    { body, headers }
  ) => {
    expect(url).toEqual("https://github.com/login/oauth/access_token");
    expect(headers).toStrictEqual({
      accept: "application/json",
      "user-agent": "test",
      "content-type": "application/json; charset=utf-8"
    });
    expect(JSON.parse(String(body))).toStrictEqual({
      client_id: "12345678901234567890",
      client_secret: "1234567890123456789012345678901234567890",
      code: "123456"
    });
    return true;
  };

  const createOAuthAccessTokenResponseData = {
    access_token: "secret123",
    scope: "",
    token_type: "bearer"
  };

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "12345678901234567890",
    clientSecret: "1234567890123456789012345678901234567890",
    request: request.defaults({
      headers: {
        "user-agent": "test"
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateOAuthAccessToken,
            createOAuthAccessTokenResponseData
          )
      }
    })
  });

  const authentication = await auth({
    type: "oauth",
    code: "123456"
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "oauth",
    scopes: []
  });
});

test("installationId strategy option", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
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
              metadata: "read"
            },
            repository_selection: "all"
          }
        )
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
    request: requestMock
  });

  const authentication = await auth({
    type: "installation"
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  });
});

test("repositoryIds auth option", async () => {
  const matchCreateInstallationAccessToken: MockMatcherFunction = (
    url,
    { body }
  ) => {
    expect(JSON.parse(String(body))).toStrictEqual({
      repository_ids: [1, 2, 3]
    });
    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read"
    },
    repositories: [{ id: 1 }, { id: 2 }, { id: 3 }],
    repository_selection: "all"
  };

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: request.defaults({
      headers: {
        "user-agent": "test"
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateInstallationAccessToken,
            createInstallationAccessTokenResponseData
          )
      }
    })
  });

  const authentication = await auth({
    type: "installation",
    installationId: 123,
    repositoryIds: [1, 2, 3]
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositoryIds: [1, 2, 3],
    repositorySelection: "all"
  });
});

test("permissions auth option", async () => {
  const matchCreateInstallationAccessToken: MockMatcherFunction = (
    url,
    { body }
  ) => {
    expect(JSON.parse(String(body))).toStrictEqual({
      permissions: {
        single_file: "write"
      }
    });
    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      single_file: "write"
    },
    single_file: ".github/myapp.yml",
    repository_selection: "all"
  };

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: request.defaults({
      headers: {
        "user-agent": "test"
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateInstallationAccessToken,
            createInstallationAccessTokenResponseData
          )
      }
    })
  });

  const authentication = await auth({
    type: "installation",
    installationId: 123,
    permissions: {
      single_file: "write"
    }
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    expiresAt: "1970-01-01T01:00:00.000Z",
    permissions: {
      single_file: "write"
    },
    singleFileName: ".github/myapp.yml",
    repositorySelection: "all"
  });
});

test("installation auth from cache", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read",
            issues: "write"
          },
          repository_selection: "all"
        })
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read",
      issues: "write"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
});

test("installation auth with selected repositories from cache", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read"
          },
          repository_selection: "all",
          repositories: [{ id: 1 }, { id: 2 }, { id: 3 }]
        })
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    },
    repositoryIds: [1, 2, 3],
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123,
    repositoryIds: [1, 2, 3]
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123,
    repositoryIds: [1, 2, 3]
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
});

test("installation auth with selected permissions from cache", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            issues: "write"
          },
          repository_selection: "all"
        })
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      issues: "write"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123,
    permissions: {
      issues: "write"
    }
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123,
    permissions: {
      issues: "write"
    }
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
});

test("installation cache with different options", async () => {
  const matchCreateAccessToken1: MockMatcherFunction = (url, { body }) => {
    expect(JSON.parse(String(body))).toStrictEqual({});
    return true;
  };
  const matchCreateAccessToken2: MockMatcherFunction = (url, { body }) => {
    expect(JSON.parse(String(body))).toStrictEqual({
      permissions: {
        metadata: "read"
      }
    });
    return true;
  };

  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read"
    },
    repository_selection: "all"
  };

  const mock = fetchMock
    .sandbox()
    .postOnce(
      matchCreateAccessToken1,
      createInstallationAccessTokenResponseData
    )
    .postOnce(
      matchCreateAccessToken2,
      createInstallationAccessTokenResponseData
    );

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: mock
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    }
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
  expect(mock.done()).toBe(true);
});

test("refresh option", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "path:/app/installations/123/access_tokens",
        {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read"
          },
          repository_selection: "all"
        },
        {
          repeat: 2
        }
      )
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123,
    refresh: true
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 123,
    refresh: true
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
});

test("oauth with `code`, `redirectUrl` and `state`", async () => {
  const matchCreateOAuthAccessToken: MockMatcherFunction = (
    url,
    { body, headers }
  ) => {
    expect(url).toEqual("https://github.com/login/oauth/access_token");
    expect(headers).toStrictEqual({
      accept: "application/json",
      "user-agent": "test",
      "content-type": "application/json; charset=utf-8"
    });
    expect(JSON.parse(String(body))).toStrictEqual({
      client_id: "12345678901234567890",
      client_secret: "1234567890123456789012345678901234567890",
      code: "123456",
      redirect_uri: "https://example.com/login",
      state: "mystate123"
    });

    return true;
  };

  const createOAuthAccessTokenResponseData = {
    access_token: "secret123",
    scope: "",
    token_type: "bearer"
  };

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "12345678901234567890",
    clientSecret: "1234567890123456789012345678901234567890",
    request: request.defaults({
      headers: {
        "user-agent": "test"
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            matchCreateOAuthAccessToken,
            createOAuthAccessTokenResponseData
          )
      }
    })
  });

  const authentication = await auth({
    type: "oauth",
    code: "123456",
    state: "mystate123",
    redirectUrl: "https://example.com/login"
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "oauth",
    scopes: []
  });
});

test("oauth with custom baseUrl (GHE)", async () => {
  const createOAuthAccessTokenResponseData = {
    access_token: "secret123",
    scope: "",
    token_type: "bearer"
  };

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    clientId: "12345678901234567890",
    clientSecret: "1234567890123456789012345678901234567890",
    request: request.defaults({
      baseUrl: "https://github.acme-inc.com/api/v3",
      headers: {
        "user-agent": "test"
      },
      request: {
        fetch: fetchMock
          .sandbox()
          .postOnce(
            "https://github.acme-inc.com/login/oauth/access_token",
            createOAuthAccessTokenResponseData
          )
      }
    })
  });

  const authentication = await auth({
    type: "oauth",
    code: "123456",
    state: "mystate123",
    redirectUrl: "https://example.com/login"
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "oauth",
    scopes: []
  });
});

test("caches based on installation id", async () => {
  const createInstallationAccessTokenResponseData = {
    token: "secret123",
    expires_at: "1970-01-01T01:00:00.000Z",
    permissions: {
      metadata: "read"
    },
    repository_selection: "all"
  };

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce(
          "path:/app/installations/123/access_tokens",
          createInstallationAccessTokenResponseData
        )
        .postOnce(
          "path:/app/installations/456/access_tokens",
          Object.assign({}, createInstallationAccessTokenResponseData, {
            token: "secret456"
          })
        )
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock
  });

  const authentication1 = await auth({
    type: "installation",
    installationId: 123
  });
  const authentication2 = await auth({
    type: "installation",
    installationId: 456
  });

  expect(authentication1).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: { metadata: "read" },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  });
  expect(authentication2).toEqual({
    type: "token",
    token: "secret456",
    tokenType: "installation",
    installationId: 456,
    permissions: { metadata: "read" },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  });
});

const ONE_HOUR_IN_MS = 1000 * 60 * 60;
test("request installation again after timeout", async () => {
  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "path:/app/installations/123/access_tokens",
        {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read"
          },
          repository_selection: "all"
        },
        {
          repeat: 2
        }
      )
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    request: requestMock
  });

  const EXPECTED = {
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    repositorySelection: "all"
  };

  const authentication1 = await auth({
    type: "installation",
    installationId: 123
  });

  await new Promise(resolve => {
    setTimeout(resolve, ONE_HOUR_IN_MS);
    clock.tick(ONE_HOUR_IN_MS);
  });

  const authentication2 = await auth({
    type: "installation",
    installationId: 123
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);
});

test("supports custom cache", async () => {
  const CACHE: { [key: string]: string } = {};
  const get = jest.fn().mockImplementation(key => CACHE[key]);
  const set = jest.fn().mockImplementation((key, value) => {
    CACHE[key] = value;
  });

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read"
          },
          repository_selection: "all"
        })
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    cache: {
      get,
      set
    },
    request: requestMock
  });

  await auth({
    type: "installation",
    installationId: 123
  });

  await auth({
    type: "installation",
    installationId: 123
  });

  expect(get).toHaveBeenCalledTimes(2);
  expect(set).toHaveBeenCalledTimes(1);
  expect(get).toBeCalledWith("123");
  expect(set).toBeCalledWith(
    "123",
    "secret123|1970-01-01T01:00:00.000Z|all|metadata"
  );
});

test("supports custom cache with async get/set", async () => {
  const CACHE: { [key: string]: string } = {};
  const get = jest.fn().mockImplementation(async key => CACHE[key]);
  const set = jest.fn().mockImplementation(async (key, value) => {
    CACHE[key] = value;
  });

  const requestMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .postOnce("path:/app/installations/123/access_tokens", {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          permissions: {
            metadata: "read"
          },
          repository_selection: "all"
        })
    }
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    cache: {
      get,
      set
    },
    request: requestMock
  });

  await auth({
    type: "installation",
    installationId: 123
  });

  await auth({
    type: "installation",
    installationId: 123
  });

  expect(get).toHaveBeenCalledTimes(2);
  expect(set).toHaveBeenCalledTimes(1);
  expect(get).toBeCalledWith("123");
  expect(set).toBeCalledWith(
    "123",
    "secret123|1970-01-01T01:00:00.000Z|all|metadata"
  );
});

test("auth.hook() creates token and uses it for succeeding requests", async () => {
  const mock = fetchMock
    .sandbox()
    .postOnce("https://api.github.com/app/installations/123/access_tokens", {
      token: "secret123",
      expires_at: "1970-01-01T01:00:00.000Z",
      permissions: {
        metadata: "read"
      },
      repository_selection: "all"
    })
    .get(
      "https://api.github.com/repos/octocat/hello-world",
      { id: 123 },
      {
        headers: {
          authorization: "token secret123"
        },
        repeat: 4
      }
    )
    .getOnce(
      "https://api.github.com/app",
      { id: 123 },
      {
        headers: {
          accept: "application/vnd.github.machine-man-preview+json",
          "user-agent": "test",
          authorization: `bearer ${BEARER}`
        }
      }
    );

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123
  });

  const requestWithMock = request.defaults({
    headers: {
      "user-agent": "test"
    },
    request: {
      fetch: mock
    }
  });
  const requestWithAuth = requestWithMock.defaults({
    request: {
      hook: auth.hook
    }
  });

  await auth.hook(requestWithMock, "GET /repos/octocat/hello-world");
  await auth.hook(requestWithMock, "GET /repos/octocat/hello-world");

  await requestWithAuth("GET /repos/octocat/hello-world");
  await requestWithAuth("GET /repos/octocat/hello-world");

  await requestWithAuth("GET /app", {
    mediaType: {
      previews: ["machine-man"]
    }
  });

  expect(mock.done()).toBe(true);
});
