The `IntegrationsPage` class represents a page of `Integration`s, usually returned from the [`integrations.find()`](doc:find-integrations-node) method.

# Instance Properties

| Name            | Type            | Description                                                                           |
| --------------- | --------------- | ------------------------------------------------------------------------------------- |
| `integrations`  | `Integration[]` | The Integrations included in this page of results                                     |
| `nextPageToken` | `string`        | The `pageToken` to use for fetching the next page of items from `integrations.find()` |
| `count`         | `number`        | The number of Integrations returned                                                   |
