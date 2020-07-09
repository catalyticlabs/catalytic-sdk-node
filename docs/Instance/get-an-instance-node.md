# The Get Method

Gets an Instance by ID. The Instance ID can be read off the instance object, or copied from the URL of the instance.


> 👍 Permissions Required
>
> You must have Find permissions to the Instance for this request to succeed.

## Method Signature

```typescript
get(id: string): Promise<Instance>;
get(id: string, callback: (err?: Error, instance: Instance) => any): void;
```

| Parameter  | Type                                       | Description                   |
| ---------- | ------------------------------------------ | ----------------------------- |
| `id`       | `Guid`                                     | The id of the Instance to get |
| `callback` | `(err?: Error, instance: Instance) => any` | _Optional_ The callback       |
| _returns_  | [`Instance`](doc:the-instance-entity-node) | The requested Instance        |

## Example

```js
/*
 * This example demonstrates getting a Workflow Instance by ID
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const instance = await catalytic.instances.get('c9f2beec-10c0-4f2f-b4e0-1d884c7e053c');
```
