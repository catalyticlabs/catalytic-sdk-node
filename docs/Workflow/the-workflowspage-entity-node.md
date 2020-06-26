The `WorkflowsPage` class represents a page of `Workflow`s, usually returned from the [`workflows.find()`](doc:find-workflows-node) method.

# Instance Properties

| Name            | Type     | Description                                                                    |
| --------------- | -------- | ------------------------------------------------------------------------------ |
| `workflows`         | `Workflow[]` | The Workflows included in this page of results                                     |
| `nextPageToken` | `string` | The `pageToken` to use for fetching the next page of items from `workflows.find()` |
| `count`         | `number` | The number of Workflows returned                                                   |
