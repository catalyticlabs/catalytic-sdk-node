You can upload and download spreadsheets to and from the Catalytic platform as Data Tables. You can then reference those imported Data Tables in Fields in Workflows and Instances.

> 📘 Learn more about Data Tables
>
> Data Tables are a powerful and flexible part of the Catalytic platform. To learn more, see the [Data Tables section of our Help documentation](https://help.catalytic.com/docs/data-tables/).

# Methods

The `dataTables` client allows you to upload and download files from the Catalytic platform, and to get file metadata like size, content-type and filename. It provides the following methods:

| Method                                                        | Description                                    |
| ------------------------------------------------------------- | ---------------------------------------------- |
| [`get`](doc:get-a-data-table-node)                            | Gets metadata of a Data Table by `id`          |
| [`find`](doc:find-data-table-node)                            | Search for Data Tables by `name`               |
| [`download`](doc:download-a-data-table-node)                  | Downloads a File by `id`                       |
| [`getFileStream`](doc:get-a-file-stream-of-a-data-table-node) | Gets a readable stream of a Data Table by `id` |
| [`upload`](doc:upload-a-spreadsheet-as-a-data-table-node)     | Uploads a new Data Table                       |
| [`replace`](doc:replace-a-data-table-node)                    | Replaces an existing Data Table                |
