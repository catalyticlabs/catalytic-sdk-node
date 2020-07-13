The `AccessToken` class represents authorization to use the SDK as a specific, authenticated user. See [Authentication](doc:authentication-node) for more details and examples.

# Summary of Properties and Methods

## Static Properties

| Name                       | Type          | Description                                                                                             |
| -------------------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| `default`                  | `AccessToken` | Attempt to load and return an Access Token from the default env var or file location                    |
| `DEFAULT_ACCESS_TOKEN_DIR` | `string`      | Gets the default path for saved Access Token files. Resolves to `$HOME/.catalytic/tokens` or equivalent |

## Static Methods

| Name                                                                | Return Type                             | Description                                                                         |
| ------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------- |
| [`fromFile`](#the-fromfile-static-method)                           | `AccessToken`                           | Attempt to load and return an Access Token from a file                              |
| [`fromString`](#the-fromstring-static-method)                       | `AccessToken`                           | Deserialize an Access Token from a serialized Access Token string                   |
| [`fromEnv`](#the-fromenv-static-method)                             | `AccessToken`                           | Deserialize an Access Token from the `CATALYTIC_TOKEN`<br>env var                   |
| [`listAccessTokens`](#the-listaccesstokens-static-method)           | `Dictionary`<br>`<string, AccessToken>` | Lists all Access Tokens stored as files in the given path<br>or in the default path |
| [`deleteAccessTokenFile`](#the-deleteaccesstokenfile-static-method) | `void`                                  | Delete an Access Token file                                                         |

## Constructor

```js
const { AccessToken } = require('@catalytic/sdk');
const accessToken = new AccessToken('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');
```

| Parameter | Type     | Description                                                                                 |
| --------- | -------- | ------------------------------------------------------------------------------------------- |
| `token`   | `string` | The serialized Access Token string, available on creation of new Access Token via UI or SDK |

## Instance Properties

| Name          | Type     | Description                                                                  |
| ------------- | -------- | ---------------------------------------------------------------------------- |
| `name`        | `string` | The name of the AccessToken                                                  |
| `id`          | `string` | The unique ID of the AccessToken                                             |
| `secret`      | `string` | The deserialized secret of the AccessToken                                   |
| `domain`      | `string` | The Domain of the Catalytic team with which these AccessToken are associated |
| `token`       | `string` | The serialized AccessToken Token                                             |
| `environment` | `string` | The environment of the Catalytic team associated with the AccessToken        |
| `owner`       | `string` | The email address of the user to whom these AccessToken belong               |
| `type`        | `string` | The type of the AccessToken. Possible values include only 'user', currently  |

## Instance Methods

| Name                                            | Return Type | Description                                                                         |
| ----------------------------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| [`saveToFile`](#the-savetofile-instance-method) | `void`      | Saves the serialized AccessToken to a file, allowing for easy loading in the future |

# Constructors

AccessTokens can be constructed by passing the serialized AccessToken string to the `AccessToken` constructor. See [Authentication](doc:authentication-node) for more details on accessing the serialized AccessToken string.

```typescript
AccessToken(token: string)
```

```js
const accessToken = new AccessToken('YOUR_SERIALIZED_ACCESS_TOKEN_STRING');
```

# The `fromFile` Static Method

Load an Access Token by name from the default Access Token directory, a given directory or a specific file location. The default directory is `AccessToken.DEFAULT_ACCESS_TOKEN_DIR`, which will be `$HOME/.catalytic/tokens` or the equivalent depending on the OS.

## Method Signature

```typescript
fromFile(fileNameOrPath: string): AccessToken;
```

| Parameter        | Type          | Description                                                                                                                                                                                                                              |
| ---------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fileNameOrPath` | `string`      | The file name or file path of the Access Token on disk. If provided value<br /> does not resolve to a file on disk, the value will interpreted as a filename within the<br /> default AccessTokens directory (`$HOME/.catalytic/tokens`) |
| _returns_        | `AccessToken` | The deserialized Access Token                                                                                                                                                                                                            |

# The `fromEnv` Static Method

Deserializes an Access Token from a token string stored in the `CATALYTIC_TOKEN` env var.

## Method Signature

```typescript
static AccessToken fromEnv()
```

| Parameter | Type          | Description                   |
| --------- | ------------- | ----------------------------- |
| _returns_ | `AccessToken` | The deserialized Access Token |

# The `listAccessTokens` Static Method

Gets all Access Tokens stored in a given directory, or in the default Access Token directory if none is specified. The default directory is `AccessToken.DEFAULT_ACCESS_TOKEN_DIR`, which will be `$HOME/.catalytic/tokens` or the equivalent depending on the OS.

## Method Signature

```typescript
listAccessTokens(accessTokensDirectory?: string): { [accessTokenName: string]: AccessToken }
```

| Parameter               | Type                          | Description                                                                                                  |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `accessTokensDirectory` | `DirectoryInfo`               | _Optional_ Access Token directory, defaults to<br> `AccessToken.DEFAULT_ACCESS_TOKEN_DIR`                    |
| _returns_               | `Object<string, AccessToken>` | An object containing the deserialized Access Tokens in the given (or default) directory, keyed by file name. |

# The `deleteAccessTokenFile` Static Method

Deletes saved Access Token. Note that this does not permanently revoke the Access Token. To permanently revoke an Access Token, use the Catalytic Web App

## Method Signature

```typescript
deleteAccessTokenFile(fileNameOrPath: string): void;
```

| Parameter        | Type     | Description                                                                                                                                                                                                                              |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fileNameOrPath` | `string` | The file name or file path of the Access Token on disk. If provided value<br /> does not resolve to a file on disk, the value will interpreted as a filename within the<br /> default AccessTokens directory (`$HOME/.catalytic/tokens`) |

# The `saveToFile` Instance Method

Saves an Access Token to a file, allowing for load via `AccessToken.fromFile`. Throws `AccessTokenNameConflictException` if the file already exists.

```typescript
public saveToFile(fileName: string): void;
public saveToFile(fileName: string, directoryPath: string): void;
```

| Parameter       | Type     | Description                                                                                        |
| --------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `fileName`      | `string` | The name of the Access Token file                                                                  |
| `directoryPath` | `string` | _Optional_ Path to Access Tokens directory, defaults to<br> `AccessToken.DEFAULT_ACCESS_TOKEN_DIR` |
