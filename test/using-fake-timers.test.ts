import fetchMock from "fetch-mock";

import { request } from "@octokit/request";
import { jest } from "@jest/globals";

import { createAppAuth } from "../src/index.ts";

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

// The "auth.hook(): throw error with custom message after unsuccessful retries (#163)" test in particular
// seems to randomply fail at times.
jest.retryTimes(3);

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(0);
});

test("auth.hook(): handle 401 in first 5 seconds (#65)", async () => {
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

  global.console.warn = jest.fn();

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
  await jest.advanceTimersByTimeAsync(100);
  await jest.advanceTimersByTimeAsync(1000);
  await jest.advanceTimersByTimeAsync(2000);
  await jest.advanceTimersByTimeAsync(3000);

  const { data } = await promise;

  jest.runAllTimers();
  jest.runAllTicks();
  jest.clearAllTimers();

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

test("auth.hook(): throw error with custom message after unsuccessful retries (#163)", async () => {
  expect.assertions(1);
  global.console.warn = jest.fn();

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

  const promise = requestWithAuth("GET /repos/octocat/hello-world").catch(
    (error) => {
      expect(error.message).toBe(
        `After 3 retries within 6s of creating the installation access token, the response remains 401. At this point, the cause may be an authentication problem or a system outage. Please check https://www.githubstatus.com for status information`,
      );
    },
  );

  // it takes 3 retries until a total time of more than 5s pass
  // Note sure why the first advance is needed, but it helped unblock https://github.com/octokit/auth-app.js/pull/580
  await jest.advanceTimersByTimeAsync(100);
  await jest.advanceTimersByTimeAsync(1000);
  await jest.advanceTimersByTimeAsync(2000);
  await jest.advanceTimersByTimeAsync(3000);

  jest.runAllTimers();
  jest.runAllTicks();
  jest.clearAllTimers();

  await promise;
});
