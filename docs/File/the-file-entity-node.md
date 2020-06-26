# `FileMetadata`

The FileMetadata entity contains metadata about files uploaded to the Catalytic platform. Once uploaded, files can be deleted, but not modified.

### Common Properties

These are the most commonly used properties of a `FileMetadata`.

| Name          | Type      | Description                                                       |
| ------------- | --------- | ----------------------------------------------------------------- |
| `id`          | `string`  | The unique ID of the File                                         |
| `name`        | `string`  | The original name of the uploaded File                            |
| `teamName`    | `string`  | The name of the Catalytic team to which the File was uploaded     |
| `contentType` | `string`  | The content type of the File                                      |
| `sizeInBytes` | `int`     | The size of the File in bytes                                     |
| `displaySize` | `string`  | A human-readable version of the file size. E.g., `40 MB`          |
| `isPublic`    | `boolean` | Indicates where the file can be downloaded without authentication |
| `md5Hash`     | `string`  | The MD5 hash of the file's contents                               |
