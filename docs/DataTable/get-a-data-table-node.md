# The Get Method

Get metadata for a Data Table by ID.

> 👍 Permissions Required
>
> You must have View permissions to the data table for this request to succeed

## Method Signature

```typescript
get(id: string): Promise<DataTable>;
get(id: string, callback: (err?: Error, dataTable: DataTable) => any): void;
```

| Parameter  | Type                                                   | Description                     |
| ---------- | ------------------------------------------------------ | ------------------------------- |
| `id`       | `string`                                               | The id of the Data Table to get |
| `callback` | `(err?: Error, dataTable: DataTable) => any`           | _Optional_ The callback         |
| _returns_  | [`DataTable`](doc:the-data-table-metadata-entity-node) | The requested Data Table        |

## Example

```js
/*
 * This example demonstrates getting a Data Table's metadata by ID
 * and printing out the table's name and columns
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const id = 'c9f2beec-10c0-4f2f-b4e0-1d884c7e053c';
const table = await catalytic.dataTables.get(id);

console.log(table.name);
table.columns.forEach(column => console.log(`${column.name} (${column.type})`));
```
