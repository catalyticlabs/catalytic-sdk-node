You can use Integrations to connect to other systems to your Catalytic Workflows. Catalytic has a number of built-in Integrations for common systems. Each [Integration](doc:the-integration-entity-node) can have multiple [Connections](doc:the-integrationconnection-entity-node). For example, if you integrate with Google, you can have different Connections for different users or groups. A Workflow can then use different connections based on what it automates.

> 📘 Learn more about Integrations
>
> https://help.catalytic.com/docs/general-integration-information

# Methods

The `Integrations` client allows you to view existing Integrations and their Connections, and create and manage custom Integrations. It provides the following methods:

| Method                                                         | Description                                     |
| -------------------------------------------------------------- | ----------------------------------------------- |
| [`get`](doc:get-an-integration-node)                           | Gets an Integration and its Connections by `Id` |
| [`find`](doc:find-integrations-node)                           | Search for Integrations by `Name`               |
| [`create`](doc:create-an-integration-node)                     | Creates a new Integration                       |
| [`update`](doc:update-an-integration-node)                     | Updates an Integration by `Id`                  |
| [`delete`](doc:delete-an-integration-node)                     | Deletes an Integration by `Id`                  |
| [`getConnection`](doc:get-an-integrationconnection-node)       | Gets an IntegrationConnection by `Id`           |
| [`createConnection`](doc:create-an-integrationconnection-node) | Creates a new IntegrationConnection             |
| [`deleteConnection`](doc:delete-an-integrationconnection-node) | Deletes an IntegrationConnection by `Id`        |
