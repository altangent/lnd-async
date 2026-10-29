# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`lnd-async` is a small npm library: a promise-based gRPC client for the Lightning Network Daemon (LND), built on `@grpc/grpc-js` + `@grpc/proto-loader`. There is no build step; `lib/` is shipped as-is (`main: lib/lnd-async`, `types: lib/lnd-async.d.ts`). It bundles the protos of several LND release lines (listed in `lib/versions.js`), ships TypeScript declarations generated from them, and has an opt-in strict request validation.

## Commands

```bash
npm install
npm test                       # mocha "test/**/*.spec.js" -r dotenv/config && tsc -p test/types
npm run test:types             # only the compile-time checks of the declarations
npm run generate-types         # regenerate lib/types/*.d.ts after changing protos or the generator
npx mocha test/offline.spec.js -g strict    # single file / tests by name
```

- `test/lnd-async.spec.js` hits a **real LND node** configured by `LND_ASYNC_TEST_LND_HOST`, `_LND_PORT`, `_MACAROON` (base64), `_MACAROON_PATH`, `_CERT` (base64), `_CERT_PATH`, `_NO_CERT=true` from a git-ignored `.env` (loaded via `-r dotenv/config`). It only checks that unary methods return a Promise and stream methods a stream, and passes even when the calls fail. Its method list is deliberately limited to read-only calls; **never add methods that change node state** (send, open/close channel, settle, etc.).
- `test/offline.spec.js` runs against a local grpc-js server (`test/helpers/mock-lnd.js`, TLS with a throwaway certificate made by `openssl`; that block is skipped without `openssl`, the client-surface and validator blocks run anyway). This is where end-to-end behaviour, `lndVersion` and strict mode are tested.
- `test/types-runtime.spec.js` parses the shipped `lib/types/lnd-<line>.d.ts` and checks every message of every line against what protobufjs 6 really decodes (which fields are always present, the kind of each default value); it also fails when `lib/types/` is out of date.
- `test/types/*.ts` are compile-only checks; lines marked `@ts-expect-error` must fail to compile.
- Keep the mocha glob quoted in `package.json`: unquoted, `sh` expands `test/**/*.js` like `test/*/*.js` and mocha gets only the files in subdirectories.
- No `lint` script. `.eslintrc` pins `ecmaVersion: 8`, so `npx eslint lib test` fails to parse every file with newer syntax (object spread, `for await`, BigInt literals in `lib/strict.js`); it is not a usable gate.
- Code in `lib/` must run on Node.js 12.10 (`engines`, the minimum of `@grpc/grpc-js` 1.14): no `?.`, `??`, `Object.hasOwn`, `.at()`, `replaceAll`, `fs.rmSync` there. Tests and `util-scripts/` may use a current Node.
- Style (`.prettierrc`, `.eslintrc`): 2 spaces, single quotes, semicolons, width 100; `npx prettier --write` works for `.js` files. The pinned prettier 1.19 cannot parse `import type`, so `.d.ts` files are formatted by hand. `lib/generate-all-api-object.js` is a dev script and does not follow this.
- The npm package is limited by `"files": ["lib"]` in `package.json`; anything outside `lib/` (tests, util-scripts, local files) is not published. Check `npm pack --dry-run` before publishing.

## Architecture

The call path is `lnd-async.js` → `lnd-rpc.js` → the line from `versions.js` (its `all-api.js` + `.proto` files).

