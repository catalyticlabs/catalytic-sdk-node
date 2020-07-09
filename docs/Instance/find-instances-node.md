# The Find Method

Finds Instances matching your criteria.

> 👍 Permissions Required
>
> Matching Instances will only be included in the results if you have Find permissions to that Instance. Instances that you do not have permissions to will be excluded from the results.

## Method Signature

```typescript
find(): Promise<InstancesPage>;
find(options: FindInstancesOptions): Promise<InstancesPage>;
find(callback: ClientMethodCallback<InstancesPage>): void;
find(options: FindInstancesOptions, callback: ClientMethodCallback<InstancesPage>): void;
```

| Parameter            | Type                                                 | Description                                                                                                                                                | Default |
| -------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `options`            | `FindInstancesOptions`                               | _Optional_ The options options filter criteria to search by, or null to fetch all Instances.                                                               |         |
| `options.owner`      | `string`                                             | _Optional_ Search for Instances owned by a specific team member. The email <br>address of the owner of the Instance must match exactly, apart from casing. |         |
| `options.status`     | `string`                                             | _Optional_ Find Instances with a specific status (`running`, `completed`, or `cancelled` )                                                                 |         |
| `options.workflowID` | `string`                                             | _Optional_ Find Instances of a specific Workflow                                                                                                           |         |
| `options.query`      | `string`                                             | _Optional_ A query string to search by. Applies to the `name` and `description`<br>properties of Instances                                                 |         |
| `options.pageSize`   | `number`                                             | _Optional_ The number of Instances to fetch in a single `InstancesPage` response                                                                           | `25`    |
| `options.pageToken`  | `string`                                             | _Optional_ The `nextPageToken` of a previous `find` request, used to fetch the next set of results                                                         |         |
| `callback`           | `(err?: Error, instancesPage: InstancesPage) => any` | _Optional_ The callback                                                                                                                                    |         |
| _returns_            | [`InstancesPage`](doc:the-instancespage-entity-node) | The requested page of Instances                                                                                                                            |         |

## Example

```js
/*
 * This example demonstrates finding all Instances of a specific
 * Workflow owned by a particular user that are still running.
 * This also demonstrates paging through results to collect all
 * matches into a single list.
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const instances = [];

const options = {
    pageSize: 25,
    workflowID: 'c9f2beec-10c0-4f2f-b4e0-1d884c7e053c',
    owner: 'alice@example.com',
    status: 'running'
};
let hasNextPage = true;

while (hasNextPage) {
    const instancesPage = await catalytic.instances.find(options);
    instances.push(...instancesPage.instances);
    if (instancesPage.nextPageToken) {
        options.pageToken = instancesPage.nextPageToken;
    } else {
        hasNextPage = false;
    }
}

instances.forEach(instance => {
    console.log(instance.name);
});
```
