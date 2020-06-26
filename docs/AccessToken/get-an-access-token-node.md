# The Get Method

Get a specific Access Token by ID. Note that the returned Access Token will include other metadata but will **not** include the serialized token string, and therefore cannot be used to authenticate SDK requests. The serialized token string is only available when you first create a new Access Token. As a security measure, only a hash of the serialized token is stored.

> 👍 Permissions Required
>
> You can only get metadata for Access Tokens that you created, unless you are a team administrator. Team admins can get metadata for all Access Tokens on your Catalytic team.

## Method Signature

```typescript
get(id: string): Promise<AccessToken>;
get(id: string, callback: (err?: Error, accessToken: AccessToken) => any): void;
```

| Parameter  | Type                                                       | Description                       |
| ---------- | ---------------------------------------------------------- | --------------------------------- |
| `id`       | `string`                                                   | The id of the Access Token to get |
| `callback` | `(err?: Error, accessToken: AccessToken) => any`           | The callback                      |
| _returns_  | [`Promise<AccessToken>`](doc:the-access-token-entity-node) | The requested Access Token        |

## Example

```js
/*
 * This example demonstrates getting an Access Token by ID
 */

const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

// Accesses the `id` of the AccessToken constructed from 'YOUR_SERIALIZED_ACCESS_TOKEN_STRING'
const accessTokenID = catalytic.accessToken.id;

// `accessTokenMetaDataOnly` will be the same as
const accessTokenMetaDataOnly = await catalytic.accessTokens.get(accessTokenID);
```
