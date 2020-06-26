The `UsersPage` class represents a page of `User`s, usually returned from the [`users.find()`](doc:find-users-node) method.

# Instance Properties

| Name            | Type     | Description                                                                    |
| --------------- | -------- | ------------------------------------------------------------------------------ |
| `users`         | `User[]` | The Users included in this page of results                                     |
| `nextPageToken` | `string` | The `pageToken` to use for fetching the next page of items from `users.find()` |
| `count`         | `number` | The number of Users returned                                                   |
