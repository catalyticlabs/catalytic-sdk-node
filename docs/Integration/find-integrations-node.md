# The Find Method

Finds Integrations matching your criteria. The `Integrations.Find` method supports a fluent style where you can chain together your search criteria.

## Method Signature

```ts
find(): Promise<IntegrationsPage>;
find(options: FindIntegrationsOptions): Promise<IntegrationsPage>;
find(callback: callback: (err?: Error, integrationsPage: IntegrationsPage) => any): void;
find(options: FindIntegrationsOptions, callback: callback: (err?: Error, integrationsPage: IntegrationsPage) => any): void;
```

| Parameter           | Type                                                       | Description                                                                                        | Default |
| ------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| `options`           | `FindIntegrationsOptions`                                  | _Optional_ The paging options filter criteria to search by, or null to fetch all Integrations.     |         |
| `options.query`     | `string`                                                   | _Optional_ A query string to search by. Applies to the `name` property of Integrations             |         |
| `options.pageSize`  | `number`                                                   | _Optional_ The number of Integrations to fetch in a single `IntegrationsPage` response             | `25`    |
| `options.pageToken` | `string`                                                   | _Optional_ The `nextPageToken` of a previous `find` request, used to fetch the next set of results |         |
| `callback`          | `(err?: Error, integrationsPage: IntegrationsPage) => any` | _Optional_ The callback                                                                            |         |
| _returns_           | [`IntegrationsPage`](doc:the-integrationspage-entity-node) | The requested page of Integrations                                                                 |         |

## Example

```js
/*
 * This example demonstrates listing all Integrations
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const integrations = [];

const options = { pageSize: 25 };
let hasNextPage = true;

while (hasNextPage) {
    const integrationsPage = await catalytic.integrations.find(options);
    integrations.push(...integrationsPage.integrations);
    if (integrationsPage.nextPageToken) {
        options.pageToken = integrationsPage.nextPageToken;
    } else {
        hasNextPage = false;
    }
}

integrations.forEach(integration => {
    console.log(integration.name);
});
```
