# lnd-async

This library simplifies connecting to the Bitcoin Lightning Network Daemon via gRPC. It wraps all callback functions in promises to make api calls easier to work with.

This library supports LND version 0.5-beta.

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

You can also specify `cert` and `macaroon` as base64 encoded string. Usefull if you do not want to keep them on the server.

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

- 1.7.0 - Add `longsAsNumbers` option
- 1.6.0 - Support for 0.5.2-beta
- 1.5.0 - Support for 0.5-beta
- 1.4.0 - Support for base64 macaroon and cert files
- 1.3.0 - Support for 0.4.2-beta
- 1.2.0 - Support for 0.4.1-beta
- 1.1.0 - Support for 0.4.0-beta
