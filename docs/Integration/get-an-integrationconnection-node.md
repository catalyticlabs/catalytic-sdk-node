# The Get Method

Get an IntegrationConnection by ID.

> 👍 Permissions Required
>
> Only Connections for which you have View permissions will be included on the response.

## Method Signature

```ts
getConnection(id: string): Promise<IntegrationConnection>;
getConnection(id: string, callback: (err?: Error, integrationConnection: IntegrationConnection) => any): void;
```

| Parameter | Type                                                       | Description                                |
| --------- | ---------------------------------------------------------- | ------------------------------------------ |
| `id`      | `string`                                                   | The id of the IntegrationConnection to get |
| _returns_ | [`IntegrationConnection`](doc:the-integration-entity-node) | The requested IntegrationConnection        |

## Example

```js
/*
 * This example demonstrates getting an IntegrationConnection by ID
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const connection = await catalytic.integrations.get('INTEGRATION_CONNECTION_ID');
console.log(connection.name);
```
