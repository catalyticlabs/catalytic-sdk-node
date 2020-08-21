## Integration

The Integration entity contains metadata about Integrations in the Catalytic platform.

### Common Properties

These are the most commonly used properties of an `Integration`.

| Name                  | Type                                                                   | Description                                                                                        |
| --------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `id`                  | `string`                                                               | The unique ID of the Integration                                                                   |
| `name`                | `string`                                                               | The name of the Integration                                                                        |
| `isCustomIntegration` | `boolean`                                                              | Boolean indicating whether Integration is a built-in Catalytic Integration or a custom Integration |
| `connections`         | [`IntegrationConnection[]`](doc:the-integrationconnection-entity-node) | List of `IntegrationConnections` to this Integration                                               |
| `connectionParams`    | [`Field[]`](doc:the-field-entity-node)                                 | List of values required to create a new Connection of this Integration                             |
