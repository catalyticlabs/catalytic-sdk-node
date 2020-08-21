# The Create Method

Create a custom Integration with which Connections can be created. To create a new Integration, you must provide your own application authentication parameters.

> 📘 Learn More about Custom Integrations
>
> https://help.catalytic.com/docs/custom-integrations/

```ts
create(createRequest: IntegrationCreationRequest): Promise<Integration>;
create(name: string, config: IntegrationConfiguration): Promise<Integration>;
create(createRequest: IntegrationCreationRequest, callback: ClientMethodCallback<Integration>): Promise<Integration>;
create(name: string, config: IntegrationConfiguration, callback: ClientMethodCallback<Integration>): Promise<Integration>;
```

| Parameter         | Type                                            | Description                                               |
| ----------------- | ----------------------------------------------- | --------------------------------------------------------- |
| `creationRequest` | `IntegrationCreationRequest`                    | The request containing Integration configuration metadata |
| _returns_         | [`Integration`](doc:the-integration-entity-net) | The requested Integration                                 |

### `IntegrationCreationRequest`

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

const name = 'My Custom Integration';

const config = {
    clientID: 'MY_OAUTH_CLIENT_ID',
    clientSecret: 'MY_OAUTH_CLIENT_SECRET',
    tokenPath: '/oauth2/token',
    revokePath: '/oauth2/revoke',
    authorizeBaseUrl: 'https://example-oauth-app.com/oauth2/authorize',
    site: 'https://api.example-oauth-app.com',
    scopes: ['read', 'write'],
    useBodyAuth: false
};

const integration = await catalytic.integration.create(name, config);
console.log(integration.id);
```
