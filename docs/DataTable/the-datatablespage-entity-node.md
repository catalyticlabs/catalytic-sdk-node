The `DataTablesPage` class represents a page of `DataTable`s, usually returned from the [`dataTables.find()`](doc:find-data-tables-node) method.

# Instance Properties

| Name            | Type          | Description                                                                         |
| --------------- | ------------- | ----------------------------------------------------------------------------------- |
| `dataTables`    | `DataTable[]` | The DataTables included in this page of results                                     |
| `nextPageToken` | `string`      | The `pageToken` to use for fetching the next page of items from `dataTables.find()` |
| `count`         | `number`      | The number of DataTables returned                                                   |
