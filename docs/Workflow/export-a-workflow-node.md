# The Export Method

Export an existing Workflow from your Catalytic team, optionally secured with a password. This method produces a [File](doc:the-file-metadata-entity-node) that can be [downloaded](doc:download-a-file-node) and used to import the Workflow into another team.

> 👍 Permissions Required
>
> You must have Find permissions to the Workflow in order to for this request to succeed.

## Method Signature

```typescript
export(id: string): Promise<FileMetadata>;
export(id: string, callback: (err?: Error, file: FileMetadata) => any): void;
export(id: string, password: string): Promise<FileMetadata>;
export(id: string, password: string, callback: (err?: Error, file: FileMetadata) => any): void;
```

| Parameter  | Type                                                | Description                                                       |
| ---------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| `id`       | `string`                                            | The string `id` of the Workflow to export                         |
| `password` | `string`                                            | _Optional_ Password used to secure the exported file              |
| `callback` | `(err?: Error, file: FileMetadata) => any`          | _Optional_ The callback                                           |
| _returns_  | [`FileMetadata`](doc:the-file-metadata-entity-node) | The exported file, ready for [download](doc:download-a-file-node) |

## Example

```js
/*
 * This example demonstrates exporting a Workflow from a Catalytic
 * team and downloading the export file.
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const workflowId = '10000000-0000-0000-0000-000000000001';
const exportFileMetadata = await catalytic.workflows.export(workflowId);

const exportFileDownloadPath = '/path/to/download/location/for/export/file.catalytic';
await catalytic.files.download(exportFileMetadata.id);
```
