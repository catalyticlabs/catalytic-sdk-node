The `InstanceStepsPage` class represents a page of `InstanceStep`s, usually returned from the [`instances.findInstanceSteps()`](doc:find-instance-steps-node) method.

# InstanceStep Properties

| Name            | Type             | Description                                                                                     |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| `instanceSteps` | `InstanceStep[]` | The InstanceSteps included in this page of results                                              |
| `nextPageToken` | `string`         | The `pageToken` to use for fetching the next page of items from `instances.findInstanceSteps()` |
| `count`         | `number`         | The number of InstanceSteps returned                                                            |
