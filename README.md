# auth-app.js

> GitHub App authentication for JavaScript

[![@latest](https://img.shields.io/npm/v/@octokit/auth-app.svg)](https://www.npmjs.com/package/@octokit/auth-app)
[![Build Status](https://travis-ci.com/octokit/auth-app.js.svg?branch=master)](https://travis-ci.com/octokit/auth-app.js)
[![Greenkeeper](https://badges.greenkeeper.io/octokit/auth-app.js.svg)](https://greenkeeper.io/)

`@octokit/auth-app` implements one of [GitHub’s authentication strategies](https://github.com/octokit/auth.js).

It implements authentication using a [JSON Web Token](https://jwt.io/) for apps as well as installation access tokens.

### Usage

```js
import { request } from "@octokit/request";
import { createAppAuth } from "@octokit/auth-app";

const auth = createAppAuth({
  id: 1,
  privateKey: "-----BEGIN RSA PRIVATE KEY-----\n..."
});

(async () => {
  // Retrieve JSON Web Token (JWT) to authenticate as app
  const appAuthentication = await auth();
  const { data: appDetails } = await request("GET /app", {
    headers: appAuthentication.headers,
    previews: ["machine-man"]
  });

  // Retrieve installation access token
  const installationAuthentication = await auth({ installationId: 123 });
  const { data: repositories } = await request(
    "GET /installation/repositories",
    {
      headers: installationAuthentication.headers,
      previews: ["machine-man"]
    }
  );

  // Retrieve JSON Web Token (JWT) or installation access token based on request url
  const authentication = await auth({
    installationId: 123,
    url: "/installation/repositories"
  });
  const { data: repositories } = await request(
    "GET /installation/repositories",
    {
      headers: authentication.headers,
      previews: ["machine-man"]
    }
  );
})();
```

### Strategy options

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
        <code>options.request</code>
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
        <code>options.cache</code>
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
    get(key) {
      return CACHE[key];
    },
    set(key, value) {
      CACHE[key] = value;
    }
  }
});
```

</td></tr>
  </tbody>
</table>

### Auth options

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
        <code>installationId</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        <strong>Required if <code>url</code>, <code>repositoryIds</code> or <code>permissions</code> passed</strong>. ID of installation to retrieve authentication for.
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
        <code>premissions</code>
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
        <code>url</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        An absolute URL or endpoint route path. Examples:
        <ul>
          <li><code>"https://enterprise.github.com/api/v3/app"</code></li>
          <li><code>"/app/installations/123"</code></li>
          <li><code>"/app/installations/:installation_id"</code></li>
        </ul>
        Depending on the <code>url</code>, the resulting authentication object is either a JWT or an installation token.
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

### Authentication object

There are two possible results

1. **JSON Web Token (JWT) authentication**  
   ❌ `installationId` was _not_ passed to `auth()`  
   ✅ `url` passed to `auth()` matches an endpoint that requires JWT authentication.
2. **Installation access token authentication**  
   ✅ `installationId` passed to `auth()`  
   ❌ `url` passed to `auth()` does not match an endpoint that requires JWT authentication.

#### JSON Web Token (JWT) authentication

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
        <code>expiration</code>
      </th>
      <th>
        <code>number</code>
      </th>
      <td>
        Number of seconds from 1970-01-01T00:00:00Z UTC. A Date object can be created using <code>new Date(authentication.expiration * 1000)</code>.
      </td>
    </tr>
    <tr>
      <th>
        <code>headers</code>
      </th>
      <th>
        <code>object</code>
      </th>
      <td>
        <code>{ authorization }</code> - value for the "Authorization" header.
      </td>
    </tr>
    <tr>
      <th>
        <code>query</code>
      </th>
      <th>
        <code>object</code>
      </th>
      <td>
        <code>{}</code> - not used
      </td>
    </tr>
  </tbody>
</table>

#### Installation access token authentication

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
        Timestamp in UTC format, e.g. <code>2019-06-11T22:22:34Z</code>.
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
        <code>headers</code>
      </th>
      <th>
        <code>object</code>
      </th>
      <td>
        <code>{ authorization }</code> - value for the "Authorization" header.
      </td>
    </tr>
    <tr>
      <th>
        <code>query</code>
      </th>
      <th>
        <code>object</code>
      </th>
      <td>
        <code>{}</code> - not used
      </td>
    </tr>
  </tbody>
</table>

## License

[MIT](LICENSE)
