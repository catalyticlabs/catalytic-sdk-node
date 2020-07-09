# The Find Method

Find Data Tables by name.

> 👍 Permissions Required
>
> You must have Find permissions to a matching Data Table for it to be included in the results

## Method Signature

```typescript
find(): Promise<DataTablesPage>;
find(options: FindDataTablesOptions): Promise<DataTablesPage>;
find(callback: (err?: Error, dataTablesPage: DataTablesPage) => any): void;
find(options: FindDataTablesOptions, callback: (err?: Error, dataTablesPage: DataTablesPage) => any): void;
```

| Parameter           | Type                                                   | Description                                                                                        | Default |
| ------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------- |
| `options`           | `FindDataTablesOptions`                                | _Optional_ The paging options filter criteria to search by, or null to fetch all Users.            |         |
| `options.query`     | `string`                                               | _Optional_ A query string to search by. Applies to the `name` property of Users                    |         |
| `options.pageSize`  | `number`                                               | _Optional_ The number of Users to fetch in a single `DataTablesPage` response                      | `25`    |
| `options.pageToken` | `string`                                               | _Optional_ The `nextPageToken` of a previous `find` request, used to fetch the next set of results |         |
| `callback`          | `(err?: Error, dataTablesPage: DataTablesPage) => any` | _Optional_ The callback                                                                            |         |
| _returns_           | [`DataTablesPage`](doc:the-datatablespage-entity-node)     | The requested page of Data Tables                                                                  |

## Example

```js
/*
 * This example demonstrates finding all Data Tables and
 * logging their names
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const dataTables = [];

const options = { pageSize: 25 };
let hasNextPage = true;

while (hasNextPage) {
    const dataTablesPage = await catalytic.dataTables.find(options);
    dataTables.push(...dataTablesPage.dataTables);
    if (dataTablesPage.nextPageToken) {
        options.pageToken = dataTablesPage.nextPageToken;
    } else {
        hasNextPage = false;
    }
}

dataTables.forEach(table => {
    console.log(table.name);
});
```
