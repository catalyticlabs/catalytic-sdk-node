# The Delete Method

Delete a custom Integration and its Connections by ID.

>  ⚠️ Workflows using the Integration will not function properly after Integration is deleted

## Method Signature

```csharp
delete(id: string): Promise<void>;
delete(id: string, callback: (err?: Error) => any): void;
```

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `id`      | `string` | The id of the Integration to delete |

## Example

```js
/*
 * This example demonstrates deleting an Integration by ID
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

await catalytic.integrations.delete('YOUR_INTEGRATION_ID');
```
