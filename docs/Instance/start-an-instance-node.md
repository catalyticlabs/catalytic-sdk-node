# The Start Method

Starts an Instance of a Workflow. You can optionally pass values for the input fields defined on the Workflow.

> 👍 Permissions Required
>
> You must have Find permissions to the Workflow, and the Workflow must have "Can be started manually" enabled in order to start an instance of this Workflow. Manual starts are enabled by default for Workflows in the Web App.

## Method Signature

```typescript
start(workflowID: string): Promise<Instance>;
start(workflowID: string, name: string): Promise<Instance>;
start(workflowID: string, inputs: FieldInput[]): Promise<Instance>;
start(workflowID: string, name: string, inputs: FieldInput[]): Promise<Instance>;
start(workflowID: string, callback: (err?: Error, instance: Instance) => any): Promise<Instance>;
start(workflowID: string, name: string, callback: (err?: Error, instance: Instance) => any): Promise<Instance>;
start(workflowID: string, inputs: FieldInput[], callback: (err?: Error, instance: Instance) => any): Promise<Instance>;
start(workflowID: string, name: string, inputs: FieldInput[], callback: (err?: Error, instance: Instance) => any): Promise<Instance>;
```

| Parameter    | Type                                       | Description                                                                                                 |
| ------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `workflowID` | `string`                                   | The ID of the Workflow to start                                                                             |
| `name`       | `string`                                   | _Optional_ The name to apply to the Instance                                                                |
| `inputs`     | `FieldInput[]`                             | _Optional_ named input parameters to pass to the Instance.<br>Must match Fields configured on the Workflow. |
| `callback`   | `(err?: Error, instance: Instance) => any` | _Optional_ The callback                                                                                     |
| _returns_    | [`Instance`](doc:the-instance-entity-node) | The newly started Instance                                                                                  |

### `FieldInput`

| Property | Description                                             |
| -------- | ------------------------------------------------------- |
| `name`   | The name or reference name of the Field on the Instance |
| `value`  | The string-serialized value of the Field                |

See the [Instances Quickstart Example](doc:instances-node#quickstart-example) for an example of finding and starting a Workflow by name instead of ID.

## Example

```js
/*
 * Starting an Instance of a Workflow
 */

const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

// Define some fields to pass to the Instance
const fields = [
    { name: 'Age', value: '42' },
    { name: 'Name', value: 'Alice' }
];
// Start a new Instance of the Workflow with the provided name and fields
const instance = await catalytic.instances.start(workflowId.id, 'My new Instance', fields);
```
