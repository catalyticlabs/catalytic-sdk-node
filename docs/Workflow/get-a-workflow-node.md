# The Get Method

Gets a Workflow by ID. The Workflow ID can be read off of the Workflow object, or copied from the URL of the Workflow.

> 👍 Permissions Required
>
> You must have Find permissions to the Workflow in order to for this request to succeed.

## Method Signature

```typescript
get(id: string): Promise<Workflow>;
get(id: string, callback: (err?: Error, workflow: Workflow) => any): void;
```

| Parameter  | Type                                       | Description                   |
| ---------- | ------------------------------------------ | ----------------------------- |
| `id`       | `Guid`                                     | The id of the Workflow to get |
| `callback` | `(err?: Error, workflow: Workflow) => any` | _Optional_ The callback       |
| _returns_  | [`Workflow`](doc:the-workflows-entity-net) | The requested Workflow        |

## Example

```js
/*
 * This example demonstrates getting a Workflow by id
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const workflow = await catalytic.workflows.get('c9f2beec-10c0-4f2f-b4e0-1d884c7e053c');
```
