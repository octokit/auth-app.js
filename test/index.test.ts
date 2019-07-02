import { install } from "lolex";

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

const clock = install({ now: 0, toFake: ["Date", "setTimeout"] });

test("README example for app auth", async () => {
  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY
  });

  const authentication = await auth();

  expect(authentication).toEqual({
    type: "app",
    token: BEARER,
    appId: 1,
    expiration: 600,
    headers: {
      authorization: `bearer ${BEARER}`
    },
    query: {}
  });
});

test("README example for installation auth", async () => {
  const request = jest
    .fn()

    .mockImplementation(async route => {
      if (route === "POST /app/installations/:installation_id/access_tokens") {
        return {
          data: {
            token: "secret123",
            expires_at: "1970-01-01T01:00:00.000Z"
          }
        };
      }

      return {
        data: {
          permissions: {
            metadata: "read"
          },
          single_file_name: null
        }
      };
    });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
  });

  const authentication = await auth({ installationId: 123 });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    headers: {
      authorization: "token secret123"
    },
    query: {}
  });

  expect(request).toBeCalledWith(
    "POST /app/installations/:installation_id/access_tokens",
    {
      installation_id: 123,
      previews: ["machine-man"],
      headers: {
        authorization: `bearer ${BEARER}`
      }
    }
  );
});

test("README example for installation auth based on URL", async () => {
  const request = jest.fn().mockImplementation(async route => {
    if (route === "POST /app/installations/:installation_id/access_tokens") {
      return {
        data: {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z"
        }
      };
    }

    return {
      data: {
        permissions: {
          metadata: "read"
        },
        single_file_name: null
      }
    };
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
  });

  const authentication = await auth({
    installationId: 123,
    url: "/installation/repositories"
  });

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: { metadata: "read" },
    expiresAt: "1970-01-01T01:00:00.000Z",
    headers: {
      authorization: "token secret123"
    },
    query: {}
  });

  expect(request).toBeCalledWith(
    "POST /app/installations/:installation_id/access_tokens",
    {
      installation_id: 123,
      previews: ["machine-man"],
      headers: {
        authorization: `bearer ${BEARER}`
      }
    }
  );
});

test("installationId strategy option", async () => {
  const request = jest
    .fn()

    .mockImplementation(async route => {
      if (route === "POST /app/installations/:installation_id/access_tokens") {
        return {
          data: {
            token: "secret123",
            expires_at: "1970-01-01T01:00:00.000Z"
          }
        };
      }

      return {
        data: {
          permissions: {
            metadata: "read"
          },
          single_file_name: null
        }
      };
    });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    installationId: 123,
    // @ts-ignore
    request
  });

  const authentication = await auth();

  expect(authentication).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: {
      metadata: "read"
    },
    expiresAt: "1970-01-01T01:00:00.000Z",
    headers: {
      authorization: "token secret123"
    },
    query: {}
  });

  expect(request).toBeCalledWith(
    "POST /app/installations/:installation_id/access_tokens",
    {
      installation_id: 123,
      previews: ["machine-man"],
      headers: {
        authorization: `bearer ${BEARER}`
      }
    }
  );
});

test("repositoryIds auth option", async () => {
  const request = jest.fn().mockImplementation(async route => {
    if (route === "POST /app/installations/:installation_id/access_tokens") {
      return {
        data: {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          repositories: [{ id: 1 }, { id: 2 }, { id: 3 }]
        }
      };
    }

    return {
      data: {
        permissions: {
          metadata: "read"
        },
        single_file_name: null
      }
    };
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
  });

  const authentication = await auth({
    installationId: 123,
    repositoryIds: [1, 2, 3],
    url: "/installation/repositories"
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
    headers: {
      authorization: "token secret123"
    },
    query: {}
  });

  expect(request).toBeCalledWith(
    "POST /app/installations/:installation_id/access_tokens",
    {
      installation_id: 123,
      repository_ids: [1, 2, 3],
      previews: ["machine-man"],
      headers: {
        authorization: `bearer ${BEARER}`
      }
    }
  );
});

