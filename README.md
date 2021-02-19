# auth-app.js

> GitHub App authentication for JavaScript

[![@latest](https://img.shields.io/npm/v/@octokit/auth-app.svg)](https://www.npmjs.com/package/@octokit/auth-app)
[![Build Status](https://github.com/octokit/auth-app.js/workflows/Test/badge.svg)](https://github.com/octokit/auth-app.js/actions?query=workflow%3ATest)

`@octokit/auth-app` implements authentication for GitHub Apps using [JSON Web Token](https://jwt.io/) and installation access tokens.

For other GitHub authentication strategies see [octokit/auth.js](https://github.com/octokit/auth.js).

<!-- toc -->

- [Usage](#usage)
- [`createAppAuth(options)`](#createappauthoptions)
- [`auth(options)`](#authoptions)
- [Authentication object](#authentication-object)
  - [JSON Web Token (JWT) authentication](#json-web-token-jwt-authentication)
  - [Installation access token authentication](#installation-access-token-authentication)
  - [OAuth access token authentication](#oauth-access-token-authentication)
- [`auth.hook(request, route, parameters)` or `auth.hook(request, options)`](#authhookrequest-route-parameters-or-authhookrequest-options)
- [Implementation details](#implementation-details)
- [License](#license)

<!-- tocstop -->

## Usage

<table>
<tbody valign=top align=left>
<tr><th>
Browsers
</th><td width=100%>

Load `@octokit/auth-app` directly from [cdn.skypack.dev](https://cdn.skypack.dev)

```html
<script type="module">
  import { createAppAuth } from "https://cdn.skypack.dev/@octokit/auth-app";
</script>
```

</td></tr>
<tr><th>
Node
</th><td>

Install with <code>npm install @octokit/auth-app</code>

```js
const { createAppAuth } = require("@octokit/auth-app");
// or: import { createAppAuth } from "@octokit/auth-app";
```

</td></tr>
<tr><td colspan=2>

⚠️ For usage in browsers: The private keys provided by GitHub are in `PKCS#1` format, but the WebCrypto API only supports `PKCS#8`. You need to convert it first:

```shell
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private-key.pem -out private-key-pkcs8.key
```

No conversation is needed in Node, both `PKCS#1` and `PKCS#8` format will work.

</td></tr>
</tbody>
</table>

```js
const auth = createAppAuth({
  appId: 1,
  privateKey: "-----BEGIN PRIVATE KEY-----\n...",
  installationId: 123,
  clientId: "1234567890abcdef1234",
  clientSecret: "1234567890abcdef12341234567890abcdef1234",
});

// Retrieve JSON Web Token (JWT) to authenticate as app
const appAuthentication = await auth({ type: "app" });
// resolves with
// {
//   type: 'app',
//   token: 'jsonwebtoken123',
//   appId: 123,
//   expiresAt: '2018-07-07T00:09:30.000Z'
// }

// Retrieve installation access token
const installationAuthentication = await auth({ type: "installation" });
// resolves with
// {
//   type: 'token',
//   tokenType: 'installation',
//   token: 'token123',
//   installationId: 123,
//   createdAt: '2018-07-07T00:00:00.000Z'
//   expiresAt: '2018-07-07T00:59:00.000Z'
// }

// Retrieve an oauth-access token
const oauthAuthentication = await auth({ type: "oauth", code: "123456" });
// resolves with
// {
//   type: 'token',
//   tokenType: 'oauth',
//   token: 'token123'
// }
```

## `createAppAuth(options)`

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>appId</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        <strong>Required</strong>. Find <strong>App ID</strong> on the app’s about page in settings.
      </td>
    </tr>
    <tr>
      <th>
        <code>privateKey</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required</strong>. Content of the <code>*.pem</code> file you downloaded from the app’s about page. You can generate a new private key if needed.
      </td>
    </tr>
    <tr>
      <th>
        <code>installationId</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        Default <code>installationId</code> to be used when calling <code>auth({ type: "installation" })</code>.
      </td>
    </tr>
    <tr>
      <th>
        <code>clientId</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The Client ID of the GitHub App.
      </td>
    </tr>
    <tr>
      <th>
        <code>clientSecret</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The Client Secret of the GitHub App.
      </td>
    </tr>
    <tr>
      <th>
        <code>request</code>
      </th>
      <th>
        <code>function</code>
      </th>
      <td>
        You can pass in your own <a href="https://github.com/octokit/request.js"><code>@octokit/request</code></a> instance. For usage with enterprise, set <code>baseUrl</code> to the hostname + <code>/api/v3</code>. Example:

```js
const { request } = require("@octokit/request");
createAppAuth({
  appId: 1,
  privateKey: "-----BEGIN PRIVATE KEY-----\n...",
  request: request.defaults({
    baseUrl: "https://ghe.my-company.com/api/v3",
  }),
});
```

</td></tr>
    <tr>
      <th>
        <code>cache</code>
      </th>
      <th>
        <code>object</code>
      </th>
      <td>
        Installation tokens expire after an hour. By default, <code>@octokit/auth-app</code> is caching up to 15000 tokens simultaneously using <a href="https://github.com/isaacs/node-lru-cache">lru-cache</a>. You can pass your own cache implementation by passing <code>options.cache.{get,set}</code> to the constructor. Example:

```js
const CACHE = {};
createAppAuth({
  appId: 1,
  privateKey: "-----BEGIN PRIVATE KEY-----\n...",
  cache: {
    async get(key) {
      return CACHE[key];
    },
    async set(key, value) {
      CACHE[key] = value;
    },
  },
});
```

</td></tr>
  <tr>
      <th>
        <code>log</code>
      </th>
      <th>
        <code>object</code>
      </th>
      <td>
        You can pass in your preferred logging tool by passing <code>option.log</code> to the constructor. If you would like to make the log level configurable using an environment variable or external option, we recommend the console-log-level package. For example:

```js
createAppAuth({
  appId: 1,
  privateKey: "-----BEGIN PRIVATE KEY-----\n...",
  log: require("console-log-level")({ level: "info" }),
});
```

</td></tr>
  </tbody>
</table>

## `auth(options)`

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required</strong>. Must be either <code>"app"</code>, <code>"installation"</code>, or <code>"oauth"</code>.
      </td>
    </tr>
    <tr>
      <th>
        <code>installationId</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        <strong>Required if <code>type</code> is set to <code>"installation"</code> unless a default <code>installationId</code> was passed to <code>createAppAuth()</code></strong>. ID of installation to retrieve authentication for.
      </td>
    </tr>
    <tr>
      <th>
        <code>repositoryIds</code>
      </th>
      <th>
        <code>array of string</code>
      </th>
      <td>
        Only relevant if <code>type</code> is set to <code>"installation"</code>.<br>
        <br>
        The `id`s of the repositories that the installation token can access.
      </td>
    </tr>
    <tr>
      <th>
        <code>permissions</code>
      </th>
      <th>
        <code>object</code>
      </th>
      <td>
        Only relevant if <code>type</code> is set to <code>"installation"</code>.<br>
        <br>
        The permissions granted to the access token. The permissions object includes the permission names and their access type. For a complete list of permissions and allowable values, see <a href="https://docs.github.com/en/developers/apps/creating-a-github-app-using-url-parameters#github-app-permissions">GitHub App permissions</a>.
      </td>
    </tr>
    <tr>
      <th>
        <code>factory</code>
      </th>
      <th>
        <code>function</code>
      </th>
      <td>
Only relevant if `type` is set to `"installation"`.

When the `factory` option is, the `auth({type: "installation", installationId, factory })` call with resolve with whatever the factory function returns. The `factory` function will be called with all the strategy option that `auth` was created with, plus the additional options passed to `auth`, besides `type` and `factory`.

For example, you can create a new `auth` instance for an installation which shares the internal state (especially the access token cache) with the calling `auth` instance:

```js
const appAuth = createAppAuth({
  appId: 1,
  privateKey: "-----BEGIN PRIVATE KEY-----\n...",
});

const installationAuth123 = await appAuth({
  type: "installation",
  installationId: 123,
  factory: createAppAuth,
});
```

</td>
    </tr>
    <tr>
      <th>
        <code>refresh</code>
      </th>
      <th>
        <code>boolean</code>
      </th>
      <td>
        Only relevant if <code>type</code> is set to <code>"installation"</code>.<br>
        <br>
        Installation tokens expire after one hour. By default, tokens are cached and returned from cache until expired. To bypass and update a cached token for the given <code>installationId</code>, set <code>refresh</code> to <code>true</code>.<br>
        <br>
        Defaults to <code>false</code>.
      </td>
    </tr>
    <tr>
      <th>
        <code>code</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        Only relevant if <code>type</code> is set to <code>"oauth"</code>.<br>
        <br>
        The authorization <code>code</code> which was passed as query parameter to the callback URL from the <a href="https://docs.github.com/en/developers/apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github">OAuth web application flow</a>.
      </td>
    </tr>
    <tr>
      <th>
        <code>redirectUrl</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        Only relevant if <code>type</code> is set to <code>"oauth"</code>.<br>
        <br>
        The URL in your application where users are sent after authorization. See <a href="https://docs.github.com/en/developers/apps/authorizing-oauth-apps#redirect-urls">redirect urls</a>.
      </td>
    </tr>
    <tr>
      <th>
        <code>state</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        Only relevant if <code>type</code> is set to <code>"oauth"</code>.<br>
        <br>
        The unguessable random string you provided in Step 1 of the <a href="https://docs.github.com/en/developers/apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github">OAuth web application flow</a>.
      </td>
    </tr>
  </tbody>
</table>

## Authentication object

There are three possible results

1. JSON Web Token (JWT) authentication
2. Installation access token authentication
3. OAuth access token authentication

### JSON Web Token (JWT) authentication

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"app"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>token</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The JSON Web Token (JWT) to authenticate as the app.
      </td>
    </tr>
    <tr>
      <th>
        <code>appId</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        GitHub App database ID.
      </td>
    </tr>
    <tr>
      <th>
        <code>expiresAt</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        Timestamp in UTC format, e.g. <code>"2018-07-07T00:09:30.000Z"</code>. A Date object can be created using <code>new Date(authentication.expiresAt)</code>.
      </td>
    </tr>
  </tbody>
</table>

### Installation access token authentication

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"token"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>token</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The installation access token.
      </td>
    </tr>
    <tr>
      <th>
        <code>tokenType</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"installation"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>installationId</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        Installation database ID.
      </td>
    </tr>
    <tr>
      <th>
        <code>createdAt</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        Timestamp in UTC format, e.g. <code>"2018-07-07T00:00:00.000Z"</code>. A Date object can be created using <code>new Date(authentication.expiresAt)</code>.
      </td>
    </tr>
    <tr>
      <th>
        <code>expiresAt</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        Timestamp in UTC format, e.g. <code>"2018-07-07T00:59:00.000Z"</code>. A Date object can be created using <code>new Date(authentication.expiresAt)</code>.
      </td>
    </tr>
    <tr>
      <th>
        <code>repositoryIds</code>
      </th>
      <th>
        <code>array of numbers</code>
      </th>
      <td>
        Only present if <code>repositoryIds</code> option passed to <code>auth(options)</code>.
      </td>
    </tr>
    <tr>
      <th>
        <code>permissions</code>
      </th>
      <th>
        <code>object</code>
      </th>
      <td>
        An object where keys are the permission name and the value is either <code>"read"</code> or <code>"write"</code>. See the list of all <a href="https://docs.github.com/en/rest/reference/permissions-required-for-github-apps">GitHub App Permissions</a>.
      </td>
    </tr>
    <tr>
      <th>
        <code>singleFileName</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        If the <a herf="https://docs.github.com/en/rest/reference/permissions-required-for-github-apps#permission-on-single-file">single file permission</a> is enabled, the <code>singleFileName</code> property is set to the path of the accessible file.
      </td>
    </tr>
  </tbody>
</table>

### OAuth access token authentication

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>type</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"token"</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>token</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        The personal access token
      </td>
    </tr>
    <tr>
      <th>
        <code>tokenType</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <code>"oauth"</code>
      </td>
    </tr>
  </tbody>
</table>

## `auth.hook(request, route, parameters)` or `auth.hook(request, options)`

`auth.hook()` hooks directly into the request life cycle. It amends the request to authenticate either as app or as installation based on the request URL. Although the `"machine-man"` preview has graduated to the official API, https://developer.github.com/changes/2020-08-20-graduate-machine-man-and-sailor-v-previews/, it is still required in versions of GitHub Enterprise up to 2.21 so it automatically sets the `"machine-man"` preview for all endpoints requiring JWT authentication.

The `request` option is an instance of [`@octokit/request`](https://github.com/octokit/request.js#readme). The arguments are the same as for the [`request()` method](https://github.com/octokit/request.js#request).

`auth.hook()` can be called directly to send an authenticated request

```js
const { data: installations } = await auth.hook(
  request,
  "GET /app/installations"
);
```

Or it can be passed as option to [`request()`](https://github.com/octokit/request.js#request).

```js
const requestWithAuth = request.defaults({
  request: {
    hook: auth.hook,
  },
});

const { data: installations } = await requestWithAuth("GET /app/installations");
```

Note that `auth.hook()` does not create and set an OAuth authentication token. But you can use [`@octokit/auth-oauth-app`](https://github.com/octokit/auth-oauth-app.js#readme) for that functionality. And if you don't plan on sending requests to routes that require authentication with `client_id` and `client_secret`, you can just retrieve the token and then create a new instance of [`request()`](https://github.com/octokit/request.js#request) with the authentication header set:

```js
const { token } = await auth({
  type: "oauth",
  code: "123456",
});
const requestWithAuth = request.defaults({
  headers: {
    authentication: `token ${token}`,
  },
});
```

## Implementation details

When creating a JSON Web Token, it sets the "issued at time" (iat) to 30s in the past as we have seen people running situations where the GitHub API claimed the iat would be in future. It turned out the clocks on the different machine were not in sync.

Installation access tokens are valid for 60 minutes. This library invalidates them after 59 minutes to account for request delays.

## License

[MIT](LICENSE)
