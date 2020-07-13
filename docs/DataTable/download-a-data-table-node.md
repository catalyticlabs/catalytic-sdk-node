# The Download Method

Download a Data Table as a CSV or Excel (xlsx) file.

> 👍 Permissions Required
>
> You must have permissions to read the Data Table for this request to succeed.

## Method Signature

```typescript
download(id: string, format: DataTableExportFormat, path: string): Promise<void>;
download(id: string, format: DataTableExportFormat, path: string, callback: (err?: Error) => any): void;
```

| Parameter  | Type                   | Description                               |
| ---------- | ---------------------- | ----------------------------------------- |
| `id`       | `string`               | The id of the Data Table to download      |
| `format`   | `string`               | `CSV` or `XLSX` (Excel)                   |
| `filePath` | `string`               | The path on disk to save the download to. |
| `callback` | `(err?: Error) => any` | _Optional_ The callback                   |

## Example

```js
/*
 * This example demonstrates downloading a Data Table
*/
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const id = 'c9f2beec-10c0-4f2f-b4e0-1d884c7e053c';
const downloadPath = '/path/to/download/location/for/file';
await catalytic.dataTables.download(id, 'CSV', downloadPath);

console.log(`DataTable downloaded to "${downloadPath}"`);
```
