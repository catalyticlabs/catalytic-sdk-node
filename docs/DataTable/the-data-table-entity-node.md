# `DataTable`

The Data Table entity contains metadata about Data Tables stored in the Catalytic platform. Data Tables can be created within Workflows, or directly via uploading a CSV or Excel-formatted spreadsheet file.

### Common Properties

These are the most commonly used properties of a `DataTable`.

| Name         | Type                | Description                                                |
| ------------ | ------------------- | ---------------------------------------------------------- |
| `id`         | `id`                | The unique ID of the Data Table                            |
| `name`       | `string`            | The name of the Data Table                                 |
| `columns`    | `DataTableColumn[]` | The Columns in the Data Table                              |
| `type`       | `DataTableType`     | `imported`, `master`, `application`, `instance` or `batch` |
| `visibility` | `Visibility`        | `open` or `restricted`                                     |

`Catalytic.SDK.Entities.DataTableColumn`

Data

### Common Properties

These are the most commonly used properties of a `DataTableColumn`.

| Name           | Type                | Description                                                                             |
| -------------- | ------------------- | --------------------------------------------------------------------------------------- |
| `id`           | `Guid`              | The unique ID of the Data Table                                                         |
| `name`         | `string`            | The name of the Column                                                                  |
| `type`         | `FieldType`         | The type of data held in the column. See [Fields](doc:the-field-entity-node) for types. |
| `restrictions` | `FieldRestrictions` | May include a `string[]` `choices` for <br>`singleChoice` and `multipleChoice` fields.  |
