# lnd-async

This library simplifies connecting to the Bitcoin Lightning Network Daemon via gRPC. It wraps all callback functions in promises to make api calls easier to work with.

This library bundles the protos of LND 0.18, 0.19, 0.20 and 0.21 and uses 0.20 (v0.20.6-beta) unless told otherwise, see [Choosing the LND version](#choosing-the-lnd-version). It ships [TypeScript](#typescript) declarations and an optional [strict mode](#strict-mode) that validates requests before they are sent.

The default behavior assumes LND is running on `localhost` port `10009`. It also assumes that macaroons are enabled and the `tls.cert` and `admin.macaroon` are found in the OS specific default data paths.

To establish a connection to gRPC `localhost:10009` with macaroons:

```javascript
const lnd = require('lnd-async');

async function getInfo() {
  let client = await lnd.connect();
  return await client.getInfo({});
}
```

This call can be customized to meet your specific needs:

```javascript
const lnd = require('lnd-async');

async function getInfo() {
  let client = await lnd.connect({
    lndHost: '10.10.0.12',
    lndPort: 10019,
    certPath: __dirname + '/tls.cert',
    macaroonPath: __dirname + '/admin.macaroon',
  });
  return await client.getInfo({});
}
```

You can also specify `cert` and `macaroon` as base64 encoded string. Usefull if you do not want to keep them on the server. To do this you can do it buy commands like `base64 -w 0 /path/to/lnd/data/tls.cert; echo` for `cert` or `base64 -w 0 /path/to/lnd/data/admin.macaroon; echo` for `macaroon`.

```javascript
const lnd = require('lnd-async');

async function getInfo() {
  let client = await lnd.connect({
    lndHost: '10.10.0.12',
    lndPort: 10019,
    cert: 'base64 cert',
    macaroon: 'base64 macaroon',
  });
  return await client.getInfo({});
}
```

You can also initiate calls with no macaroons by passing the `noMacaroons` flag. When this option is supplied, the `macaroonPath` is ignored.

```javascript
const lnd = require('lnd-async');

async function getInfo() {
  let client = await lnd.connect({ noMacaroons: true });
  return await client.getInfo({});
}
```

You can also connect using a TLS server certificate signed by public certificate authorities by passing the `noCert` flag. When this option is supplied, the `certPath` (and `cert`) is ignored.
```javascript
const lnd = require('lnd-async');

async function getInfo() {
  let client = await lnd.connect({ noCert: true });
  return await client.getInfo({});
}
```

### How work with services

By default the `lnd-async` uses `Lightning` service but you can call certain methods of other services:

```javascript
// The "Invoices" service for example:
await client.Invoices.settleInvoice({preimage})

// The default "Lightning" service:
await client.connectPeer({addr: {pubkey, host}, perm: false})

// The stream method:
const grpc = require('@grpc/grpc-js')
let stream = client.Invoices.subscribeSingleInvoice({r_hash: hash})

stream.on('data', async data => {
    try {
        if (data.state === 'ACCEPTED' && accepted) {
            await accepted()
        }
        else if (data.state === 'SETTLED' && settled) {
            await settled()
            stream.cancel()
        }
        else if (data.state === 'CANCELED' && canceled) {
            await canceled()
            stream.cancel()
        }
    }
    catch (e) {
        console.error('error in data event of stream: %s', e.message)
    }
})
stream.on('error', (e) => {
    // If e.code === grpc.status.CANCELLED - it's normal cancel state of stream
    if (e.code !== grpc.status.CANCELLED) {
        error(e)
    }
})
```

### Long integer treatment

The JavaScript Number type internally stores values as IEEE 754 floating point values. The max safe integer value is 2^53-1 which can result in data loss for 64-bit integers.

**By default and for maximum portability, long values are returned as strings.** This allows the consumer of the data to convert the long integers using any big number library they prefer.

`grpc-node` has [accomodations](https://github.com/dcodeIO/protobuf.js/blob/master/README.md#compatibility) for automatic number type conversion to [`Long.js`](https://github.com/dcodeIO/long.js). If you do not install `Long.js`, longs will be treated as JavaScript `Number` type and data loss may occur.

`lnd-async` allows customization of this handling via the setting `longsAsNumbers`. Setting this value to `true` will pass the `Number` setting in `grpc-node`. By default, this value is set to false to prevent data loss.

```javascript
const lnd = require('lnd-async');

async function getInfo() {
  let client = await lnd.connect({ longsAsNumbers: true });
  return await client.getInfo({});
}
```

### Choosing the LND version

Every LND release line changes the API: RPCs and fields are added, deprecated ones are eventually removed (LND 0.21 removed `SendPaymentSync`, `SendToRouteSync`, `Router.TrackPayment`, `outgoing_chan_id` of `SendPaymentRequest` and others). `lnd-async` bundles the protos of several lines and uses the one passed as `lndVersion`:

| `lndVersion` | Protos of |
| --- | --- |
| `'0.18'` | v0.18.5-beta |
| `'0.19'` | v0.19.3-beta |
| `'0.20'` (default) | v0.20.6-beta |
| `'0.21'` | v0.21.5-beta |

LND 0.21 is available on request (`lndVersion: '0.21'`); the default stays 0.20 until lnd-async 6.0.0.

```javascript
const lnd = require('lnd-async');

let client = await lnd.connect({ lndVersion: '0.21' });
await client.sendOnionMessage({ peer, onion }); // added in 0.21
client.sendPaymentSync;                         // undefined: removed in 0.21
```

Without `lndVersion` the default line is used, so existing code works as before. New lines are added in minor versions of `lnd-async` (5.1.0, 5.2.0, ...) and never change the default; the default line changes only in a new major version, because a newer LND line may remove RPCs and fields. **Pass `lndVersion` explicitly** to make your code independent of the default. The list of lines is available as `lnd.supportedLndVersions`, the default as `lnd.defaultLndVersion`.

A full version string is accepted as well (`'0.21.5-beta'`, `'v0.21.5-beta'` or the `version` returned by `getInfo`), so the protos can follow the node:

```javascript
let options = { lndHost: '10.10.0.12', macaroonPath: __dirname + '/admin.macaroon' };
let probe = await lnd.connect(options);
let { version } = await probe.getInfo({});
Object.values(probe.lnrpc.allServices).forEach(service => service.close());
let client = await lnd.connect({ ...options, lndVersion: version }); // rejects if the line is not bundled
```

Use the line of your node. Protobuf messages are compatible across versions, but an RPC the node does not have fails with `UNIMPLEMENTED`, and a request field the bundled protos do not know is dropped without an error.

### TypeScript

The package includes declarations for every service, method and message of every bundled line. There is nothing to install or enable, and JavaScript code is not affected.

```typescript
import { connect, type lnrpc } from 'lnd-async';

const client = await connect({ lndHost: '10.10.0.12', macaroonPath: '/path/to/admin.macaroon' });
const info = await client.getInfo({});
info.block_height;          // number
info.best_header_timestamp; // string: 64-bit integers are strings by default

await client.addInvoice({ value: 1000, memo: 'coffee' });
await client.addInvoice({ valeu: 1000 }); // error: 'valeu' does not exist in type 'Invoice'. Did you mean to write 'value'?

client.subscribeInvoices({}).on('data', (invoice: lnrpc.Invoice__Output) => invoice.r_hash.toString('hex'));
```

- For a message `Foo` there are two types. `Foo` is what a request accepts: every field is optional, 64-bit integers may be a number, a decimal string or a `Long`, `bytes` a `Buffer`, a `Uint8Array` or a base64 string, enums a name or a number. `Foo__Output` is what a response contains: every field is present (unset ones hold the proto default), an unset message field is `null`, the members of a `oneof` are optional and a property named after the `oneof` tells which one is set, 64-bit integers are strings, `bytes` are `Buffer`s and enums are names.
- Field names are the snake_case names of the protos, as at runtime.
- The comments of the LND protos are included, and deprecated fields and RPCs are marked `@deprecated`.
- The client type follows the options: `connect({ lndVersion: '0.21' })` has no `sendPaymentSync`, `connect({ longsAsNumbers: true })` returns 64-bit integers as `number`.
- The message types of the default line are exported as `lnrpc`, `routerrpc`, `invoicesrpc` and so on, the ones of every line as `Lnd0_18`, `Lnd0_19`, `Lnd0_20`, `Lnd0_21` (`Lnd0_21.lnrpc.Invoice__Output`).
- Responses of streams are typed in `data` events and in `for await`.
- `double` and `float` request fields accept numbers only, although protobufjs would also convert a string.
- TypeScript 4.7 or newer is required (checked with 4.7, 5.0, 5.9 and 7.0).

TypeScript checks object literals written in the code. Requests built from JSON or a configuration file are checked only at runtime, in strict mode.

### Strict mode

protobufjs, which encodes the requests, is forgiving: unknown fields are dropped, values are converted, and an unknown enum name becomes the first value of the enum. For example `{ action: 'ACCEPT' }` written to `Router.htlcInterceptor` is sent as `SETTLE`. With `strict: true` every request is checked against its message type before it is sent:

```javascript
let client = await lnd.connect({ strict: true });
await client.addInvoice({ valeu: 1000 });
// ValidationError: lnrpc.Invoice.valeu: unknown field (did you mean "value"?)
```

Strict mode rejects unknown fields, values of the wrong type, integers out of the range of their field (numbers beyond 2^53 must be passed as decimal strings), `bytes` that are neither a `Buffer`/`Uint8Array` nor standard base64, unknown enum values, and more than one member of a `oneof`, in nested messages, arrays and maps too. The error tells where the problem is, e.g. `routerrpc.SendPaymentRequest.route_hints[0].hop_hints[0].fee_base_msat`. A unary call rejects with `lnd.ValidationError` (a `TypeError`), a streaming call throws, and each `write()` to a bidirectional stream is checked. Nothing is sent when a request is rejected. Responses are not checked.

### 64-bit map keys

protobufjs, which decodes the responses, turns the keys of maps with 64-bit integer keys (such as `custom_records` of a `Hop` or an `InvoiceHTLC`) into 8-character binary strings, the bytes of the number with the least significant first, instead of decimal strings. Convert such a key before using it, and before sending it back in a request:

```javascript
const decimalKey = key => [...key].reduceRight((n, c) => (n << 8n) | BigInt(c.charCodeAt(0)), 0n).toString();

for (let [key, value] of Object.entries(hop.custom_records)) console.log(decimalKey(key), value);
```

Sent back unconverted, every such key becomes 0 (strict mode rejects it instead). The TypeScript declarations note this on each affected field.

## Versions

- 5.0.0 - TypeScript declarations for all services and messages,
          bundled protos of LND 0.18, 0.19, 0.20 and 0.21 with the `lndVersion` option of `.connect()` (default: 0.20, as before),
          opt-in `strict` validation of requests,
          `deleteMacaroonID` and `registerRPCMiddleware` are now available on the client (they were missing because of their capital letters),
          requires Node.js 12.10 or newer (as `@grpc/grpc-js` does).
          A major version because it is the first npm release after 4.2.2: it brings the move from `grpc` to `@grpc/grpc-js` (4.2.4)
          and the newer LND protos of 4.2.3 and 4.3.1, and TypeScript projects now get type checking of their calls
- 4.3.1 - Updated the protocol in accordance with LND v0.20.6-beta,
          the npm package now contains only `lib/` (plus `README.md`, `LICENSE`, `package.json`)
- 4.2.4 - Migrated from `grpc` to `@grpc/grpc-js`, added `noCert` option to `.connect()`, updated real-connection tests to avoid dangerous LND commands
- 4.2.3 - Updated the protocol in accordance with LND v0.18.5-beta
- 4.2.2 - Updated the protocol in accordance with LND v0.18.0-beta
- 4.2.1 - Updated the protocol in accordance with LND v0.17.0-beta
- 4.2.0 - Updated the protocol in accordance with LND v0.16.2-beta,
          Mocha-based tests can be run with any parameters in the developer's .env file,
          Bugs have been fixed based on the tests,
          Updated dependencies to new ones with no known vulnerabilities
- 4.1.3 - Updated for v0.13.1-beta, all proto services + the update of doc
- 4.1.0 - Updated for v0.11.1-beta, now includes all proto services
- 4.0.0 - Updated for 0.8.1-beta, now includes all proto services
- 3.0.0 - Support for 0.8.0-beta
- 2.0.0 - Support for 0.7.1-beta, switching to valid SEMVER release format
- 1.8.0 - Support for 0.6.1-beta
- 1.7.0 - Add `longsAsNumbers` option
- 1.6.0 - Support for 0.5.2-beta
- 1.5.0 - Support for 0.5-beta
- 1.4.0 - Support for base64 macaroon and cert files
- 1.3.0 - Support for 0.4.2-beta
- 1.2.0 - Support for 0.4.1-beta
- 1.1.0 - Support for 0.4.0-beta
