# The Delete Method

Delete an Integration Connection by ID.

>  ⚠️ Workflows using the Integration Connection will not function properly after the Connection is deleted

## Method Signature

```csharp
deleteConnection(id: string): Promise<void>;
deleteConnection(id: string, callback: (err?: Error) => any): void;
```

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `id`      | `string` | The id of the Integration Connection to delete |

## Example

```js
/*
 * This example demonstrates deleting an Integration by ID
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

await catalytic.integrations.deleteConnection('YOUR_INTEGRATION_CONNECTION_ID');
```
