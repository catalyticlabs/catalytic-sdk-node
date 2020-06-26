# `Field`

Fields hold the data in your Workflows and can be used to configure which steps your Workflow Instance takes and which are skipped.

Fields can hold simple data like text, dates or numbers. Fields can also hold files or references to other Catalytic entities like Workflows or Tables.

> 📘 More About Fields
>
> For more information on Fields and Field Types in the Catalytic platform, see [the platform help docs](https://catalytic.pushbot.com/help/docs/field-types/).

# Field Types

| FieldType        | Notes                                                           |
| ---------------- | --------------------------------------------------------------- |
| `text`           | Contains arbitrary UTF-8 text. Many use-cases support markdown. |
| `integer`        |                                                                 |
| `decimal`        |                                                                 |
| `date`           | Contains only the date, without a time component                |
| `dateTime`       | A date and time, represented in UTC                             |
| `json`           | Validated JSON, encoded as a string                             |
| `singleChoice`   | One of an enumerated set of text values                         |
| `multipleChoice` | One or more of an enumerated set of text values                 |
| `workflow`       | Reference to a [`Workflow`](doc:the-workflows-entity-node)      |
| `instance`       | Reference to an [`Instance`](doc:the-instance-entity-node)      |
| `instructions`   | Read-only field for passing instructions to users               |
| `file`           | Reference to a [`File`](doc:the-file-entity-node)               |
| `table`          | Reference to a [`DataTable`](doc:the-data-table-entity-node)    |
| `user`           | Reference to a [`User`](doc:the-user-entity-node)               |

# Summary of Properties and Methods

## Instance Properties

| Name           | Type                | Description                                                                            |
| -------------- | ------------------- | -------------------------------------------------------------------------------------- |
| `id`           | `Guid`              | The unique ID of the Field                                                             |
| `name`         | `string`            | The descriptive name of the Field                                                      |
| `description`  | `string`            | A description of the Field, or instructions for filling out the Field in a form        |
| `fieldType`    | `FieldType`         | An enum representing the type of data held in the field.                               |
| `restrictions` | `FieldRestrictions` | May include a `string[]` `choices` for <br>`singleChoice` and `multipleChoice` fields. |
