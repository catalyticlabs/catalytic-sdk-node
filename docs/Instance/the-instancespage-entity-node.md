The `InstancesPage` class represents a page of `Instance`s, usually returned from the [`instances.find()`](doc:find-instances-node) method.

# Instance Properties

| Name            | Type         | Description                                                                        |
| --------------- | ------------ | ---------------------------------------------------------------------------------- |
| `instances`     | `Instance[]` | The Instances included in this page of results                                     |
| `nextPageToken` | `string`     | The `pageToken` to use for fetching the next page of items from `instances.find()` |
| `count`         | `number`     | The number of Instances returned                                                   |
