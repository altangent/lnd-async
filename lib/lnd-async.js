const { promisify } = require('util');
const lnrpc = require('./lnd-rpc');

module.exports = {
  connect: async (opts = {}) => wrapAsync(await lnrpc.connect(opts)),
};

let streamApis = new Set([
  'subscribeTransactions',
  'openChannel',
  'closeChannel',
  'sendPayment',
  'subscribeInvoices',
  'subscribeChannelGraph',
]);

let callbackApis = new Set([
  'genSeed',
  'initWallet',
  'unlockWallet',
  'walletBalance',
  'channelBalance',
  'getTransactions',
  'sendCoins',
  'sendMany',
  'newAddress',
  'newWitnessAddress',
  'signMessage',
  'verifyMessage',
  'connectPeer',
  'disconnectPeer',
  'listPeers',
  'getInfo',
  'pendingChannels',
  'listChannels',
  'openChannelSync',
  'sendPaymentSync',
  'addInvoice',
  'listInvoices',
  'lookupInvoice',
  'decodePayReq',
  'listPayments',
  'deleteAllPayments',
  'describeGraph',
  'getChanInfo',
  'getNodeInfo',
  'queryRoutes',
  'getNetworkInfo',
  'stopDaemon',
  'debugLevel',
  'feeReport',
  'updateChannelPolicy',
  'forwardingHistory',
]);

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
