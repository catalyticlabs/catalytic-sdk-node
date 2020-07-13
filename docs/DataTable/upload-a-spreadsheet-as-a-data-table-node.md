# The Upload Method

Upload a spreadsheet file to Catalytic to create a new Data Table.

## Method Signature

```typescript
upload(filePath: string): Promise<DataTable>;
upload(filePath: string, tableName: string): Promise<DataTable>;
upload(filePath: string, tableName: string, headerRow: number): Promise<DataTable>;
upload(filePath: string, tableName: string, headerRow: number, sheetNumber: number): Promise<DataTable>;
upload(filePath: string, callback: (err?: Error, dataTable: DataTable) => any): void;
upload(filePath: string, tableName: string, callback: (err?: Error, dataTable: DataTable) => any): void;
upload(filePath: string, tableName: string, headerRow: number, callback: (err?: Error, dataTable: DataTable) => any): void;
upload(filePath: string, tableName: string, headerRow: number, sheetNumber: number, callback: ClientMethodCallback<DataTable>): void;
```

| Parameter     | Type                                                   | Description                                                                          |
| ------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `filePath`    | `string`                                               | The local path of the CSV, XLS or XLSX file<br>to upload as a Data Table             |
| `tableName`   | `string`                                               | _Optional_ The name of the table to create. Defaults to <br>the uploaded file name.  |
| `headerRow`   | `number`                                                  | _Optional_ The index of row containing column headers. <br>Row counting starts at 1. |
| `sheetNumber` | `number`                                                  | _Optional_ The index of the worksheet to import for Excel files. <br>Defaults to 1.  |
| _returns_     | [`DataTable`](doc:the-data-table-metadata-entity-node) | The newly created Data Table                                                         |

## Example

```js
/*
 * This example demonstrates uploading a Data Table to Cataltyic
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient();

const filePath = '/path/to/local/file.xlsx';
const tableName = 'New Data Table';
const headerRow = 1;
const sheetNumber = 1;
const dataTable = await catalytic.files.upload(filePath, tableName, headerRow, sheetNumber);

console.log(`Uploaded Data Table has ID "${dataTable.id}"`);
```
