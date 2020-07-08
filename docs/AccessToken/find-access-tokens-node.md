# The Find Method

Search for Access Tokens matching a given name or owner, or page through all of your Access Tokens. Note that the returned Access Tokens will include other metadata but will **not** include the serialized token string, and therefore cannot be used to authenticate SDK requests. The serialized token string is only available when you first create a new Access Token. As a security measure, only a hash of the serialized token is stored.

> 👍 Permissions Required
>
> You can only get metadata for Access Tokens that you created, unless you are a team administrator. Team admins can get metadata for all Access Tokens on your Catalytic team.

## Method Signature

```typescript
find(): Promise<AccessTokensPage>;
find(options: FindAccessTokensOptions): Promise<AccessTokensPage>;
find(callback: (err?: Error, accessToken: AccessTokensPage) => any): void;
find(options: FindAccessTokensOptions, callback: (err?: Error, accessToken: AccessTokensPage) => any): void;
```

| Parameter           | Type                                                                | Description                                                                                         | Default |
| ------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `options`           | `object`                                                            | _Optional_ The paging options and filter criteria to search by, or null to fetch all Access Tokens. |         |
| `options.owner`     | `PagingOptions`                                                     | _Optional_ The email, username, or ID of the user whose Access Tokens should be fetched.            |         |
| `options.query`     | `string`                                                            | _Optional_ A query string to search by. Applies to the `name` property of Access Tokens             |         |
| `options.pageSize`  | `number`                                                            | _Optional_ The number of Access Tokens to fetch in a single `AccessTokensPage` response             | `25`    |
| `options.pageToken` | `string`                                                            | _Optional_ The `nextPageToken` of a previous `find` request, used to fetch the next set of results  |         |
| `callback`          | `(err?: Error, accessToken: AccessToken) => any`                    | _Optional_ The callback                                                                             |         |
| _returns_           | [`Promise<AccessTokensPage>`](doc:the-accesstokenspage-entity-node) | The requested page of Access Tokens                                                                 |         |

## Example

```js
/*
 * This example demonstrates an administrator finding and revoking
 * all the Access Tokens of another user.
 */

const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

let options = { pageSize: 25 };

while (options) {
    const accessTokensPage = await catalytic.accessTokens.find(options);
    accessTokens.push(...accessTokensPage.accessTokens);
    if (accessTokensPage.nextPageToken) {
        options.pageToken = accessTokensPage.nextPageToken;
    } else {
        options = null;
    }
}

accessTokens.forEach((accessToken) => {
    await catalytic.accessTokens.revoke(accessToken.id);
});
```
