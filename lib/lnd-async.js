const { promisify } = require('util');
const lnrpc = require('./lnd-rpc');
const { defaultVersion, getLine, resolveLndVersion, supportedVersions } = require('./common');
const { ValidationError, getValidators } = require('./strict');

module.exports = {
  connect,
  supportedLndVersions: Object.freeze(supportedVersions.slice()),
  defaultLndVersion: defaultVersion,
  ValidationError,
};

async function connect(opts = {}) {
  // opts is passed on as is: a copy would lose options defined by getters or a prototype
  let services = await lnrpc.connect(opts);
  let line = getLine(resolveLndVersion(opts.lndVersion));
  return wrapAsync(services, line, opts.strict ? getValidators(line) : null);
}

function wrapAsync(lnrpc, line, validators) {
  let result = {
    lnrpc, // service definition and two services that are now connected
  };

  // Methods are found by their rpc name (in the order of the grpc-js client, as before) and
  // exposed in lowerCamelCase of it. The lowerCamelCase alias grpc-js adds itself is built by
  // lodash camelCase, which turns DeleteMacaroonID into deleteMacaroonId.
  let addMethods = (target, client, serviceName) => {
    let methods = new Map((line.methods[serviceName] || []).map(m => [m.name, m]));
    for (let name in client) {
      let method = methods.get(name);
      if (method && typeof client[name] === 'function') {
        let validator = validators && validators.get(`${serviceName}.${method.key}`);
        target[method.key] = method.stream
          ? streamMethod(client, name, validator)
          : unaryMethod(client, name, validator);
      }
    }
  };

  // backward compatibility
  for (let service in lnrpc.services) {
    addMethods(
      result,
      lnrpc.services[service],
      service.charAt(0).toUpperCase() + service.substring(1)
    );
  }

  // All methods, packages and services
  for (let service in lnrpc.allServices) {
    result[service] = {};
    addMethods(result[service], lnrpc.allServices[service], service);
  }
  return result;
}

function unaryMethod(client, method, validator) {
  let call = promisify(client[method].bind(client));
  if (!validator) return call;
  return (request, ...rest) => {
    try {
      validator.validate(request);
    } catch (err) {
      return Promise.reject(err);
    }
    return call(request, ...rest);
  };
}

function streamMethod(client, method, validator) {
  let call = client[method].bind(client);
  if (!validator) return call;
  if (validator.requestStream) {
    // Bidirectional: requests are written to the stream, by write() or by end(message)
    return (...args) => {
      let stream = call(...args);
      let { write, end } = stream;
      stream.write = function(message, ...rest) {
        validator.validate(message);
        return write.call(this, message, ...rest);
      };
      stream.end = function(message, ...rest) {
        if (message !== undefined && message !== null && typeof message !== 'function') {
          validator.validate(message);
        }
        return end.call(this, message, ...rest);
      };
      return stream;
    };
  }
  return (request, ...rest) => {
    validator.validate(request);
    return call(request, ...rest);
  };
}
