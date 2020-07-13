# The Stop Method

Stops a running Instance of a Workflow.

> 👍 Permissions Required
>
> Find and Edit permissions are required for an Instance in order to stop it. The Instance Owner has implicit Find and Edit permissions, and can always stop Instances they own.

## Method Signature

```typescript
stop(id: string): Promise<Instance>;
stop(id: string, callback: (err?: Error, instance: Instance) => any): void;
```

| Parameter  | Type                                       | Description                    |
| ---------- | ------------------------------------------ | ------------------------------ |
| `id`       | `string`                                   | The `id` of the Instance to stop |
| `callback` | `(err?: Error, instance: Instance) => any` | _Optional_ The callback        |
| _returns_  | [`Instance`](doc:the-instance-entity-node) | The stopped Instance           |

## Example

```js
/*
 * This example demonstrates stopping an Instance by ID
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const instance = await catalytic.instances.stop('c9f2beec-10c0-4f2f-b4e0-1d884c7e053c');
```
