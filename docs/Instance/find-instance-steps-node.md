# The FindSteps Method

Find Instance steps within an Instance or across all Instances of a Wofkflow.

> 👍 Permissions Required
>
> You must have Find permissions to the Instance for this request to succeed.

## Method Signature

```typescript
findInstanceSteps(): Promise<InstancesPage>;
findInstanceSteps(options: FindInstanceStepsOptions): Promise<InstancesPage>;
findInstanceSteps(callback: (err?: Error, steps: InstanceStepsPage) => any): void;
findInstanceSteps(options: FindInstanceStepsOptions, callback: (err?: Error, steps: InstanceStepsPage) => any): void;
```

| Parameter            | Type                                                         | Description                                                                                                                                                    | Default |
| -------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `options`            | `FindInstanceStepsOptions`                                   | _Optional_ The options options filter criteria to search by, or null to fetch all InstanceSteps.                                                               |         |
| `options.owner`      | `string`                                                     | _Optional_ Search for InstanceSteps owned by a specific team member. The email <br>address of the owner of the Instance must match exactly, apart from casing. |         |
| `options.instanceID` | `string`                                                     | _Optional_ Find InstanceSteps within a specific Instance                                                                                                       |         |
| `options.workflowID` | `string`                                                     | _Optional_ Find InstanceSteps within Instances of a specific Workflow                                                                                          |         |
| `options.assignee`   | `string`                                                     | Find Steps assigned to a specific user by email or username. Results will <br>include Steps assigned to a Group to which the user belongs.                     |
| `options.query`      | `string`                                                     | _Optional_ A query string to search by. Applies to the `name` and `description`<br>properties of InstanceSteps                                                 |         |
| `options.pageSize`   | `number`                                                     | _Optional_ The number of InstanceSteps to fetch in a single `InstanceStepsPage` response                                                                       | `25`    |
| `options.pageToken`  | `string`                                                     | _Optional_ The `nextPageToken` of a previous `find` request, used to fetch the next set of results                                                             |         |
| `callback`           | `(err?: Error, instancesPage: InstanceStepsPage) => any`     | _Optional_ The callback                                                                                                                                        |         |
| _returns_            | [`InstanceStepsPage`](doc:the-instancestepspage-entity-node) | The requested page of InstanceSteps                                                                                                                            |         |

## Example

```js
/*
 * This example demonstrates finding Steps across all Instances
 * assigned to a specific user. Note that this will include Steps
 * assigned to a Group to which the User belongs.
 */

const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const steps = [];

const options = {
    pageSize: 25,
    assignee: 'alice@example.com'
};
let hasNextPage = true;

while (hasNextPage) {
    const stepsPage = await catalytic.steps.find(options);
    steps.push(...stepsPage.steps);
    if (stepsPage.nextPageToken) {
        options.pageToken = stepsPage.nextPageToken;
    } else {
        hasNextPage = false;
    }
}

steps.forEach(step => {
    console.log(step.name);
});
```
