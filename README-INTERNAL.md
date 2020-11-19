# `catalytic-sdk-node` Internal ReadMe

## Documentation

Documentation is published at [developers.catalytic.com](https://developers.catalytic.com/docs/catalytic-sdk-node). The docs are hosted on [ReadMe.io](https://dash.readme.io/project/catalytic-developer/v1.0/docs/catalytic-sdk-node), but versions of the docs are also [in this git repo](https://github.com/catalyticlabs/catalytic-sdk-node/tree/master/docs), since editing local Markdown can be easier than updating on ReadMe.io, though both methods are supported.

### Editing on ReadMe.io

Make the desired edits to the desired page of documentation in [ReadMe.io](https://dash.readme.io/project/catalytic-developer/v1.0/docs/catalytic-sdk-node) and click `Save`. Changes are immediately published.

### Editing docs locally

**Compare Local Versions to Published Versions**

_`npm run docs:compare [docName...]`_

Run `npm run docs:compare` to check if the local versions of docs are in sync with the published versions.

```
$ npm run docs:compare

✅ the-instance-entity-node
✅ the-instance-step-entity-node
❌ find-instance-steps-node
...
```

Provide document name(s) to check the status of one or more specific docs:

```
$ npm run docs:compare the-instance-entity-node

✅ the-instance-entity-node
```

**Update Local Versions to match Published Versions**

_`npm run docs:pull [docName...]`_

```
$ npm run docs:pull

✅ the-instance-entity-node
✅ the-instance-step-entity-node
🔄 find-instance-steps-node
...
```

Provide document name(s) to pull one or more specific docs:

```
$ npm run docs:pull the-instance-entity-node

✅ the-instance-entity-node
```

**Publish Local Changes**

_`npm run docs:push [docName...]`_

```
$ npm run docs:push

⬆️ the-instance-entity-node
⬆️ the-instance-step-entity-node
⬆️ find-instance-steps-node
...
```

Provide document name(s) to publish one or more specific docs:

```
$ npm run docs:push the-instance-entity-node

⬆️ the-instance-entity-node
```

## Regenerate

Run `npm run swagger` to regenerate the internal SDK based on the `BaseUri` value in `src/constants.ts`.

## Testing

Run `npm test` to run tests. No build step required.

## Publishing

This SDK is published to npm as [`@catalytic/sdk`](https://www.npmjs.com/package/@catalytic/sdk).

1. Checkout a new `release/v{version}` branch;
    - Update version in the `package.json` and `src/constants.ts`
    - Commit with message `v{version}`,
2. Open PR and merge to `master`
3. Pull master locally
4. Run `git tag v{version} && git push --tags` to publish git tag
5. Run `npm publish` _The prepublish script automatically lints/tests/builds before publishing, so you don’t need to worry about doing that locally._
