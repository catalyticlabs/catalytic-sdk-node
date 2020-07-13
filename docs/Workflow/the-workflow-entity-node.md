`Catalytic.SDK.Entities.Workflow`

# Summary of Properties and Methods

## Common Workflow Properties

These are the most commonly used properties of a `Workflow`.

| Name          | Type      | Description                                                                                                       |
| ------------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| `id`          | `string`  | The unique ID of the Workflow                                                                                     |
| `name`        | `string`  | The descriptive name of the Workflow                                                                              |
| `description` | `string`  | A description of what the Workflow does                                                                           |
| `category`    | `string`  | A descriptive grouping for your Workflow                                                                          |
| `inputFields` | `Field[]` | A collection of the required and optional input fields <br> that can be passed to this Workflow when starting it. |

## Permission and Visibility Workflow Properties

These are the properties that determine how users can find, edit, start or access a `Workflow`.

| Name                 | Type                 | Description                                                                                                                                                                             |
| -------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isPublished`        | `bool`               | Indicates whether the Workflow is published or is in draft mode                                                                                                                         |
| `isArchived`         | `bool`               | Indicates whether is Archived and no longer available for users <br> to find, start or edit.                                                                                            |
| `fieldVisibility`    | `FieldVisibility`    | The default visibility level of fields for this Workflow<br>`public`, `internal`, `confidential` or `highlyConfidential`                                                                |
| `instanceVisibility` | `InstanceVisibility` | The visibility level of this Workflow<br>`open` or `restricted`                                                                                                                         |
| `adminUsers`         | `string[]`           | The users or groups who who may **view**, **start**, and **edit**<br> this `Workflow`. Users will be represented by their `email`,<br> groups by their group name (starting with `g_`). |
| `standardUsers`      | `string[]`           | The users or groups who who may **view** and **start**<br> this `Workflow`. Users will be represented by their `email`,<br> groups by their group name (starting with `g_`).            |
| `createdBy`          | `string`             | The email address of the user who created this `Workflow`                                                                                                                               |
| `owner`              | `string`             | The email address of the user who is the primary admin <br>for this `Workflow`. This user will receive fix tasks when there is<br> a problem in an `Instance` of this `Workflow`        |

# Constructors

> `Workflow`s should not be created directly via the constructor. Instead they should be created in the Web UI. Future versions will support creating new Workflows via the SDK.

# Methods

> 🚧 Workflow methods not yet implemented

## The `setInput` Method

Supports setting inputs in a chaining style and then passing those to an [`instances.start()`](doc:start-an-instance-node) call to start an `Instance` of this `Workflow` with the specified inputs.

### Method Signature

```typescript
setInput(name: string, value: any): StartInstanceRequest;
```

| Parameter | Type                   | Description                                                                       |
| --------- | ---------------------- | --------------------------------------------------------------------------------- |
| `name`    | `string`               | The name of the Workflow's input parameter                                        |
| `value`   | `object`               | The value of the Workflow's input parameter                                       |
| _returns_ | `StartInstanceRequest` | A request that can be passed to [`instances.start()`](doc:start-an-instance-node) |

### Example

```js
/*
 * This example demonstrates starting a Workflow with inputs
 */
const { CatalyticClient } = require('@catalytic/sdk');

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

console.log(`Instance started successfully with ID '${instance.id}'`);
```
