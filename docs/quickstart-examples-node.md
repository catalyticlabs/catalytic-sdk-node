# Authentication Quickstart

To use the SDK, you will require an Access Token. As shown in the example below, you can obtain a new Access Token by using your email and password if you do not have SSO enabled for your team. You can then save that token for future use. For SSO and other options, see the [Authentication](doc:authentication-node) section.

### Create a new Access Token

```javascript
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

// You can create a new Access Token using your team name, email and password
const accessToken = await catalytic.accessTokens.create('your-team', 'your-email', 'your-password');

// Ensure you save your serialized AccessToken string (`accessToken.token`), since you will not be able to retrieve the serialized Access Token string again

// Set the Access Token as active on the constructed CatalyticClient.
// The Access Token will automatically be used for all requests requiring authentication
catalytic.setAccessToken(accessToken);
```

### Load an existing Access Token

```javascript
const { CatalyticClient } = require('@catalytic/sdk');

// You may pass your serialized Access Token string into the CatalyticClient constructor
const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

// Alternatively, you may update the Access Token after the client has been constructed.
catalytic.setAccessToken('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');
```

# Quickstart Examples

The following examples all assume that you have configured your default Access Token. Details on other ways to create and load Access Tokens are in the [Authentication](doc:authentication-node) section.

## Example 1: Start a Workflow

Here is a simple example of finding and and starting a Workflow with a couple inputs.

```javascript
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

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

console.log(`Instance started successfully with ID '${instance.id}'`);
```

## Example 2: Complete a Step with Data Tables and Files

Here is a more advanced example showing how you can upload and download files from an Instance, complete a task in an Instance, and upload and download data tables. The Workflow used in this example will email you the results when then example completes.

```javascript
const { CatalyticClient } = require('@catalytic/sdk');
const fs = require('fs');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

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
