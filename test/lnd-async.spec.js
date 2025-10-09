const { expect } = require('chai');
const sut = require('../lib/lnd-async');

describe('lnd-async', () => {
  let _client;

  before(async () => {
    _client = await sut.connect({
      lndHost:      process.env.LND_ASYNC_TEST_LND_HOST      || undefined,
      lndPort:      process.env.LND_ASYNC_TEST_LND_PORT      || undefined,
      macaroon:     process.env.LND_ASYNC_TEST_MACAROON      || undefined,
      macaroonPath: process.env.LND_ASYNC_TEST_MACAROON_PATH || undefined,
      cert:         process.env.LND_ASYNC_TEST_CERT          || undefined,
      certPath:     process.env.LND_ASYNC_TEST_CERT_PATH     || undefined,
      noCert:       process.env.LND_ASYNC_TEST_NO_CERT === 'true',
    });
  });

  after(() => {
    if (_client && typeof _client.close === 'function') _client.close();
    if (sut && typeof sut.disconnect === 'function') sut.disconnect();
  });

  const tests = [
    // service Lightning
    { method: 'walletBalance' },
    { method: 'channelBalance' },
    { method: 'getTransactions' },
    { method: 'subscribeTransactions', isStream: true },
    { method: 'listPeers' },
    { method: 'getInfo' },
    { method: 'pendingChannels' },
    { method: 'listChannels' },
    { method: 'closedChannels' },
    { method: 'subscribeInvoices', isStream: true },
    { method: 'listPayments' },
    { method: 'getChanInfo' },
    { method: 'getNodeInfo' },
    { method: 'getNetworkInfo' },
    { method: 'subscribeChannelGraph', isStream: true },
    { method: 'feeReport' },
    { method: 'forwardingHistory' },
  ];

  for (const test of tests) {
    if (!test.isStream) {
      it(`.${test.method} should return a promise`, async () => {
        const opts = { deadline: Date.now() + 500 }; // short timeout to avoid hanging
        const p = _client[test.method]({}, opts);
        expect(p instanceof Promise).to.be.true;
        await p.catch(() => {}); // wait for completion/error
      });
    } else {
      it(`.${test.method} should return a stream`, async () => {
        const stream = _client[test.method]({});
        expect(stream instanceof Promise).to.be.false;

        await new Promise((resolve) => {
          let settled = false;
          const done = () => { if (!settled) { settled = true; resolve(); } };

          stream.on('error', done);
          stream.on('end', done);

          // Just in case 'end' doesn't arrive
          const t = setTimeout(() => { stream.cancel(); done(); }, 200);

          // If anything arrives, close immediately
          stream.on('data', () => { stream.cancel(); });

          // Clear the completion timer
          stream.on('end', () => clearTimeout(t));
          stream.on('error', () => clearTimeout(t));
        });
      });
    }
  }
});
