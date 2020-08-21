# The Create Method

Create a Connection to an existing Integration.

> 📘 Learn More about Integrations
>
> https://help.catalytic.com/docs/general-integration-information/#how-integrations-work

```ts
createConnection(integrationId: string, name: string, connectionParams: FieldInput[]): Promise<IntegrationConnection>;
createConnection(integrationId: string, name: string, connectionParams: FieldInput[], callback: ClientMethodCallback<IntegrationConnection>): void;
```

| Parameter          | Type                                                                | Description                                                                                                             |
| ------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `integrationId`    | `string`                                                            | The Id of the Integration for which a Connection should be created                                                      |
| `name`             | `string`                                                            | The display name to apply to the new Integration connection                                                             |
| `connectionParams` | `FieldInput[]`                                                      | The values required to create a Connection of the Integration. Should mirror the `ConnectionParams` on the Integration. |
| _returns_          | [`IntegrationConnection`](doc:the-integrationconnection-entity-net) | The created Integration Connection                                                                                      |

### `FieldInput`

| Property | Description                                             |
| -------- | ------------------------------------------------------- |
| `name`   | The name or reference name of the Field on the Instance |
| `value`  | The string-serialized value of the Field                |

## Example

```ts
/*
 * This example demonstrates creating a new SFTP Integration Connection
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const integrationId = 'sftp/non-oauth/v1';
const name = 'My New SFTP Connection';
const params = [
    { name: 'username', value: 'alice' },
    { name: 'password', value: 'p@$$w0rd' },
    { name: 'urls', value: 'sftp://my-sftp-site.com' },
];

var connection = await catalytic.integrations.createConnection(integrationId, name, params);
console.log(connection.id);
```
