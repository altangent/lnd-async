// A local gRPC server with the services of a bundled LND line, for tests that must not depend
// on a real node. It listens on 127.0.0.1 with a throwaway self-signed certificate.
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const grpc = require('@grpc/grpc-js');
const { loadSync } = require('@grpc/proto-loader');
const { getLine } = require('../../lib/common');

/** Creates an ECDSA certificate for localhost (lnd-rpc.js limits TLS to ECDSA suites). */
function createCertificate() {
  let dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lnd-async-test-'));
  try {
    execFileSync(
      'openssl',
      [
        'req',
        '-x509',
        '-newkey',
        'ec',
        '-pkeyopt',
        'ec_paramgen_curve:prime256v1',
        '-nodes',
        '-keyout',
        path.join(dir, 'tls.key'),
        '-out',
        path.join(dir, 'tls.cert'),
        '-days',
        '1',
        '-subj',
        '/CN=localhost',
        '-addext',
        'subjectAltName=DNS:localhost,IP:127.0.0.1',
      ],
      { stdio: 'ignore' }
    );
    return {
      key: fs.readFileSync(path.join(dir, 'tls.key')),
      cert: fs.readFileSync(path.join(dir, 'tls.cert')),
    };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function serviceDefinitions(lndVersion) {
  let line = getLine(lndVersion);
  let definitions = {};
  for (let [file, proto] of Object.entries(line.api)) {
    let packageDefinition = loadSync(path.join(line.protoDir, file), {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [line.protoDir],
    });
    let pkg = grpc.loadPackageDefinition(packageDefinition)[proto.package];
    for (let name of Object.keys(proto.services)) definitions[name] = pkg[name].service;
  }
  return definitions;
}

/**
 * Starts the server. `handlers` is { Service: { Method: handler } } with grpc-js server
 * handlers; every call is recorded in `calls` as { method, request, metadata }.
 */
async function startMockLnd({ certificate, lndVersion = '0.20', handlers }) {
  let definitions = serviceDefinitions(lndVersion);
  let server = new grpc.Server();
  let calls = [];
  for (let [service, methods] of Object.entries(handlers)) {
    let wrapped = {};
    for (let [method, handler] of Object.entries(methods)) {
      wrapped[method] = (call, callback) => {
        calls.push({
          method: `${service}.${method}`,
          request: call.request,
          metadata: call.metadata,
        });
        return handler(call, callback);
      };
    }
    server.addService(definitions[service], wrapped);
  }
  let credentials = grpc.ServerCredentials.createSsl(null, [
    { private_key: certificate.key, cert_chain: certificate.cert },
  ]);
  let port = await new Promise((resolve, reject) =>
    server.bindAsync('127.0.0.1:0', credentials, (err, boundPort) =>
      err ? reject(err) : resolve(boundPort)
    )
  );
  return {
    port,
    calls,
    // forceShutdown: a stream left open by a failed test must not keep mocha waiting
    close: () => server.forceShutdown(),
  };
}

module.exports = { createCertificate, startMockLnd };
