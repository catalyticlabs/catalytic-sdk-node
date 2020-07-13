# The `getDownloadStream` Method

Get a stream of the contents of an exported data table, in CSV (default) or Excel format.

> 👍 Permissions Required
>
> You must have View permissions to the field this file was uploaded to for this request to succeed

## Method Signature

```typescript
getDownloadStream(id: string, format: DataTableExportFormat): Promise<Stream>;
getDownloadStream(id: string, format: DataTableExportFormat, callback: ClientMethodCallback<Stream>): void;
```

| Parameter  | Type                                                                                          | Description                                          |
| ---------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `id`       | `string`                                                                                      | The id of the Data Table to get a readable stream of |
| `format`   | `string`                                                                                      | `CSV` or `XLSX` (Excel)                              |
| `callback` | `(err?: Error, stream: Stream) => any`                                                        | _Optional_ The callback                              |
| _returns_  | [`Stream`](https://nodejs.org/docs/latest-v12.x/api/stream.html#stream_class_stream_readable) | The requested file's metadata and readable stream    |

## Example

```js
/*
 * This example demonstrates writing a Data Table's contents to
 * the Console as CSV rows
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const id = 'c9f2beec-10c0-4f2f-b4e0-1d884c7e053c';
const stream = await catalytic.dataTables.getDownloadStream(id, 'CSV');

stream.on('data', chunk => console.log(chunk.toString()));
```
