const { promisify } = require('util');
const lnrpc = require('./lnd-rpc');
const { streamApis, callbackApis, allStreamApi, allCallbackApi } = require('./common')

module.exports = {
  connect: async (opts = {}) => wrapAsync(await lnrpc.connect(opts)),
};

function wrapAsync(lnrpc) {
  let result = {
    lnrpc, // service definition and two services that are now connected
  };

  // backward compatibility
  for (let service in lnrpc.services) {
    for (let method in lnrpc.services[service]) {
      if (streamApis.has(method))
        result[method] = lnrpc.services[service][method].bind(lnrpc.services[service]);
      else if (callbackApis.has(method))
        result[method] = promisify(lnrpc.services[service][method].bind(lnrpc.services[service]));
    }
  }

  // All methods, packages and services
  for (let service in lnrpc.allServices) {
    result[service] = {};
    for (let method in lnrpc.allServices[service]) {
      if (allStreamApi.has(`${service}.${method}`))
        result[service][method] = lnrpc.allServices[service][method].bind(lnrpc.allServices[service]);
      else if (callbackApis.has(method))
        result[service][method] = promisify(lnrpc.allServices[service][method].bind(lnrpc.allServices[service]));
    }
  }
  return result;
}
