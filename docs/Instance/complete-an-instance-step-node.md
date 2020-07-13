# The CompleteStep Method

Complete an instance step that is currently `Active`. If the step is configured with output fields, you can set the values of those output fields while completing the step.

> 👍 Permissions Required
>
> You must have admin access to the Instance, or be an assignee for the Step for this request to succeed

## Method Signature

```typescript
completeInstanceStep(id: string): Promise<InstanceStep>;
completeInstanceStep(id: string, fields: FieldInput[]): Promise<InstanceStep>;
completeInstanceStep(id: string, callback: ClientMethodCallback<InstanceStep>): void;
completeInstanceStep(id: string, fields: FieldInput[], callback: ClientMethodCallback<InstanceStep>): void;
```

| Parameter    | Type                                               | Description                                                                                                     |
| ------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `workflowID` | `string`                                           | The ID of the InstanceStep to complete                                                                          |
| `fields`     | `FieldInput[]`                                     | _Optional_ named input parameters to pass to the InstanceStep.<br>Must match Fields configured on the Workflow. |
| `callback`   | `(err?: Error, step: InstanceStep) => any`         | _Optional_ The callback                                                                                         |
| _returns_    | [`InstanceStep`](doc:the-instancestep-entity-node) | The newly started InstanceStep                                                                                  |

### `FieldInput`

| Property | Description                                             |
| -------- | ------------------------------------------------------- |
| `name`   | The name or reference name of the Field on the Instance |
| `value`  | The string-serialized value of the Field                |

## Example

```js
/*
 * Demonstrates starting a Workflow Instance, then completing
 * a Step in that Instance. Both text and file fields are
 * set during task completion.
 */
const { CatalyticClient } = require('@catalytic/sdk');
const fs = require('fs');

const catalytic = new CatalyticClient();

// Search for Workflows containing "Sdk Example Workflow" in their title or description
const matches = await catalytic.workflows.find({
    query: 'Sdk Example Workflow'
});
// Grab the first match
const workflow = matches.workflows[0];

// Define some fields to pass to the Workflow
const fields = [
    { name: 'Age', value: 42 },
    { name: 'Name', value: 'Alice' }
];
// Start a new Instance of the Workflow with the provided name and fields
const instance = await catalytic.instances.start(workflowId.id, 'My new Instance', fields);

// Fetch the value of the `Table` field from the newly started Instance. The value will be a
// Data Table ID.
const tableId = instance.fields.find(field => field.name === 'table').value;

// Download the Data Table as a CSV
const localFilePath = './data-table.csv';
await catalytic.dataTables.download(tableId, 'csv', localFilePath);
const content = fs.readFileSync(localFilePath).toString();

// Update the CSV file locally, and upload to Catalytic as a new file
const updatedContent = content.replace('foo', 'bar');
fs.writeFileSync(localFilePath, updatedContent);
const uploadedFile = await catalytic.files.upload(localFilePath);

// Find the "Upload Updated Spreadsheet and Set Email" Instance Step on the Instance
const steps = (await catalytic.instances.findInstanceSteps({ instanceID: instance.id })).steps;
const uploadStep = steps.find(step => step.name === 'Upload Updated Spreadsheet and Set Email');

// Complete the "Upload Updated Spreadsheet and Set Email" with the ID of the uploaded File
const stepFields = [{ name: 'Updated CSV', value: uploadedFile.id, 'Email Address': 'YOUR_EMAIL' }];
catalytic.instances.completeInstanceStep(uploadStep.id, stepFields);

console.log(
    `You should have an email waiting for you at ${YOUR_EMAIL} now with the updated CSV converted to an Excel attachment`
);
```
