# The Get Method

Gets a User by ID, Email or Username.

## Method Signature

```js
get(id: string): Promise<User>;
get(id: string, callback: (err?: Error, user: User) => any): void;

```

| Parameter  | Type                               | Description                                   |
| ---------- | ---------------------------------- | --------------------------------------------- |
| `id`       | `string`                           | The id, email, or username of the User to get |
| `callback` | `(err?: Error, user: User) => any` | _Optional_ The callback                                  |
| _returns_  | [`User`](doc:the-user-entity-node) | The requested User                            |

## Example

```js
/*
 * This example demonstrates getting a User by Email
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const alice = await catalytic.users.get('alice@example.com');
```
