Access Tokens allow a developer to authenticate SDK requests on behalf of a specific Catalytic user. Each Access Token must be approved by the user on whose behalf it grants access. That approval can be done either explicitly by logging in to the Catalytic Web App and approving a specific Access Token request, or by supplying their email and password when creating a new Access Token.

For more details on creating [`Access Tokens`](doc:the-access-token-entity-node) or how [`Access Tokens`](doc:the-access-token-entity-node) are used to authenticate in the SDK, please see the preceding [Authentication](doc:authentication-node) section.

# Methods

The `accessTokens` client provides the following methods:

| Method                                                                                              | Description                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`get`](doc:get-an-access-token-node)                                                               | Gets a specific Access Token by ID                                                                                                                                                                |
| [`find`](doc:find-access-tokens-node)                                                               | Fetch all of your Access Tokens                                                                                                                                                                   |
| [`create`](doc:create-an-access-token-node#section-the-create-method)                               | Creates a new Access Token with your email and password<br>_Not supported for teams with SSO enabled_                                                                                             |
| [`createWithWebApprovalFlow`](doc:create-an-access-token-node#the-createwithwebapprovalflow-method) | Creates a new Access Token to be approved via the Account page in<br> the Catalytic Web App<br>_Supported for all teams with or without SSO_                                                      |
| [`waitForApproval`](doc:create-an-access-token-node#the-waitforapproval-method)                     | Waits for an Access Token created with [`createWithWebApprovalFlow`](doc:create-an-access-token-node#the-createwithwebapprovalflow-method) <br>to be approved in the Catalytic Web App            |
| [`getApprovalUrl`](doc:create-an-access-token-node#the-getapprovalurl-method)                       | Gets the URL that the user should be directed to to approve the <br>Access Token created with [`createWithWebApprovalFlow`](doc:create-an-access-token-node#the-createwithwebapprovalflow-method) |
| [`openUrl`](doc:access-tokens-node#section-the-open-url-method)                                     | A helper method for desktop apps to open the token approval URL<br> that works across Windows, OSX and Linux                                                                                      |
| [`revoke`](doc:create-an-access-token-node#the-openurl-method)                                      | Revokes an Access Token so it can no longer be used                                                                                                                                               |

# Quickstart Example

```js
/*
 * This example demonstrates creating a new Access Token using your
 * email and password
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const accessToken = await catalytic.accessTokens.create('your-team', 'your-email', 'your-password', 'your-token-name');

catalytic.setAccessToken(accessToken);
```