test("permissions auth option", async () => {
  const request = jest
    .fn()

    .mockImplementation(async route => {
      if (route === "POST /app/installations/:installation_id/access_tokens") {
        return {
          data: {
            token: "secret123",
            expires_at: "1970-01-01T01:00:00.000Z",
            permissions: {
              single_file: "write"
            }
          }
        };
      }

      return {
        data: {
          permissions: {
            single_file: "write"
          },
          single_file_name: ".github/myapp.yml"
        }
      };
    });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
  });

  const authentication = await auth({
    installationId: 123,
    permissions: {
      single_file: "write"
    },
    url: "/installation/repositories"
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
    headers: {
      authorization: "token secret123"
    },
    query: {}
  });

  expect(request).toBeCalledWith(
    "POST /app/installations/:installation_id/access_tokens",
    {
      installation_id: 123,
      permissions: {
        single_file: "write"
      },
      previews: ["machine-man"],
      headers: {
        authorization: `bearer ${BEARER}`
      }
    }
  );
  expect(request).toBeCalledWith("GET /app/installations/:installation_id", {
    installation_id: 123,
    previews: ["machine-man"],
    headers: {
      authorization: `bearer ${BEARER}`
    }
  });
});

test("app auth based on URL", async () => {
  const request = jest.fn().mockImplementation(() => {
    throw new Error("Should not create installation token");
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
  });

  const authentication = await auth({
    installationId: 123,
    url: "/app"
  });

  expect(authentication).toEqual({
    type: "app",
    token: BEARER,
    appId: 1,
    expiration: 600,
    headers: {
      authorization: `bearer ${BEARER}`
    },
    query: {}
  });
});

