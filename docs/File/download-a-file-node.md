# The Download Method

Download a File to a temporary file or a given directory or file.

> 👍 Permissions Required
>
> You must have permissions to read the field that the file was uploaded to for this request to succeed.

## Method Signature

```typescript
download(id: string, path: string): Promise<void>;
download(id: string, path: string, callback: (err?: Error) => any): void;
```

| Parameter  | Type                   | Description                                                                                                                        |
| ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | `string`               | The id of the File to download                                                                                                     |
| `path`     | `string`               | The path on disk to save the download to. The file's <br>original name will be preserved. Defaults to a local temporary directory. |
| `callback` | `(err?: Error) => any` | _Optional_ The callback                                                                                                            |

## Example

```js
/*
 * This example demonstrates downloading a File
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const id = 'c9f2beec-10c0-4f2f-b4e0-1d884c7e053c';
const fileDownloadPath = '/path/to/download/location/for/file';
await catalytic.files.download(id, fileDownloadPath);

console.log(`File downloaded to "${fileDownloadPath}"`);
```
