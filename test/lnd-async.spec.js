const { expect } = require('chai');
const sut = require('../lib/lnd-async');

describe('lnd-async', () => {
  let _client;

  before(async () => {
    _client = await sut.connect({
      macaroonPath:
        '/Users/bmancini/Library/Application Support/Lnd/data/chain/bitcoin/mainnet/admin.macaroon',
    });
  });

  let tests = [
    // service WalletUnlocker
    { method: 'genSeed' },
    { method: 'initWallet' },
    { method: 'unlockWallet' },
    { method: 'changePassword' },
    // service Lightning
    { method: 'walletBalance' },
    { method: 'channelBalance' },
    { method: 'getTransactions' },
    { method: 'sendCoins' },
    { method: 'subscribeTransactions', isStream: true },
    { method: 'sendMany' },
    { method: 'newAddress' },
    { method: 'signMessage' },
    { method: 'verifyMessage' },
    { method: 'connectPeer' },
    { method: 'disconnectPeer' },
    { method: 'listPeers' },
    { method: 'getInfo' },
    { method: 'pendingChannels' },
    { method: 'listChannels' },
    { method: 'closedChannels' },
    { method: 'openChannelSync' },
    { method: 'openChannel', isStream: true },
    { method: 'closeChannel', isStream: true },
    { method: 'abandonChannel' },
    { method: 'sendPayment', isStream: true },
    { method: 'sendPaymentSync' },
    { method: 'sendToRoute', isStream: true },
    { method: 'sendToRouteSync' },
    { method: 'addInvoice' },
    { method: 'listInvoices' },
    { method: 'lookupInvoice' },
    { method: 'subscribeInvoices', isStream: true },
    { method: 'decodePayReq' },
    { method: 'listPayments' },
    { method: 'deleteAllPayments' },
    { method: 'describeGraph' },
    { method: 'getChanInfo' },
    { method: 'getNodeInfo' },
    { method: 'queryRoutes' },
    { method: 'getNetworkInfo' },
    { method: 'stopDaemon' },
    { method: 'subscribeChannelGraph', isStream: true },
    { method: 'debugLevel' },
    { method: 'feeReport' },
    { method: 'updateChannelPolicy' },
    { method: 'forwardingHistory' },
    { method: 'subscribeChannelEvents', isStream: true },
    { method: 'exportChannelBackup' },
    { method: 'exportAllChannelBackups' },
    { method: 'verifyChanBackup' },
    { method: 'restoreChannelBackups' },
    { method: 'subscribeChannelBackups', isStream: true },
  ];

  for (let test of tests) {
    it(`.${test.method} should return a ${test.isStream ? 'stream' : 'promise'}`, () => {
      let res = _client[test.method]({});
      if (!test.isStream) {
        res.catch(() => {});
        expect(res instanceof Promise).to.be.true;
      } else {
        expect(res instanceof Promise).to.be.false;
      }
    });
  }
});
