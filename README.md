# auth-app.js

> GitHub App authentication for JavaScript

[![@latest](https://img.shields.io/npm/v/@octokit/auth-app.svg)](https://www.npmjs.com/package/@octokit/auth-app)
[![Build Status](https://travis-ci.com/octokit/auth-app.js.svg?branch=master)](https://travis-ci.com/octokit/auth-app.js)
[![Greenkeeper](https://badges.greenkeeper.io/octokit/auth-app.js.svg)](https://greenkeeper.io/)

`@octokit/auth-app` implements authetication for GitHub Apps using [JSON Web Token](https://jwt.io/) and installation access tokens.

For other GitHub authentication strategies see [octokit/auth.js](https://github.com/octokit/auth.js).

<!-- toc -->

- [Usage](#usage)
- [`createAppAuth(options)`](#createappauthoptions)
- [`auth(options)`](#authoptions)
- [Authentication object](#authentication-object)
  - [JSON Web Token (JWT) authentication](#json-web-token-jwt-authentication)
  - [Installation access token authentication](#installation-access-token-authentication)
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

Not yet supported, see [#6](https://github.com/octokit/auth-app.js/issues/6).

</td></tr>
<tr><th>
Node
</th><td>

Install with <code>npm install @octokit/auth-oauth-app</code>

```js
const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");
// or: import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
```

</td></tr>
</tbody>
</table>

```js
const auth = createAppAuth({
  id: 1,
  privateKey: "-----BEGIN RSA PRIVATE KEY-----\n...",
  installationId: 123
});

// Retrieve JSON Web Token (JWT) to authenticate as app
const appAuthentication = await auth({ type: "app" });
// resolves with
// {
//   type: 'app',
//   token: 'jsonwebtoken123',
//   appId: 123,
//   expiration: 1564115676
// }

// Retrieve installation access token
const installationAuthentication = await auth({ type: "installation" });
// resolves with
// {
//   type: 'token',
//   tokenType: 'installation',
//   token: 'token123',
//   installationId: 123,
//   expiresAt: '2019-06-11T22:22:34Z'
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
        <code>id</code>
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
  clientId: 123,
  clientSecret: "secret",
  request: request.defaults({
    baseUrl: "https://ghe.my-company.com/api/v3"
  })
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
  clientId: 123,
  clientSecret: "secret",
  cache: {
    async get(key) {
      return CACHE[key];
    },
    async set(key, value) {
      CACHE[key] = value;
    }
  }
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
        <strong>Required</strong>. Must be either <code>"app"</code> or <code>"installation"</code>.
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
        <strong>Required unless a default <code>installationId</code> was passed to <code>createAppAuth()</code></strong>. ID of installation to retrieve authentication for.
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
        The permissions granted to the access token. The permissions object includes the permission names and their access type. For a complete list of permissions and allowable values, see <a href="https://developer.github.com/apps/building-github-apps/creating-github-apps-using-url-parameters/#github-app-permissions">GitHub App permissions</a>.
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
        Installation tokens expire after one hour. By default, tokens are cached and returned from cache until expired. To bypass and update a cached token for the given <code>installationId</code>, set <code>refresh</code> to <code>true</code>.<br>
        <br>
        Defaults to <code>false</code>.
      </td>
    </tr>
  </tbody>
</table>

## Authentication object

There are two possible results

1. JSON Web Token (JWT) authentication
2. Installation access token authentication

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
        Timestamp in UTC format, e.g. <code>"2019-06-11T22:22:34Z"</code>. A Date object can be created using <code>new Date(authentication.expiresAt)</code>.
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
        <code>expiresAt</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        Timestamp in UTC format, e.g. <code>"2019-06-11T22:22:34Z"</code>. A Date object can be created using <code>new Date(authentication.expiresAt)</code>.
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
        An object where keys are the permission name and the value is either <code>"read"</code> or <code>"write"</code>. See the list of all <a href="https://developer.github.com/v3/apps/permissions/">GitHub App Permissions</a>.
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
        If the <a herf="https://developer.github.com/v3/apps/permissions/#permission-on-single-file">single file permission</a> is enabled, the <code>singleFileName</code> property is set to the path of the accessible file.
      </td>
    </tr>
  </tbody>
</table>

## `auth.hook(request, route, parameters)` or `auth.hook(request, options)`

`auth.hook()` hooks directly into the request life cycle. It amends the request to authenticate using the correct authentication method based on the request URL. It also automatically sets the `"machine-man"` preview which is currently required for all endpoints requiring JWT authentication.

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
    hook: auth.hook
  }
});

const { data: installations } = await requestWithAuth("GET /app/installations");
```

## Implementation details

When creating a JSON Web Token, it sets the "issued at time" (iat) to 30s in the past as we have seen people running situations where the GitHub API claimed the iat would be in future. It turned out the clocks on the different machine were not in sync.

Installation access tokens are valid for 60 minutes. This library invalidates them after 59 minutes to account for request delays.

## License

[MIT](LICENSE)
