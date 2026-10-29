const path = require('path');
const allApi = require('./all-api');
const { defaultVersion, versions } = require('./versions');

// The services whose methods are also available directly on the client (backward compatibility)
const LEGACY_FILES = ['lightning.proto', 'stateservice.proto', 'walletunlocker.proto'];

function lowerCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}

/**
 * Lookup sets for one all-api.js: `streamApis`/`callbackApis` hold method names of the flat
 * surface, `allStreamApi`/`allCallbackApi` hold `Service.method` of every service.
 */
function buildApiSets(api) {
  let streamApis = new Set();
  let callbackApis = new Set();
  let allStreamApi = new Set();
  let allCallbackApi = new Set();

  for (let file of LEGACY_FILES) {
    for (let service of Object.values(api[file].services)) {
      service.streamApi.forEach(method => streamApis.add(lowerCamelCase(method)));
      service.callbackApi.forEach(method => callbackApis.add(lowerCamelCase(method)));
    }
  }
  for (let proto of Object.values(api)) {
    for (let service of Object.values(proto.services)) {
      service.streamApi.forEach(m => allStreamApi.add(`${service.service}.${lowerCamelCase(m)}`));
      service.callbackApi.forEach(m =>
        allCallbackApi.add(`${service.service}.${lowerCamelCase(m)}`)
      );
    }
  }
  return { streamApis, callbackApis, allStreamApi, allCallbackApi };
}

/**
 * Maps the `lndVersion` option to a bundled LND line. Accepts a line ('0.21') or a full version
 * string ('0.21.5-beta', 'v0.21.5-beta', or the `version` of GetInfo: '0.21.5-beta commit=...').
 * @param {String} [lndVersion]
 * @returns {String} the line, e.g. '0.21'
 */
function resolveLndVersion(lndVersion) {
  if (lndVersion === undefined || lndVersion === null) return defaultVersion;
  let match =
    typeof lndVersion === 'string' && /^v?(\d+)\.(\d+)(\.\d+)?([-\s].*)?$/.exec(lndVersion.trim());
  let line = match && `${match[1]}.${match[2]}`;
  if (!line || !Object.prototype.hasOwnProperty.call(versions, line)) {
    throw new Error(
      `Unsupported lndVersion ${JSON.stringify(lndVersion)}; ` +
        `the supported LND lines are ${Object.keys(versions).join(', ')}`
    );
  }
  return line;
}

/**
 * The methods of every service of one all-api.js: { Service: [{ name, key, stream }] } where
 * `name` is the rpc name and `key` the lowerCamelCase name lnd-async exposes it under.
 */
function buildMethodLists(api) {
  let methods = {};
  for (let proto of Object.values(api)) {
    for (let service of Object.values(proto.services)) {
      methods[service.service] = [
        ...service.streamApi.map(name => ({ name, key: lowerCamelCase(name), stream: true })),
        ...service.callbackApi.map(name => ({ name, key: lowerCamelCase(name), stream: false })),
      ];
    }
  }
  return methods;
}

let lines = new Map();

/**
 * Everything the runtime needs about one bundled LND line: absolute proto directory, its
 * all-api.js and the lookup sets built from it.
 * @param {String} line as returned by resolveLndVersion()
 */
function getLine(line) {
  if (!lines.has(line)) {
    let info = versions[line];
    let api = require(path.join(__dirname, info.api));
    lines.set(line, {
      line,
      lndTag: info.lndTag,
      protoDir: path.join(__dirname, info.protoDir),
      api,
      methods: buildMethodLists(api),
      ...buildApiSets(api),
    });
  }
  return lines.get(line);
}

module.exports = {
  // The lookup sets of the default line, as before multi-version support
  ...buildApiSets(allApi),
  lowerCamelCase,
  allApi,
  defaultVersion,
  supportedVersions: Object.keys(versions),
  resolveLndVersion,
  getLine,
};
