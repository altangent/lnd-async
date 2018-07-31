const path = require('path');
const grpc = require('grpc');
const { loadSync } = require('@grpc/proto-loader');
const { getDefaultCertAndMacaroonPaths, readFile, validateFileAccess } = require('./util');

module.exports = {
  connect,
};

/**
 * Creates the LND grpc client. If certPath and/or macaroonPath are not
 * supplied, the OS specified defaults will be used.
 * @param {Object} obj
 * @param {String} obj.lndHost
 * @param {Int} obj.lnPort
 * @param {String} obj.certPath
 * @param {String} obj.macaroonPath
 * @param {Boolean} obj.noMacaroons
 * @returns {lnd.Lightning}
 */
async function connect({
  lndHost = 'localhost',
  lndPort = 10009,
  certPath,
  cert,
  macaroonPath,
  macaroon,
  noMacaroons = false,
}) {
  let useMacaroons = !noMacaroons;

  // enable HIGH ECSDA encryption suites for TLS
  // required after: https://github.com/lightningnetwork/lnd/commit/f7eeea71e206a514ee649060e903f72c9d4a8c46
  process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';

  if ((!certPath && !cert) || (useMacaroons && (!macaroonPath || macaroon))) {
    let defaults = getDefaultCertAndMacaroonPaths();
    if (!certPath) certPath = defaults.defaultCertPath;
    if (!noMacaroons && !macaroonPath) macaroonPath = defaults.defaultMacaroonPath;
  }

  let creds;
  let sslCreds;

  if (cert) {
    sslCreds = createSslCredsFromBase64(cert);
  } else {
    sslCreds = await createSslCredsFromPath(certPath);
  }

  let macaroonCreds;
  if (useMacaroons) {
    if (macaroon) {
      macaroonCreds = createMacaroonCredsFromBase64(macaroon);
    } else {
      macaroonCreds = await createMacaroonCredsFromPath(macaroonPath);
    }
    creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
  }

  const packageDefinition = loadSync(path.join(__dirname, 'rpc.proto'), {
    defaults: true,
    enums: String,
    keepCase: true,
    longs: String,
    oneofs: true,
  });

  let lnrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
  let lnrpc = lnrpcDescriptor.lnrpc;

  // rpc.proto defines apis inside two services lightning and walletunlocker,
  // this will connect to and return both services
  let lndPath = `${lndHost}:${lndPort}`;
  let lightning = new lnrpc.Lightning(lndPath, creds);
  let walletUnlocker = new lnrpc.WalletUnlocker(lndPath, creds);

  // return the services and the service definition with all its types
  return { lnrpc, services: { lightning, walletUnlocker } };
}

///////////////////////

/**
 * Validates and creates the ssl channel credentials
 * from the specified file path
 * @private
 * @param {String} certPath
 * @returns {grpc.ChanelCredentials}
 */
async function createSslCredsFromPath(certPath) {
  if (!await validateFileAccess(certPath)) throw new Error('SSL cert path could not be accessed');

  let lndCert = await readFile(certPath);
  let sslCreds = grpc.credentials.createSsl(lndCert);
  return sslCreds;
}

/**
 * Creates the ssl channel credentials
 * from the specified base64 string
 * @private
 * @param {String} certPath
 * @returns {grpc.ChanelCredentials}
 */
function createSslCredsFromBase64(cert) {
  let lndCert = Buffer.from(cert, 'base64');
  let sslCreds = grpc.credentials.createSsl(lndCert);
  return sslCreds;
}

/**
 * Validates and creates the macaroon authorization credentials
 * from the specified file path
 * @see https://github.com/lightningnetwork/lnd/blob/1379488e727cf10eae3de8b5ce02fd3f1842b0f5/macaroons/auth.go#L41
 * @see https://groups.google.com/forum/#!topic/grpc-io/_JyyyOu-Ruc
 * @private
 * @param {String} macaroonPath
 * @returns {grpc.CallCredentials}
 */
async function createMacaroonCredsFromPath(macaroonPath) {
  if (!await validateFileAccess(macaroonPath))
    throw new Error('Macaroon path could not be accessed');

  let macaroon = (await readFile(macaroonPath)).toString('hex');
  return createMacaroonCreds(macaroon);
}

/**
 * Creates the macaroon authorization credentials
 * from the specified base64 string
 * @see https://github.com/lightningnetwork/lnd/blob/1379488e727cf10eae3de8b5ce02fd3f1842b0f5/macaroons/auth.go#L41
 * @see https://groups.google.com/forum/#!topic/grpc-io/_JyyyOu-Ruc
 * @private
 * @param {String} macaroonPath
 * @returns {grpc.CallCredentials}
 */
function createMacaroonCredsFromBase64(macaroonString) {
  let macaroon = Buffer.from(macaroonString, 'base64').toString('hex');
  return createMacaroonCreds(macaroon);
}

function createMacaroonCreds(macaroon) {
  let metadata = new grpc.Metadata();
  metadata.add('macaroon', macaroon);

  let macaroonCreds = grpc.credentials.createFromMetadataGenerator((params, callback) =>
    callback(null, metadata)
  );

  return macaroonCreds;
}
