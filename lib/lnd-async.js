const { promisify } = require('util');
const lndrpc = require('./lnd-rpc');

module.exports = {
  connect: async (opts = {}) => wrapAsync(await lndrpc.connect(opts)),
};

let streamApis = new Set([
  'closeChanenl',
  'openChannel',
  'sendPayment',
  'subscribeChannelGraph',
  'subscribeInvoices',
  'subscribeTransactions',
]);

let callbackApis = new Set([
  'addInvoice',
  'channelBalance',
  'connectPeer',
  'debugLevel',
  'decodePayReq',
  'deleteAllPayments',
  'describeGraph',
  'disconnectPeer',
  'feeReport',
  'getChanInfo',
  'getInfo',
  'getNetworkInfo',
  'getNodeInfo',
  'getTransactions',
  'listChannels',
  'listInvoices',
  'listPayments',
  'listPeers',
  'lookupInvoice',
  'newAddress',
  'newWitnessAddress',
  'openChannelSync',
  'pendingChannels',
  'queryRoutes',
  'sendCoins',
  'sendMany',
  'sendPaymentSync',
  'setAlias',
  'signMessage',
  'stopDaemon',
  'updateFees',
  'verifyMessage',
  'walletBalance',
]);

function wrapAsync(lndrpc) {
  let result = {
    lndrpc,
  };
  for (let m in lndrpc) {
    if (streamApis.has(m)) result[m] = lndrpc[m].bind(lndrpc);
    else if (callbackApis.has(m)) result[m] = promisify(lndrpc[m].bind(lndrpc));
  }
  return result;
}