- **`lib/versions.js`** lists the bundled LND lines (`'0.18'` ... `'0.21'`): LND tag, proto directory, `all-api.js`, declaration file. `defaultVersion` is used when `connect()` gets no `lndVersion` and must change only in a major release (0.21 removed RPCs such as `SendPaymentSync`). The default line keeps its legacy paths `lib/original-lnd-protos/` and `lib/all-api.js`; other lines live in `lib/lnd-<line>/protos/` and `lib/lnd-<line>/all-api.js`.
- **`lib/common.js`** maps `lndVersion` to a line (`resolveLndVersion` also accepts `'0.21.5-beta'`, `'v0.21.5-beta'` and GetInfo's `version`) and builds per-line data in `getLine()`: method lists per service and the lookup sets (`streamApis`/`callbackApis` for the flat surface, `allStreamApi`/`allCallbackApi` keyed `Service.method`). Its top-level exports of those sets and `allApi` describe the default line, as before. Stream vs. promise is decided by `all-api.js`, not by grpc metadata; a method not listed there is absent from the client.
- **`lib/lnd-rpc.js`** builds credentials (TLS cert from path or base64, or `noCert` for a publicly-signed cert; macaroon from path or base64 sent as hex `macaroon` metadata, skipped with `noMacaroons`), then loads **every** proto of the line and instantiates one grpc-js client per service against the same `host:port`. Loader options matter to callers and to the declarations: `keepCase: true` (fields stay snake_case, e.g. `r_hash`), `enums: String`, `defaults: true`, `oneofs: true`, and `longs: String` unless `longsAsNumbers` is set. Service constructors are cached per line and `longs` type. Google API annotation protos are resolved from the `protobufjs` package directory via `includeDirs`.
- **`lib/lnd-async.js`** wraps the raw clients into the object returned by `connect()` and exports `supportedLndVersions`, `defaultLndVersion`, `ValidationError`. It passes the caller's options object to `lnd-rpc.js` as is: a copy (`{ ...opts }`) would lose options defined by getters or a prototype, and `lnd-rpc.js` would silently fall back to `localhost` and the default admin macaroon.
  - `client.<method>`: a flat legacy surface holding the methods of the `Lightning`, `WalletUnlocker` and `State` services only.
  - `client.<ServiceName>.<method>`: every service, keyed by **service name** (`client.Router`, `client.Invoices`, `client.WalletKit`, `client.WatchtowerClient`...), not by proto package.
  - `client.lnrpc`: the raw grpc-js clients (`services` for the legacy three, `allServices` for all).
  - Unary RPCs are `promisify`-ed; streaming RPCs are returned bound but unwrapped (caller gets a grpc stream). Methods are exposed as `lowerCamelCase(rpc name)` (`deleteMacaroonID`) and looked up on the grpc-js client by the rpc name, in the client's own order, because the lowerCamelCase alias grpc-js adds comes from lodash `camelCase` (`deleteMacaroonId`).
- protobufjs 6 decodes the keys of 64-bit-keyed maps (`custom_records`) into 8-character binary strings; this is long-standing runtime behaviour, documented in the README and in the declarations, not changed.
- **`lib/strict.js`** (`connect({ strict: true })`) validates each request against its message type, loaded with protobufjs 6 per line, and throws `ValidationError` (unknown fields, types, ranges, enum values, maps, nested paths). Unary methods reject, streaming ones throw, bidirectional streams get a checking `write()` and `end(message)`. Without `strict` the methods are exactly the bound/promisified grpc-js functions.
- **`lib/all-api.js` (and `lib/lnd-<line>/all-api.js`) are generated, do not hand-edit.** `lib/generate-all-api-object.js` regex-parses each `.proto` for `package`, `service` and `rpc X (...) returns (stream ...)` (handles a signature split over two lines). Keys are paths relative to the proto directory (e.g. `routerrpc/router.proto`), walked in sorted order so the output is deterministic and its diff shows only API changes. It assumes **one service per proto file** (throws otherwise) and drops files without a service (e.g. `lnclipb/lncli.proto`).

## TypeScript declarations

- `lib/lnd-async.d.ts` is hand-written: `ConnectOptions`, `connect<V, N>()` (generic over `lndVersion` and `longsAsNumbers`, so a literal option narrows the client type and a variable typed `ConnectOptions`, even with extra fields, gives the union), `LndClient`, `ValidationError`. `lib/types/common.d.ts` holds the shared helpers (`Unary`, `ServerStream`, `Bidi`, typed `data` events).
- `lib/types/lnd-<line>.d.ts` and `lib/types/index.d.ts` are **generated** by `util-scripts/generate-types.js`, do not hand-edit. Per message `Foo` (request: all optional, permissive scalars) and `Foo__Output<L>` (response: fields present per `defaults: true`, `L` = type of 64-bit integers); `Services<L>` and `LegacyMethods<L>` mirror `lib/lnd-async.js`. The generator also cross-checks `all-api.js` against the protos and throws on a mismatch.
- The generator reads protos with **protobufjs 7** (dev dependency alias `protobufjs-7`), because the comment mode of protobufjs 6 fails on LND protos. The runtime stays on protobufjs 6 through `@grpc/proto-loader` 0.5; `test/types-runtime.spec.js` keeps the two in agreement.

## Updating to a new LND version

Protos are verbatim copies of `lnrpc/` from the LND repo, one directory per line (see `lib/versions.js`).

```bash
git -C /path/to/lnd checkout v0.21.5-beta
./util-scripts/run-all.sh /path/to/lnd 0.21   # copy protos + all-api.js of the line, regenerate all declarations
```

`run-all.sh` refuses to run when the checkout is not at the tag recorded in `lib/versions.js`; to move a line to a new patch release, change its `lndTag` first. A new line is a new entry in `lib/versions.js` (then update the line lists in `test/offline.spec.js` and `README.md`). `copy-proto-files.sh` rsyncs only `*.proto` with `--delete`; `generate-all-api-object.sh` must run from the repo root. After regenerating, check the `all-api.js` diff for new or removed services, since a new proto file with a service automatically becomes a new `client.<ServiceName>` namespace, and run `npm test`. Release commits then bump `version` in `package.json`, update the LND lines in `README.md`, and add an entry to its `## Versions` list. Versioning rule: adding a line or moving a line to a newer patch release is a minor version; changing `defaultVersion` is a major version (a newer line may remove RPCs, and an unknown request field is dropped silently).
