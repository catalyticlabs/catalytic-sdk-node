# The Find Method

Finds Users matching your criteria. The `Users.Find` method supports a fluent style where you can chain together your search criteria.

## Method Signature

```typescript
find(): Promise<UsersPage>;
find(options: FindUsersOptions): Promise<UsersPage>;
find(callback: (err?: Error, usersPage: UsersPage) => any): void;
find(options: FindUsersOptions, callback: (err?: Error, usersPage: UsersPage) => any): void;
```

| Parameter           | Type                                         | Description                                                                                        | Default |
| ------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| `options`           | `FindUsersOptions`                           | _Optional_ The paging options filter criteria to search by, or null to fetch all Users.            |         |
| `options.query`     | `string`                                     | _Optional_ A query string to search by. Applies to the `name` property of Users                    |         |
| `options.pageSize`  | `number`                                     | _Optional_ The number of Users to fetch in a single `UsersPage` response                           | `25`    |
| `options.pageToken` | `string`                                     | _Optional_ The `nextPageToken` of a previous `find` request, used to fetch the next set of results |         |
| `callback`          | `(err?: Error, usersPage: UsersPage) => any` | _Optional_ The callback                                                                            |         |
| _returns_           | [`UsersPage`](doc:the-userspage-entity-node) | The requested page of Users                                                                        |         |

## Example

```js
/*
 * This example demonstrates listing all users
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const users = [];

const options = { pageSize: 25 };
let hasNextPage = true;

while (hasNextPage) {
    const usersPage = await catalytic.users.find(options);
    users.push(...usersPage.users);
    if (usersPage.nextPageToken) {
        options.pageToken = usersPage.nextPageToken;
    } else {
        hasNextPage = false;
    }
}

users.forEach(user => {
    console.log(user.email);
});
```
