const { promisify } = require('util');
const lnrpc = require('./lnd-rpc');
const { streamApis, callbackApis } = require('./common')

module.exports = {
  connect: async (opts = {}) => wrapAsync(await lnrpc.connect(opts)),
};

function wrapAsync(lnrpc) {
  let result = {
    lnrpc, // service definition and two services that are now connected
  };
  for (let service of Object.keys(lnrpc.services)) {
    for (let method in lnrpc.services[service]) {
      if (streamApis.has(method))
        result[method] = lnrpc.services[service][method].bind(lnrpc.services[service]);
      else if (callbackApis.has(method))
        result[method] = promisify(lnrpc.services[service][method].bind(lnrpc.services[service]));
    }
  }
  return result;
}