test("installation auth from cache", async () => {
  const request = jest.fn().mockImplementation(async route => {
    if (route === "POST /app/installations/:installation_id/access_tokens") {
      return {
        data: {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z"
        }
      };
    }

    return {
      data: {
        permissions: {
          metadata: "read",
          issues: "write"
        },
        single_file_name: null
      }
    };
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
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
    headers: {
      authorization: "token secret123"
    },
    query: {}
  };

  const authentication1 = await auth({
    installationId: 123
  });
  const authentication2 = await auth({
    installationId: 123
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);

  expect(request.mock.calls.length).toEqual(2);
});

test("installation auth with selected repositories from cache", async () => {
  const request = jest.fn().mockImplementation(async route => {
    if (route === "POST /app/installations/:installation_id/access_tokens") {
      return {
        data: {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z",
          repositories: [{ id: 1 }, { id: 2 }, { id: 3 }]
        }
      };
    }

    return {
      data: {
        permissions: {
          metadata: "read",
          issues: "write"
        },
        single_file_name: null
      }
    };
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
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
    repositoryIds: [1, 2, 3],
    expiresAt: "1970-01-01T01:00:00.000Z",
    headers: {
      authorization: "token secret123"
    },
    query: {}
  };

  const authentication1 = await auth({
    installationId: 123,
    repositoryIds: [1, 2, 3]
  });
  const authentication2 = await auth({
    installationId: 123,
    repositoryIds: [1, 2, 3]
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);

  expect(request.mock.calls.length).toEqual(2);
});

test("installation cache with different options", async () => {
  const request = jest.fn().mockImplementation(async route => {
    if (route === "POST /app/installations/:installation_id/access_tokens") {
      return {
        data: {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z"
        }
      };
    }

    return {
      data: {
        permissions: {
          metadata: "read"
        }
      }
    };
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
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
    headers: {
      authorization: "token secret123"
    },
    query: {}
  };

  const authentication1 = await auth({
    installationId: 123
  });
  const authentication2 = await auth({
    installationId: 123,
    permissions: {
      metadata: "read"
    }
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);

  expect(request.mock.calls.length).toEqual(4);
});

test("refresh option", async () => {
  const request = jest.fn().mockImplementation(async route => {
    if (route === "POST /app/installations/:installation_id/access_tokens") {
      return {
        data: {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z"
        }
      };
    }

    return {
      data: {
        permissions: {
          metadata: "read",
          issues: "write"
        },
        single_file_name: null
      }
    };
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
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
    headers: {
      authorization: "token secret123"
    },
    query: {}
  };

  const authentication1 = await auth({
    installationId: 123,
    refresh: true
  });
  const authentication2 = await auth({
    installationId: 123,
    refresh: true
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);

  expect(request.mock.calls.length).toEqual(4);
});

test("caches based on installation id", async () => {
  const request = jest.fn().mockImplementation(async route => {
    if (route === "POST /app/installations/:installation_id/access_tokens") {
      return {
        data: {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z"
        }
      };
    }

    return {
      data: {
        permissions: {
          metadata: "read"
        }
      }
    };
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
  });

  const authentication1 = await auth({
    installationId: 123
  });
  const authentication2 = await auth({
    installationId: 456
  });

  expect(authentication1).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 123,
    permissions: { metadata: "read" },
    expiresAt: "1970-01-01T01:00:00.000Z",
    headers: {
      authorization: "token secret123"
    },
    query: {}
  });
  expect(authentication2).toEqual({
    type: "token",
    token: "secret123",
    tokenType: "installation",
    installationId: 456,
    permissions: { metadata: "read" },
    expiresAt: "1970-01-01T01:00:00.000Z",
    headers: {
      authorization: "token secret123"
    },
    query: {}
  });

  expect(request.mock.calls.length).toEqual(4);
  expect(request).toBeCalledWith(
    "POST /app/installations/:installation_id/access_tokens",
    {
      installation_id: 123,
      previews: ["machine-man"],
      headers: {
        authorization: `bearer ${BEARER}`
      }
    }
  );
  expect(request).toBeCalledWith(
    "POST /app/installations/:installation_id/access_tokens",
    {
      installation_id: 456,
      previews: ["machine-man"],
      headers: {
        authorization: `bearer ${BEARER}`
      }
    }
  );
});

const ONE_HOUR_IN_MS = 1000 * 60 * 60;
test("request installation again after timeout", async () => {
  const request = jest.fn().mockImplementation(async route => {
    if (route === "POST /app/installations/:installation_id/access_tokens") {
      return {
        data: {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z"
        }
      };
    }

    return {
      data: {
        permissions: {
          metadata: "read"
        }
      }
    };
  });

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request
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
    headers: {
      authorization: "token secret123"
    },
    query: {}
  };

  const authentication1 = await auth({
    installationId: 123
  });

  await new Promise(resolve => {
    setTimeout(resolve, ONE_HOUR_IN_MS);
    clock.tick(ONE_HOUR_IN_MS);
  });

  const authentication2 = await auth({
    installationId: 123
  });

  expect(authentication1).toEqual(EXPECTED);
  expect(authentication2).toEqual(EXPECTED);

  expect(request.mock.calls.length).toEqual(4);
});

test("supports custom cache", async () => {
  const options = {
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    cache: {
      get: jest.fn(),
      set: jest.fn()
    }
  };

  const request = jest.fn().mockImplementation(async route => {
    if (route === "POST /app/installations/:installation_id/access_tokens") {
      return {
        data: {
          token: "secret123",
          expires_at: "1970-01-01T01:00:00.000Z"
        }
      };
    }

    return {
      data: {
        permissions: {
          metadata: "read"
        }
      }
    };
  });

  const get = jest.fn();
  const set = jest.fn();

  const auth = createAppAuth({
    id: APP_ID,
    privateKey: PRIVATE_KEY,
    // @ts-ignore
    request,
    cache: {
      get,
      set
    }
  });

  const authentication = await auth({
    installationId: 123
  });

  expect(get).toBeCalledWith("123");
  expect(set).toBeCalledWith(
    "123",
    "secret123|1970-01-01T01:00:00.000Z|metadata"
  );
});
