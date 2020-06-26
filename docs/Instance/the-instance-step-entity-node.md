# `InstanceStep`

### Common Properties

These are the most commonly used properties of an `InstanceStep`.

| Name          | Type     | Description                                                                  |
| ------------- | -------- | ---------------------------------------------------------------------------- |
| `id`          | `string` | The unique ID of the Instance Step                                           |
| `instanceId`  | `string` | The ID of the Instance the Step belongs to                                   |
| `workflowId`  | `string` | The ID of the Workflow the Step's Instance was started from                  |
| `name`        | `string` | The descriptive name of the Step                                             |
| `description` | `string` | A description of the Step, or instructions to be carried out during the Step |
| `assignedTo`  | `string` | The email of the user or group that the Step is assigned to, if any.         |

### Methods

> 🚧 Methods not yet implemented

#### `setInput`

```typescript
setInput(name: string, value: any): CompleteStepRequest;
```

This method supports setting inputs in a chaining style and then passing those to an `catalytic.instances.completeInstanceStep()` call to complete the InstanceStep with the specified inputs.
