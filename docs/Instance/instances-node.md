When you start a Workflow, you create an Instance. That Instance contains data stored in fields and tracks the status of your automation workflow. Each Step in your Workflow becomes a Step in your Instance.

# Methods

The `Instances` client allows you to start and stop Instances, find and get data from your Instances and complete steps in your Instances. It provides the following methods:

| Method                                                       | Description                               |
| ------------------------------------------------------------ | ----------------------------------------- |
| [`get`](doc:get-an-instance-node)                            | Gets a specific Instance by `id`          |
| [`find`](doc:find-instances-node)                            | Search for Instances by `name` or `owner` |
| [`start`](doc:start-an-instance-node)                        | Start an Instance of a Workflow           |
| [`stop`](doc:stop-an-instance-node)                          | Stop an Instance                          |
| [`getInstanceStep`](doc:get-an-instance-step-node)           | Get an Instance Step by ID                |
| [`findInstanceSteps`](doc:find-instance-steps-node)          | Find Instance Steps                       |
| [`getInstanceSteps`](doc:get-instance-steps-node)            | Gets all Instance Steps on an Instance    |
| [`completeInstanceStep`](doc:complete-an-instance-step-node) | Complete a Step                           |
| [`reassignInstanceStep`](doc:reassign-an-instance-step-node) | Reassign an Instance Step                 |

# Quickstart Example

```javascript
/*
 * This example demonstrates finding a Workflow, starting an Instance of
 * that Workflow with some inputs, getting data from the Instance and
 * finally completing a Step in the Instance.
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
