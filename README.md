# lnd-async

This library simplifies connecting to the Bitcoin Lightning Network Daemon via gRPC. It wraps all callback functions in promises to make api calls easier to work with.

This library supports LND version 0.17.0-beta.

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

### How work with services

By default the `lnd-async` uses `Lightning` service but you can call certain methods of other services:

```javascript
// The "Invoices" service for example:
await client.Invoices.settleInvoice({preimage})

// The default "Lightning" service:
await client.connectPeer({addr: {pubkey, host}, perm: false})

// The stream method:
const grpc = require('grpc')
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

## Versions

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
