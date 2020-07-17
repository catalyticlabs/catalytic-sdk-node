There are several ways to create a new Access Token for use with the SDK, including via the [CLI Login Commands](doc:login-commands) or via the web app, which is covered in detail in the [Authentication](doc:authentication-node) section. Below are methods for creating new Access Tokens from within the SDK either using your username and password, or following an SSO web approval flow.

# The `create` Method

Create a new Access Token using your email and password. Be sure to save the returned Access Token either by calling `accessToken.saveToFile()` or by saving `accessToken.token` to a custom storage system.

> 🚧 Not Supported with SSO
>
> If your team is configured with SSO, you will not have a password for Catalytic and therefore cannot use this method to create Access Tokens. Instead, use the [`createWithWebApprovalFlow`](doc:create-an-access-token-node#section-the-create-with-web-approval-flow-method) method, or create a new Access Token in the Catalytic Web App and copy or download it to use in your app. See [Authentication](doc:authentication-node) for details.

## Method Signature

```typescript
create(teamName: string, email: string, password: string): Promise<AccessToken>;
create(teamName: string, email: string, password: string, accessTokenName: string): Promise<AccessToken>;
create(teamName: string, email: string, password: string, callback: (err?: Error, accessToken: AccessToken) => any): void;
create(teamName: string, email: string, password: string, accessTokenName: string, callback: (err?: Error, accessToken: AccessToken) => any): void;
```

| Parameter         | Type                                              | Description                                                                                                                                  |
| ----------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `teamName`        | `string`                                          | The name or hostname of your Catalytic team. This will be<br>`<your-team-name>` if you sign into Catalytic at `<your-team-name>.pushbot.com` |
| `email`           | `string`                                          | The email address you use to log in to Catalytic                                                                                             |
| `password`        | `string`                                          | The password you use to log in to Catalytic                                                                                                  |
| `accessTokenName` | `string`                                          | _Optional_ The name to apply to the new Access Token, which will be visible when managing your Access Tokens via the Catalytic Web App       |
| `callback`        | `(err?: Error, accessToken: AccessToken) => any`  | _Optional_ The callback                                                                                                                      |
| _returns_         | [`AccessToken`](doc:the-access-token-entity-node) | The new Access Token                                                                                                                         |

## Example

```js
/*
 * This example demonstrates creating a new Access Token using your
 * email and password
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const accessToken = await catalytic.accessTokens.create('your-team', 'your-email', 'your-password', 'your-token-name');

accessToken.saveToFile('default');
```

# The `createWithWebApprovalFlow` Method

Create a new Access Token and approve it by logging into your Catalytic account. See [Authentication](doc:authentication-node#section-create-new-credentials-using-the-web-approval-flow) for details.

> 👍 Supported for SSO teams
>
> This method works for all teams, including those with SSO enabled

## Method Signature

```typescript
createWithWebApprovalFlow(teamName: string): Promise<AccessToken>;
createWithWebApprovalFlow(teamName: string, accessTokenName: string): Promise<AccessToken>;
createWithWebApprovalFlow(teamName: string, callback: (err?: Error, accessToken: AccessToken) => any): void;
createWithWebApprovalFlow(teamName: string, accessTokenName: string, callback: (err?: Error, accessToken: AccessToken) => any): void;
```

| Parameter         | Type                                              | Description                                                                                                                                  |
| ----------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `teamName`        | `string`                                          | The name or hostname of your Catalytic team. This will be<br>`<your-team-name>` if you sign into Catalytic at `<your-team-name>.pushbot.com` |
| `accessTokenName` | `string`                                          | _Optional_ The name to apply to the new Access Token, which will be visible when managing your Access Tokens via the Catalytic Web App       |
| `callback`        | `(err?: Error, accessToken: AccessToken) => any`  | _Optional_ The callback                                                                                                                      |
| _returns_         | [`AccessToken`](doc:the-access-token-entity-node) | The new Access Token, initially in the _unapproved_ state.                                                                                   |

## Example

```js
/*
 * This example demonstrates creating a new Access Token using the
 * web approval flow
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

// Create an Access Token that requires approval via the Catalytic UI
const accessToken = await catalytic.accessTokens.createWithWebApprovalFlow('your-team');

// Generate approval url and open in the OS's default browser
const approvalUrl = catalytic.accessTokens.getApprovalUrl(accessToken);
catalytic.accessTokens.openUrl(approvalUrl);

// Wait for token to be approved via Catalytic UI
await catalytic.accessTokens.waitForApproval(accessToken);

// Set AccessToken for use on the constructed `catalytic` client
catalytic.setAccessToken(accessToken);
accessToken.saveToFile('default');

// You are now authenticated and ready to use the Catalytic SDK
// The above only needs to be done once. Now that your Access Token
// is saved as the default Access Token, any new instances of CatalyticClient
// on this machine will use that Access Token
```

# The `getApprovalUrl` Method

Gets the URL that the user must visit to approve Access Token created with `createWithWebApprovalFlow`.

## Method Signature

```typescript
getApprovalUrl(accessToken: AccessToken, applicationName?: string): string;
```

| Parameter         | Type          | Description                                                                                |
| ----------------- | ------------- | ------------------------------------------------------------------------------------------ |
| `accessToken`     | `AccessToken` | The Access Token returned from `createWithWebApprovalFlow()`                               |
| `applicationName` | `string`      | _Optional_ The name of the application requesting the token. Defaults to `"Catalytic SDK"` |
| _returns_         | `Uri`         | The URL to direct the user to to approve the new token                                     |

## Example

See the above [`getApprovalUrl` Example](#example-1)

# The `openUrl` Method

Opens a URL returned from `getApprovalUrl` in the OS's default browser. Currently supported OS's are OSX, Windows and Linux.

## Method Signature

```typescript
openUrl(url: string): void;
```

## Example

See the above [`openUrl` Example](#example-1)

# The `waitForApproval` Method

Wait for an Access Token created with `createWithWebApprovalFlow` to be approved by the user in the Catalytic Web App. This method will complete as soon as the user logs in to their Catalytic team and approves the Access Token request. Be sure to save the returned Access Token either by calling [`accessToken.saveToFile()`](doc:the-access-token-entity-node#section-savetofile) or by saving `accessToken.token` to a custom storage system.

## Method Signature

```typescript
waitForApproval(accessToken: AccessToken): Promise<void>;
waitForApproval(accessToken: AccessToken, waitTimeMillis: number): Promise<void>;
waitForApproval(accessToken: AccessToken, callback: ClientMethodCallback<void>): void;
waitForApproval(accessToken: AccessToken, waitTimeMillis: number, callback: ClientMethodCallback<void>): void;
```

| Parameter        | Type                                              | Description                                                  |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `accessToken`    | `AccessToken`                                     | The Access Token returned from `createWithWebApprovalFlow()` |
| `waitTimeMillis` | `number`                                          | _Optional_ number of milliseconds to wait before timing out  |
| `callback`       | `(err?: Error) => any`                            | _Optional_ The callback                                      |
| _returns_        | [`AccessToken`](doc:the-access-token-entity-node) | The approved Access Token                                    |

## Example

See the above [`waitForApproval` Example](#example-1)
