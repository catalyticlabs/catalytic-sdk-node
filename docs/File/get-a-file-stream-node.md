# The GetFileStream Method

Get a metadata and a readable stream of the contents of a File.

> 👍 Permissions Required
>
> You must have View permissions to the field this file was uploaded to for this request to succeed

## Method Signature

```typescript
getDownloadStream(id: string): Promise<Stream>;
getDownloadStream(id: string, callback: (err?: Error, stream: Stream) => any): void;
```

| Parameter  | Type                                                                                          | Description                                       |
| ---------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `id`       | `string`                                                                                      | The id of the File to get a readable stream of    |
| `callback` | `(err?: Error, stream: Stream) => any`                                                        | _Optional_ The callback                           |
| _returns_  | [`Stream`](https://nodejs.org/docs/latest-v12.x/api/stream.html#stream_class_stream_readable) | The requested file's metadata and readable stream |

## Example

```js
/*
 * This example demonstrates streaming a File's contents to
 * the Console
 */
const { CatalyticClient } = require('@catalytic/sdk');

const catalytic = new CatalyticClient('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');

const stream = await catalytic.files.getDownloadStream('c9f2beec-10c0-4f2f-b4e0-1d884c7e053c');

stream.on('data', chunk => console.log(chunk.toString()));
```
