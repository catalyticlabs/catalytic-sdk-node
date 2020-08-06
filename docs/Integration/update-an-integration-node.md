# The Update Method

Update an existing custom Integration by ID. Every update request must include the application authentication parameters (`config`).

```ts
update(id: string, updateRequest: IntegrationUpdateRequest): Promise<Integration>;
update(id: string, name: string, config: IntegrationConfiguration): Promise<Integration>;
update(id: string, updateRequest: IntegrationUpdateRequest, callback: ClientMethodCallback<Integration>): Promise<Integration>;
update(id: string, name: string, config: IntegrationConfiguration, callback: ClientMethodCallback<Integration>): Promise<Integration>;
```

| Parameter       | Type                                            | Description                                               |
| --------------- | ----------------------------------------------- | --------------------------------------------------------- |
| `id`            | string                                          | The ID of the Integration to update                       |
| `updateRequest` | `IntegrationUpdateRequest`                      | The request containing Integration configuration metadata |
| _returns_       | [`Integration`](doc:the-integration-entity-net) | The requested Integration                                 |

### `IntegrationUpdateRequest`

| Name     | Type                       | Description                                   |
| -------- | -------------------------- | --------------------------------------------- |
| `name`   | `string`                   | The display Name to apply to the Integration  |
| `config` | `IntegrationConfiguration` | The configuration settings fo the Integration |

### `IntegrationConfiguration`

| Name               | Type       | Description                                                                |
| ------------------ | ---------- | -------------------------------------------------------------------------- |
| `clientId`         | `string`   | Client ID of the OAuth Application                                         |
| `clientSecret`     | `string`   | Client Secret of the OAuth Application                                     |
| `tokenPath`        | `string`   | Token Path of the OAuth Application                                        |
| `revokePath`       | `string`   | Token Revocation Path of the OAuth Application                             |
| `authorizeBaseUrl` | `string`   | The base URL of the OAuth Application                                      |
| `site`             | `string`   | The website of the OAuth Application                                       |
| `scopes`           | `string[]` | The list of Scopes to apply to Connections using the Integration           |
| `useBodyAuth`      | `boolean`  | Boolean indicating whether auth params should be sent to OAuth app in body |

## Example

```js
/*
 * This example demonstrates creating a custom Integration
 */

const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const name = 'My Updated Custom Integration';

const config = {
    clientID: 'MY_OAUTH_CLIENT_ID',
    clientSecret: 'MY_OAUTH_CLIENT_SECRET',
    tokenPath: '/oauth2/token',
    revokePath: '/oauth2/revoke',
    authorizeBaseUrl: 'https://example-oauth-app.com/oauth2/authorize',
    site: 'https://api.example-oauth-app.com',
    scopes: ['read', 'write', 'delete'],
    useBodyAuth: false
};

const integration = await catalytic.integration.update(name, config);
console.log(integration.id);
```
