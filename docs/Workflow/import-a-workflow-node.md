# The Import Method

Import a Workflow into your Catalytic team using a `.catalytic` file, created by the [Export Workflows](doc:export-workflows-node) method or via the Catalytic WebApp. This method returns the newly created Workflow.

## Method Signature

```typescript
import(filePath: string): Promise<Workflow>;
import(filePath: string, callback: (err?: Error, workflow: Workflow) => any): void;
import(filePath: string, password: string): Promise<Workflow>;
import(filePath: string, password: string, callback: (err?: Error, workflow: Workflow) => any): void;
```

| Parameter  | Type                                        | Description                                                        |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------ |
| `filePath` | `string`                                    | The path to the Workflow Export File to use to create the Workflow |
| `password` | `string`                                    | _Optional_ Password used to secure the export file                 |
| `callback` | `(err?: Error, workflow: Workflow) => any`  | _Optional_ The callback                                            |
| _returns_  | [`Workflow`](doc:the-workflows-entity-node) | The imported Workflow                                              |

## Example

```js
/*
 * This example demonstrates importing a Workflow from a password-secured
 * `.catalytic` Workflow export file.
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const filePath = '/path/to/export/file.catalytic';
const password = 'MY_EXPORT_PASSWORD';

const workflow = await catalytic.workflows.import(filePath, password);
```
