# The Upload Method

Upload a one or more new Files to Catalytic.

<!--
> 🚧 Consider using CompleteStepRequest Instead
>
> If you are uploading files as part of completing a task, consider passing a `FileInfo` reference to `CompleteStepRequset.SetInput` instead. See [Complete an Instance Step](ref:complete-an-instance-step) for an example. -->

## Method Signature

```typescript
upload(filePath: string): Promise<FileMetadata>;
upload(filePath: string, callback: (err?: Error, fileMetadata: FileMetadata) => any): void;
```

| Parameter  | Type                                                | Description                        |
| ---------- | --------------------------------------------------- | ---------------------------------- |
| `filePath` | `string`                                            | The path to the file to upload     |
| _returns_  | [`FileMetadata`](doc:the-file-metadata-entity-node) | The metadata for the uploaded file |

## Example

```javascript
/*
 * This example demonstrates uploading a File to Cataltyic
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const filePath = '/path/to/file/to/upload';
const fileMetadata = await catalytic.files.upload(filePath);

console.log(`Uploaded file has ID "${fileMetadata.id}"`);
```
