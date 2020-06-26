The `AccessToken` class represents authorization to use the SDK as a specific, authenticated user. See [Authentication](doc:authentication-node) for more details and examples.

# Summary of Properties and Methods

## Static Properties

> 🚧 Static properties not yet implemented

| Name                          | Type          | Description                                                                                             |
| ----------------------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| `default`                     | `AccessToken` | Attempt to load and return an Access Token from the default env var or file location                    |
| `hasDefault`                  | `bool`        | Check whether or not default a Access Token is configured                                               |
| `defaultAccessTokenDirectory` | `string`      | Gets the default path for saved Access Token files. Resolves to `$HOME/.catalytic/tokens` or equivalent |

## Static Methods

> 🚧 Static methods not yet implemented

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

> 🚧 Instance methods not yet implemented

| Name                                | Return Type | Description                     |
| ----------------------------------- | ----------- | ------------------------------- |
| [`save`](#the-save-instance-method) | `void`      | Saves the AccessToken to a file |

# Constructors

`AccessToken` instances should not be created directly via the constructor. Instead they should be deserialized with one of the [`fromFile`](#fromFile), [`fromString`](#fromString) or [`fromEnv`](#fromEnv) static methods, or from one of the [Create an Access Token](doc:create-an-access-token-node) methods on the [`AccessTokens`](doc:access-tokens-node) service client.

# The `fromFile` Static Method

Load an Access Token by name from the default Access Token directory, a given directory or a specific file location. The default directory is `AccessToken.defaultAccessTokensDirectory`, which will be `$HOME/.catalytic/tokens` or the equivalent depending on the OS.

## Method Signature

```typescript
fromFile(accessTokenName: string, accessTokenDirectory?: string): AccessToken;
```

| Parameter              | Type          | Description                                                                                            |
| ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `accessTokenName`      | `string`      | The name of the Access Token file to load                                                              |
| `accessTokenDirectory` | `string`      | _Optional_ Path to Access Tokens directory, defaults to<br> `AccessToken.defaultAccessTokensDirectory` |
| _returns_              | `AccessToken` | The deserialized Access Token                                                                          |

```typescript
fromFile(accessTokenPath: string): AccessToken;
```

| Parameter         | Type          | Description                                |
| ----------------- | ------------- | ------------------------------------------ |
| `accessTokenFile` | `string`      | Path to the file to load Access Token from |
| _returns_         | `AccessToken` | The deserialized AccessToken               |

# The `fromToken` Static Method

Deserializes an Access Token from a token string. Token strings can be copied when a new User Access Token is first created in the Catalytic Web App. See [Authentication](doc:authentication-2) for details.

This method can be used to instantiate an Access Token from a token string you have stored somewhere like Azure Key Vault, Hashicorp Vault or AWS Secrets Manager.

## Method Signature

```typescript
fromString(serializedAccessToken: string): AccessToken;
```

| Parameter               | Type          | Description                   |
| ----------------------- | ------------- | ----------------------------- |
| `serializedAccessToken` | `string`      | The serialized Access Token   |
| _returns_               | `AccessToken` | The deserialized Access Token |

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

Gets all Access Tokens stored in a given directory, or in the default Access Token directory if none is specified. The default directory is `AccessToken.defaultAccessTokensDirectory`, which will be `$HOME/.catalytic/tokens` or the equivalent depending on the OS.

## Method Signature

```typescript
listAccessTokens(accessTokensDirectory?: string): { [accessTokenName: string]: AccessToken }
```

| Parameter               | Type                              | Description                                                                                   |
| ----------------------- | --------------------------------- | --------------------------------------------------------------------------------------------- |
| `accessTokensDirectory` | `DirectoryInfo`                   | _Optional_ Access Token directory, defaults to<br> `AccessToken.defaultAccessTokensDirectory` |
| _returns_               | `Dictionary<string, AccessToken>` | All the deserialized Access Tokens in the given (or default) directory, by name.              |

# The `deleteAccessTokenFile` Static Method

Deletes saved Access Token.

## Method Signature

```typescript
deleteAccessTokenFile(accessTokenName: string, accessTokensDirectory?: string): void;
```

| Parameter               | Type            | Description                                                                                    |
| ----------------------- | --------------- | ---------------------------------------------------------------------------------------------- |
| `accessTokenName`       | `string`        | The name of the Access Token file to delete                                                    |
| `accessTokensDirectory` | `DirectoryInfo` | _Optional_ Access Tokens directory, defaults to<br> `AccessToken.defaultAccessTokensDirectory` |

# The `save` Instance Method

Saves an Access Token to a file. Throws `AccessTokenNameConflictException` if the file already exists.

## Method Signature

```typescript
save(accessTokenName: string = "default", accessTokensDirectory?: string): void;
```

| Parameter               | Type     | Description                                                                                    |
| ----------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `accessTokenName`       | `string` | The name of the file in which the serialized Access Token will be saved                        |
| `accessTokensDirectory` | `string` | _Optional_ Access Tokens directory, defaults to<br> `AccessToken.defaultAccessTokensDirectory` |

```typescript
save(accessTokenFile: string): void;
```

| Parameter         | Type     | Description                                                         |
| ----------------- | -------- | ------------------------------------------------------------------- |
| `accessTokenFile` | `string` | Path to the file in which the serialized Access Token will be saved |
