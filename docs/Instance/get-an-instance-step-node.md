# The GetStep Method

Gets an Instance Step by ID. The Step ID can be found with the Get Instance Steps or Find Instance Steps calls, or copied from the URL of the Instance Step.

> 👍 Permissions Required
>
> You must have Find permissions to the Instance for this request to succeed.

## Method Signature

```typescript
getInstanceStep(id: string): Promise<InstanceStep>;
getInstanceStep(id: string, callback: (err?: Error, step: InstanceStep) => any): void;
```

| Parameter  | Type                                               | Description                          |
| ---------- | -------------------------------------------------- | ------------------------------------ |
| `id`       | `Guid`                                             | The `id` of the Instance Step to get |
| `callback` | `(err?: Error, step: InstanceStep) => any`     | _Optional_ The callback              |
| _returns_  | [`InstanceStep`](doc:the-instance-step-entity-net) | The requested Instance Step          |

## Example

```js
/*
 * This example demonstrates getting an Instance Step by ID
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const step = await catalytic.instances.getInstanceStep('e6df431b-1041-4326-89e5-1e14caa6a08f');
```
