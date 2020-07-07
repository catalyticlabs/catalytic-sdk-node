# The Find Method

Finds Users matching your criteria. The `Users.Find` method supports a fluent style where you can chain together your search criteria.

## Method Signature

```typescript
find(): Promise<UsersPage>;
find(options: FindUserOptions): Promise<UsersPage>;
find(callback: (err?: Error, usersPage: UsersPage) => any): void;
find(options: FindUserOptions, callback: (err?: Error, usersPage: UsersPage) => any): void;
```

| Parameter           | Type                                         | Description                                                                             | Default |
| ------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------- | ------- |
| `options`           | `object`                                     | The paging options filter criteria to search by, or null to fetch all Users.            |         |
| `options.query`     | `string`                                     | A query string to search by. Applies to the `name` property of Users                    |         |
| `options.pageSize`  | `number`                                     | The number of Users to fetch in a single `UsersPage` response                           | `25`    |
| `options.pageToken` | `string`                                     | The `nextPageToken` of a previous `find` request, used to fetch the next set of results |         |
| `callback`          | `(err?: Error, usersPage: UsersPage) => any` | The callback                                                                            |         |
| _returns_           | [`UsersPage`](doc:the-userspage-entity-node) | The requested page of Users                                                             |         |

You can search for matches among the following attributes of the `Where` class.

| Name      | Type                                         | Description                        |
| --------- | -------------------------------------------- | ---------------------------------- |
| `Text`    | `string`                                     | Match against the user's Full Name |
| _returns_ | [`UsersPage`](doc:the-userspage-entity-node) | The requested page of Users        |

## Example

```js
/*
 * This example demonstrates listing all users
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const users = [];

let paging = { pageSize: 25 };

while (paging) {
    const usersPage = await catalytic.users.find(paging);
    users.push(...usersPage.users);
    if (usersPage.nextPageToken) {
        paging.pageToken = usersPage.nextPageToken;
    } else {
        paging = null;
    }
}

users.forEach(user => {
    console.log(user.email);
});
```
