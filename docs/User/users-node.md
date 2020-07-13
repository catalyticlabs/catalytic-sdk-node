The `users` client allows you to access your Users on your Catalytic team.

# Methods

| Method                        | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| [`get`](doc:get-a-user-node)  | Gets a specific User by `id`, `email` or `username` |
| [`find`](doc:find-users-node) | Search for Users by `name`, or get all users.       |

# Quickstart Example

```js
/*
 * This example demonstrates listing all users
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

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

users.forEach((user) => {
    console.log(user.email);
});
```
