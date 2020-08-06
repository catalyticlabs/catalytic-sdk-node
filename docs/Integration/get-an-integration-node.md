# The Get Method

Get an Integration and its associated Connections by ID.

> 👍 Permissions Required
>
> Only Connections for which you have View permissions will be included on the response.

## Method Signature

```ts
get(id: string): Promise<Integration>;
get(id: string, callback: (err?: Error, integration: Integration) => any): void;
```

| Parameter | Type                                             | Description                      |
| --------- | ------------------------------------------------ | -------------------------------- |
| `id`      | `string`                                         | The id of the Integration to get |
| _returns_ | [`Integration`](doc:the-integration-entity-node) | The requested Integration        |

## Example

```js
/*
 * This example demonstrates getting an Integration by ID
 * and printing out the Integration's Connections
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const integration = await catalytic.integrations.get('dropbox/oauth2/v1');

integration.connections.forEach(connection => {
    console.log(connection.name);
})
```
