# The Replace Method

Replace the contents of an existing table with a CSV or Excel file.

> 👍 Permissions Required
>
> You must have Edit permissions to the data table for this request to succeed

## Method Signature

```typescript
replace(id: string, filePath: string): Promise<DataTable>;
replace(id: string, filePath: string, headerRow: number): Promise<DataTable>;
replace(id: string, filePath: string, headerRow: number, sheetNumber: number): Promise<DataTable>;
replace(id: string, filePath: string, callback: ClientMethodCallback<DataTable>): void;
replace(id: string, filePath: string, headerRow: number, callback: ClientMethodCallback<DataTable>): void;
replace(id: string, filePath: string, headerRow: number, sheetNumber: number, callback: ClientMethodCallback<DataTable>): void;
```

| Parameter     | Type                                                   | Description                                                                          |
| ------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `id`          | `string`                                               | The `id` of the Data Table whose contents will be replaced                           |
| `filePath`    | `string`                                               | The local path of the CSV, XLS or XLSX file<br>to upload as a Data Table             |
| `tableName`   | `string`                                               | _Optional_ The name of the table to create. Defaults to <br>the uploaded file name.  |
| `headerRow`   | `number`                                               | _Optional_ The index of row containing column headers. <br>Row counting starts at 1. |
| `sheetNumber` | `number`                                               | _Optional_ The index of the worksheet to import for Excel files. <br>Defaults to 1.  |
| _returns_     | [`DataTable`](doc:the-data-table-metadata-entity-node) | The newly created Data Table                                                         |

## Example

```js
/*
 * This example demonstrates replacing a Data Table in Cataltyic
 * with a file.
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const existingTableId = '10000000-0000-0000-0000-000000000001';
const filePath = '/path/to/local/file.xlsx';
const tableName = 'New Data Table';
const headerRow = 1;
const sheetNumber = 1;
const dataTable = await catalytic.files.replace(existingTableId, filePath, tableName, headerRow, sheetNumber);

console.log(`Replaced Data Table "${dataTable.name}" with "${filePath}"`);
```
