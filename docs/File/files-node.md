You can upload and download files to and from the Catalytic platform. You can then reference those files in Fields in Pushbots and Instances.

# Methods

The `files` client allows you to upload and download files from the Catalytic platform, and to get file metadata like size, content-type and filename. It provides the following methods:

| Method                                        | Description                                              |
| --------------------------------------------- | -------------------------------------------------------- |
| [`get`](doc:get-a-file-node)                  | Gets metadata of a File by `id`                          |
| [`find`](doc:find-files-node)                 | Search for Files by `name`, `workflowId` or `instanceId` |
| [`download`](doc:download-a-file-node)        | Downloads a File by `id`                                 |
| [`getFileStream`](doc:get-a-file-stream-node) | Gets a readable stream of a File by `id`                 |
| [`upload`](doc:upload-a-file-node)            | Uploads one or more new Files                            |

# Quickstart Example

```javascript
/*
 * This example demonstrates downloading and uploading files
 * from a Workflow Instance.
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
