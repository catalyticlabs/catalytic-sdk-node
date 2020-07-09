# The Get Method

Get metadata for a File by ID.

> 👍 Permissions Required
>
> You must have View permissions to the field this file was uploaded to for this request to succeed

## Method Signature

```typescript
get(id: string): Promise<FileMetadata>;
get(id: string, callback: (err?: Error, file: FileMetadata) => any): void;
```

| Parameter  | Type                                                | Description                 |
| ---------- | --------------------------------------------------- | --------------------------- |
| `id`       | `string`                                            | The id of the File to get   |
| `callback` | `(err?: Error, file: FileMetadata) => any`          | _Optional_ The callback     |
| _returns_  | [`FileMetadata`](doc:the-file-metadata-entity-node) | The requested file metadata |

## Example

```js
/*
 * This example demonstrates getting a File's metadata by ID
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const fileMetadata = await catalytic.files.get('c9f2beec-10c0-4f2f-b4e0-1d884c7e053c');
console.log(`Name: ${fileMetadata.name}`);
console.log(`Size: ${fileMetadata.displaySize}`);
console.log(`Content-Type: ${fileMetadata.contentType}`);
```
