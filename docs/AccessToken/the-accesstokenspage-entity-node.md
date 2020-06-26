The `AccessTokensPage` class represents a page of `AccessToken`s, usually returned from the [`accessTokens.find()`](doc:find-access-tokens-node) method.

# Instance Properties

| Name            | Type            | Description                                                                           |
| --------------- | --------------- | ------------------------------------------------------------------------------------- |
| `accessTokens`  | `AccessToken[]` | The AccessTokens included in this page of results                                     |
| `nextPageToken` | `string`        | The `pageToken` to use for fetching the next page of items from `accessTokens.find()` |
| `count`         | `number`        | The number of AccessTokens returned                                                   |
