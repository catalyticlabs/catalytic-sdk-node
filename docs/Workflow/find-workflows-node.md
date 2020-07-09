# The Find Method

Finds Workflows that match your criteria. The `Workflows.Find` method supports a fluent style where you can chain together your search criteria.

> 👍 Permissions Required
>
> Matching Workflows will only be included in the results if you have Find permissions to that Workflow. Workflows that you do not have permissions to will be excluded from the results.

## Method Signature

```typescript
find(): Promise<WorkflowsPage>;
find(options: FindWorkflowOptions): Promise<WorkflowsPage>;
find(callback: (err?: Error, workflowsPage: WorkflowsPage) => any): void;
find(options: FindWorkflowOptions, callback: (err?: Error, workflowsPage: WorkflowsPage) => any): void;
```

| Parameter           | Type                                                 | Description                                                                                                                                                | Default |
| ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `options`           | `FindWorkflowOptions`                                | _Optional_ The options options filter criteria to search by, or null to fetch all Workflows.                                                               |         |
| `options.owner`     | `string`                                             | _Optional_ Search for Workflows owned by a specific team member. The email <br>address of the owner of the Workflow must match exactly, apart from casing. |         |
| `options.category`  | `string`                                             | _Optional_ Search for Workflows in a specific category                                                                                                     |         |
| `options.query`     | `string`                                             | _Optional_ A query string to search by. Applies to the `name` and `description`<br>properties of Workflows                                                 |         |
| `options.pageSize`  | `number`                                             | _Optional_ The number of Workflows to fetch in a single `WorkflowsPage` response                                                                           | `25`    |
| `options.pageToken` | `string`                                             | _Optional_ The `nextPageToken` of a previous `find` request, used to fetch the next set of results                                                         |         |
| `callback`          | `(err?: Error, workflowsPage: WorkflowsPage) => any` | _Optional_ The callback                                                                                                                                    |         |
| _returns_           | [`WorkflowsPage`](doc:the-workflowspage-entity-node) | The requested page of Workflows                                                                                                                            |         |

## Example

```js
/*
 * This example demonstrates listing all workflows
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const workflows = [];

const options = { pageSize: 25 };
let hasNextPage = true;

while (hasNextPage) {
    const workflowsPage = await catalytic.workflows.find(options);
    workflows.push(...workflowsPage.workflows);
    if (workflowsPage.nextPageToken) {
        options.pageToken = workflowsPage.nextPageToken;
    } else {
        hasNextPage = false;
    }
}

workflows.forEach(workflow => {
    console.log(workflow.name);
});
```
