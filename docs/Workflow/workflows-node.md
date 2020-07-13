A Workflow is an automation you build on the Catalytic platform. It is a template of the process you want to run each time your Workflow is started.

> 📘 Lean More About Workflows
>
> In you're interested in learning more about what Workflows are or how they work on the Catalytic platform, see [The Catalytic Help Docs Section on Workflows](https://help.catalytic.com/docs/pushbots/)

# Methods

The `Workflows` client allows you to access your Workflow definitions. These can then be used to [start Instances](doc:start-an-instance-node). It provides the following methods:

| Method                                | Description                              |
| ------------------------------------- | ---------------------------------------- |
| [`get`](doc:get-a-workflow-node)      | Gets a specific Workflow by `id`         |
| [`find`](doc:find-workflows-node)     | Search for Workflow by `name` or `owner` |
| [`export`](doc:export-workflows-node) | Export an existing Workflow              |
| [`import`](doc:import-workflows-node) | Import a Workflow                        |

> 🚧 Creating or Editing Workflows
>
> Currently, the SDK does not support creating or editing Workflow definitions. Instead, you must create and edit your Workflows through the Catalytic Web App. Future versions of the SDK will support creating and editing Workflows.

# Quickstart Example

```js
/*
 * This example demonstrates getting Workflows by ID and by name
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const workflowById = await catalytic.workflows.get('c9f2beec-10c0-4f2f-b4e0-1d884c7e053c');
const workflowsByName = await catalytic.workflows.find({ query: 'SDK Examples' });

console.log(`Found ${workflowsByName.workflows.length} Workflows by name and 1 by Id`);

```
