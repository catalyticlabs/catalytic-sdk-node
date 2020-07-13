# The `getInstanceSteps` Method

Gets all InstanceSteps in an Instance.

> 👍 Permissions Required
>
> You must have Find permissions to the Instance for this request to succeed.

## Method Signature

```typescript
getInstanceSteps(id: string): Promise<InstanceStep[]>;
getInstanceSteps(id: string, callback: ClientMethodCallback<InstanceStep[]>): void;
```

| Parameter | Type                                            | Description                                                    |
| --------- | ----------------------------------------------- | -------------------------------------------------------------- |
| `id`      | `string`                                        | The `id` of the Instance whose InstanceSteps should be fetched |
| _returns_ | [`InstanceStep[]`](doc:the-instancestep-entity) | An Array of all InstanceSteps in this Instance                 |

## Example

```js
/*
 * This example demonstrates getting an Instance's Steps by the Instance ID
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const steps = await catalytic.instances.getInstanceSteps('e6df431b-1041-4326-89e5-1e14caa6a08f');
```
