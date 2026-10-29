// Tests that run without a real LND node: a local gRPC server plays LND.
const { expect } = require('chai');
const sut = require('../lib/lnd-async');
const { createCertificate, startMockLnd } = require('./helpers/mock-lnd');
const { getLine } = require('../lib/common');

const MACAROON = Buffer.from('macaroon bytes');

describe('lnd-async against a mock LND', function() {
  this.timeout(10000);
  let certificate;
  let clients = [];

  before(function() {
    try {
      certificate = createCertificate();
    } catch (err) {
      this.skip(); // no openssl
    }
  });

  after(() => {
    for (let client of clients)
      for (let raw of Object.values(client.lnrpc.allServices)) raw.close();
  });

  async function connect(mock, options = {}) {
    let client = await sut.connect({
      lndHost: '127.0.0.1',
      lndPort: mock.port,
      cert: certificate.cert.toString('base64'),
      macaroon: MACAROON.toString('base64'),
      ...options,
    });
    clients.push(client);
    return client;
  }

  describe('default line', () => {
    let mock;
    let interceptorRequests = [];

    before(async () => {
      mock = await startMockLnd({
        certificate,
        handlers: {
          Lightning: {
            GetInfo: (call, callback) =>
              callback(null, {
                alias: 'mock',
                block_height: 800000,
                best_header_timestamp: '1700000000',
                chains: [{ chain: 'bitcoin', network: 'regtest' }],
              }),
            AddInvoice: (call, callback) =>
              callback(null, {
                r_hash: Buffer.alloc(32, 1),
                payment_request: 'lnbcrt1',
                add_index: '7',
              }),
            SubscribeInvoices: call => {
              call.write({
                memo: 'first',
                value: '1000',
                r_hash: Buffer.alloc(32, 2),
                state: 'SETTLED',
              });
              call.write({ memo: 'second', value_msat: '9007199254740993' });
              call.end();
            },
          },
          Router: {
            HtlcInterceptor: call => {
              call.on('data', response => {
                interceptorRequests.push(response);
                call.write({
                  incoming_circuit_key: { chan_id: '1', htlc_id: '2' },
                  outgoing_amount_msat: '1000',
                });
              });
              call.on('end', () => call.end());
            },
          },
        },
      });
    });

    after(() => mock.close());

    it('sends the macaroon as hex metadata', async () => {
      let client = await connect(mock);
      await client.getInfo({});
      let call = mock.calls.find(c => c.method === 'Lightning.GetInfo');
      expect(call.metadata.get('macaroon')).to.deep.equal([MACAROON.toString('hex')]);
    });

    it('reads options through getters and the prototype chain, as before', async () => {
      class Options {
        get lndHost() {
          return '127.0.0.1';
        }
        get lndPort() {
          return mock.port;
        }
        get cert() {
          return certificate.cert.toString('base64');
        }
      }
      let options = Object.create(new Options());
      Object.defineProperty(options, 'macaroon', { value: MACAROON.toString('base64') });
      let client = await sut.connect(options);
      clients.push(client);
      expect((await client.getInfo({})).alias).to.equal('mock');
      let call = mock.calls.filter(c => c.method === 'Lightning.GetInfo').pop();
      expect(call.metadata.get('macaroon')).to.deep.equal([MACAROON.toString('hex')]);
    });

    it('decodes responses with defaults, string longs and snake_case names', async () => {
      let client = await connect(mock);
      let info = await client.getInfo({});
      expect(info.alias).to.equal('mock');
      expect(info.block_height).to.equal(800000);
      expect(info.best_header_timestamp).to.equal('1700000000');
      expect(info.testnet).to.equal(false);
      expect(info.uris).to.deep.equal([]);
      expect(info.features).to.deep.equal({});
      expect(info.chains).to.deep.equal([{ chain: 'bitcoin', network: 'regtest' }]);
      expect(info).to.not.have.property('blockHeight');
      expect(await client.Lightning.getInfo({})).to.deep.equal(info);
    });

    it('returns longs as numbers with longsAsNumbers', async () => {
      let client = await connect(mock, { longsAsNumbers: true });
      let info = await client.getInfo({});
      expect(info.best_header_timestamp).to.equal(1700000000);
    });

    it('streams server responses', async () => {
      let client = await connect(mock);
      let invoices = [];
      await new Promise((resolve, reject) =>
        client
          .subscribeInvoices({})
          .on('data', invoice => invoices.push(invoice))
          .on('error', reject)
          .on('end', resolve)
      );
      expect(invoices.map(i => i.memo)).to.deep.equal(['first', 'second']);
      expect(Buffer.isBuffer(invoices[0].r_hash)).to.equal(true);
      expect(invoices[0].state).to.equal('SETTLED');
      expect(invoices[0].value).to.equal('1000');
      expect(invoices[1].value_msat).to.equal('9007199254740993');
      expect(invoices[1].state).to.equal('OPEN');
    });

    it('streams in both directions', async () => {
      let client = await connect(mock);
      let interceptor = client.Router.htlcInterceptor();
      let received = new Promise(resolve => interceptor.once('data', resolve));
      interceptor.write({ incoming_circuit_key: { chan_id: '5', htlc_id: '6' }, action: 'RESUME' });
      let request = await received;
      interceptor.end();
      expect(request.incoming_circuit_key).to.deep.equal({ chan_id: '1', htlc_id: '2' });
      expect(request.outgoing_amount_msat).to.equal('1000');
      expect(interceptorRequests[0].action).to.equal('RESUME');
      expect(interceptorRequests[0].incoming_circuit_key).to.deep.equal({
        chan_id: '5',
        htlc_id: '6',
      });
    });

    describe('without strict mode (protobufjs behaviour, unchanged)', () => {
      it('silently drops unknown fields', async () => {
        let client = await connect(mock);
        await client.addInvoice({ valeu: 1000, memo: 'typo' });
        let call = mock.calls.filter(c => c.method === 'Lightning.AddInvoice').pop();
        expect(call.request.memo).to.equal('typo');
        expect(call.request.value).to.equal('0');
      });

      it('turns an unknown enum name into the first value of the enum', async () => {
        let client = await connect(mock);
        let interceptor = client.Router.htlcInterceptor();
        let received = new Promise(resolve => interceptor.once('data', resolve));
        interceptor.write({
          incoming_circuit_key: { chan_id: '1', htlc_id: '1' },
          action: 'ACCEPT',
        });
        await received;
        interceptor.end();
        // ResolveHoldForwardAction: SETTLE = 0
        expect(interceptorRequests.pop().action).to.equal('SETTLE');
      });
    });

    describe('strict mode', () => {
      it('rejects an unknown field before sending anything', async () => {
        let client = await connect(mock, { strict: true });
        let before = mock.calls.length;
        let err = await client.addInvoice({ valeu: 1000 }).then(
          () => null,
          e => e
        );
        expect(err).to.be.instanceOf(sut.ValidationError);
        expect(err).to.be.instanceOf(TypeError);
        expect(err.messageType).to.equal('lnrpc.Invoice');
        expect(err.path).to.equal('valeu');
        expect(err.message).to.equal('lnrpc.Invoice.valeu: unknown field (did you mean "value"?)');
        expect(mock.calls.length).to.equal(before);
      });

      it('suggests the snake_case name for a camelCase field', async () => {
        let client = await connect(mock, { strict: true });
        let err = await client.Lightning.addInvoice({ rPreimage: Buffer.alloc(32) }).then(
          () => null,
          e => e
        );
        expect(err.message).to.contain('did you mean "r_preimage"?');
      });

      it('sends valid requests unchanged', async () => {
        let client = await connect(mock, { strict: true });
        let response = await client.addInvoice({
          value: 1000,
          memo: 'ok',
          r_preimage: Buffer.alloc(32, 3),
        });
        expect(response.add_index).to.equal('7');
        let call = mock.calls.filter(c => c.method === 'Lightning.AddInvoice').pop();
        expect(call.request.value).to.equal('1000');
        expect(call.request.r_preimage).to.deep.equal(Buffer.alloc(32, 3));
      });

      it('throws on a server-streaming request synchronously', async () => {
        let client = await connect(mock, { strict: true });
        expect(() => client.subscribeInvoices({ add_index: -1 })).to.throw(
          sut.ValidationError,
          'lnrpc.InvoiceSubscription.add_index: expected an integer from 0 to 18446744073709551615 (uint64)'
        );
      });

      it('validates every message written to a bidirectional stream', async () => {
        let client = await connect(mock, { strict: true });
        let interceptor = client.Router.htlcInterceptor();
        expect(() => interceptor.write({ action: 'ACCEPT' })).to.throw(
          sut.ValidationError,
          'routerrpc.ForwardHtlcInterceptResponse.action: expected a value of routerrpc.ResolveHoldForwardAction'
        );
        let received = new Promise(resolve => interceptor.once('data', resolve));
        interceptor.write({ incoming_circuit_key: { chan_id: '9', htlc_id: '9' }, action: 'FAIL' });
        await received;
        interceptor.end();
        expect(interceptorRequests.pop().action).to.equal('FAIL');
      });

      it('validates a message passed to end() of a bidirectional stream', async () => {
        let client = await connect(mock, { strict: true });
        let interceptor = client.Router.htlcInterceptor();
        interceptor.on('error', () => {}); // CANCELLED by the cancel() below
        expect(() => interceptor.end({ action: 'ACCEPT' })).to.throw(
          sut.ValidationError,
          'routerrpc.ForwardHtlcInterceptResponse.action: expected a value of'
        );
        interceptor.cancel();
      });

      it('rejects a missing request', async () => {
        let client = await connect(mock, { strict: true });
        let err = await client.getInfo().then(
          () => null,
          e => e
        );
        expect(err.message).to.equal(
          'lnrpc.GetInfoRequest: expected an object, got undefined undefined'
        );
      });
    });
  });

  describe('lndVersion', () => {
    it('talks to a 0.21 server with the 0.21 protos', async () => {
      let mock = await startMockLnd({
        certificate,
        lndVersion: '0.21',
        handlers: { Lightning: { SendOnionMessage: (call, callback) => callback(null, {}) } },
      });
      try {
        let client = await connect(mock, { lndVersion: '0.21' });
        await client.sendOnionMessage({ peer: Buffer.alloc(33, 2), onion: Buffer.from('onion') });
        let call = mock.calls.pop();
        expect(call.method).to.equal('Lightning.SendOnionMessage');
        expect(call.request.onion.toString()).to.equal('onion');
        expect(client.sendPaymentSync).to.equal(undefined);
      } finally {
        await mock.close();
      }
    });
  });
});

describe('lnd-async client surface', () => {
  let base = { lndHost: '127.0.0.1', lndPort: 1, noCert: true, noMacaroons: true };

  it('exposes the bundled LND lines', () => {
    expect(sut.supportedLndVersions).to.deep.equal(['0.18', '0.19', '0.20', '0.21']);
    expect(sut.defaultLndVersion).to.equal('0.20');
  });

  it('keeps the default surface: flat Lightning/WalletUnlocker/State methods and all services', async () => {
    let client = await sut.connect(base);
    let services = Object.keys(client).filter(k => /^[A-Z]/.test(k));
    let flat = Object.keys(client).filter(k => /^[a-z]/.test(k) && k !== 'lnrpc');
    expect(services).to.have.length(16);
    expect(flat).to.have.length(75);
    expect(services.reduce((n, s) => n + Object.keys(client[s]).length, 0)).to.equal(173);
    for (let name of flat) expect(client[name]).to.be.a('function');
    expect(client.lnrpc.services).to.have.keys('lightning', 'walletUnlocker', 'state');
  });

  it('exposes rpcs with consecutive capitals under the lowerCamelCase of the rpc name', async () => {
    let client = await sut.connect(base);
    expect(client.deleteMacaroonID).to.be.a('function');
    expect(client.registerRPCMiddleware).to.be.a('function');
    expect(client.Lightning.deleteMacaroonID).to.be.a('function');
    expect(client.Lightning.listMacaroonIDs).to.be.a('function');
    expect(client.Router.xImportMissionControl).to.be.a('function');
    expect(client.Signer.muSig2CreateSession).to.be.a('function');
    expect(client).to.not.have.property('deleteMacaroonId');
  });

  it('has the methods the TypeScript declarations promise, in every line', async () => {
    let { loadLine } = require('../util-scripts/generate-types');
    for (let lndVersion of sut.supportedLndVersions) {
      let { root } = loadLine(lndVersion);
      let declared = [];
      (function visit(ns) {
        for (let obj of ns.nestedArray || []) {
          if (obj.methodsArray) {
            for (let m of obj.methodsArray)
              declared.push(`${obj.name}.${m.name[0].toLowerCase()}${m.name.slice(1)}`);
          }
          visit(obj);
        }
      })(root);
      let client = await sut.connect({ ...base, lndVersion });
      let actual = [];
      for (let service of Object.keys(client).filter(k => /^[A-Z]/.test(k))) {
        for (let method of Object.keys(client[service])) actual.push(`${service}.${method}`);
      }
      expect(actual.sort(), lndVersion).to.deep.equal(declared.sort());
    }
  });

  it('matches all-api.js of every line', async () => {
    for (let lndVersion of sut.supportedLndVersions) {
      let line = getLine(lndVersion);
      let client = await sut.connect({ ...base, lndVersion });
      let methods = new Set();
      for (let service of Object.keys(client).filter(k => /^[A-Z]/.test(k))) {
        for (let method of Object.keys(client[service])) methods.add(`${service}.${method}`);
      }
      expect([...methods].sort()).to.deep.equal(
        [...line.allStreamApi, ...line.allCallbackApi].sort()
      );
    }
  });

  it('selects the line from a full version string', async () => {
    let client = await sut.connect({ ...base, lndVersion: '0.21.5-beta commit=v0.21.5-beta' });
    expect(client.sendOnionMessage).to.be.a('function');
    expect(client.sendPaymentSync).to.equal(undefined);
    let old = await sut.connect({ ...base, lndVersion: 'v0.18.5-beta' });
    expect(old.Lightning.deleteCanceledInvoice).to.equal(undefined);
  });

  it('rejects an unsupported lndVersion', async () => {
    let err = await sut.connect({ ...base, lndVersion: '0.17' }).then(
      () => null,
      e => e
    );
    expect(err.message).to.equal(
      'Unsupported lndVersion "0.17"; the supported LND lines are 0.18, 0.19, 0.20, 0.21'
    );
  });
});

describe('strict mode validation', () => {
  let { getValidators } = require('../lib/strict');
  let validators = getValidators(getLine('0.20'));
  let sendPayment = request => validators.get('Router.sendPaymentV2').validate(request);
  let updatePolicy = request => validators.get('Lightning.updateChannelPolicy').validate(request);
  let rejects = (fn, message) => expect(fn).to.throw(sut.ValidationError, message);

  it('accepts a valid request with every kind of field', () => {
    sendPayment({
      dest: Buffer.alloc(33, 2),
      amt: 1000,
      amt_msat: '1000000',
      payment_hash: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      final_cltv_delta: 40,
      fee_limit_msat: { low: 1000, high: 0 },
      outgoing_chan_ids: ['1', 2],
      dest_custom_records: { 65536: Buffer.from('a'), '65537': 'YQ==' },
      route_hints: [{ hop_hints: [{ chan_id: '1', fee_base_msat: 1, cltv_expiry_delta: 40 }] }],
      dest_features: ['MPP_OPT', 9],
      max_parts: 16,
      time_pref: 0.5,
      no_inflight_updates: true,
      payment_request: undefined,
      cltv_limit: null,
    });
  });

  it('checks integer ranges and 64-bit values', () => {
    rejects(
      () => sendPayment({ final_cltv_delta: 2 ** 31 }),
      'final_cltv_delta: expected an integer from -2147483648'
    );
    rejects(
      () => sendPayment({ max_parts: -1 }),
      'max_parts: expected an integer from 0 to 4294967295 (uint32)'
    );
    rejects(() => sendPayment({ max_parts: 1.5 }), 'max_parts: expected an integer');
    rejects(() => sendPayment({ amt: 2 ** 53 }), 'beyond 2^53, pass it as a string');
    rejects(
      () => sendPayment({ amt: '9223372036854775808' }),
      'amt: expected an integer from -9223372036854775808'
    );
    rejects(() => sendPayment({ amt: 10n }), 'got the bigint 10');
    rejects(() => sendPayment({ amt: '1e3' }), 'got the string "1e3"');
    rejects(
      () => sendPayment({ outgoing_chan_ids: ['-1'] }),
      'outgoing_chan_ids[0]: expected an integer from 0'
    );
  });

  it('checks strings, booleans, doubles and bytes', () => {
    rejects(
      () => sendPayment({ payment_request: 42 }),
      'payment_request: expected a string, got number 42'
    );
    rejects(
      () => sendPayment({ no_inflight_updates: 'yes' }),
      'expected a boolean, got the string "yes"'
    );
    rejects(() => sendPayment({ time_pref: '0.5' }), 'time_pref: expected a number');
    rejects(
      () => sendPayment({ dest: 'not base64!' }),
      'dest: expected a Buffer, a Uint8Array or a base64 string'
    );
    rejects(
      () => sendPayment({ dest: [1, 2] }),
      'dest: expected a Buffer, a Uint8Array or a base64 string, got an array'
    );
  });

  it('checks repeated fields, maps and nested messages with their path', () => {
    rejects(() => sendPayment({ outgoing_chan_ids: '1' }), 'outgoing_chan_ids: expected an array');
    rejects(() => sendPayment({ outgoing_chan_ids: [null] }), 'outgoing_chan_ids[0]: expected');
    rejects(
      () => sendPayment({ dest_custom_records: { abc: 'YQ==' } }),
      'dest_custom_records["abc"]: expected an integer map key (uint64)'
    );
    rejects(
      () => sendPayment({ dest_custom_records: { 1: 5 } }),
      'dest_custom_records["1"]: expected a Buffer'
    );
    rejects(
      () => sendPayment({ route_hints: [{ hop_hints: [{ chan_id: '1', fee_base_msat: -1 }] }] }),
      'routerrpc.SendPaymentRequest.route_hints[0].hop_hints[0].fee_base_msat: expected an integer from 0'
    );
    rejects(
      () => sendPayment({ route_hints: [{ hop_hint: [] }] }),
      'route_hints[0].hop_hint: unknown field (did you mean "hop_hints"?)'
    );
    rejects(
      () => sendPayment({ route_hints: ['x'] }),
      'route_hints[0]: expected an object, got the string "x"'
    );
  });

  it('checks enum values by name and number', () => {
    rejects(
      () => sendPayment({ dest_features: ['MPP'] }),
      'dest_features[0]: expected a value of lnrpc.FeatureBit'
    );
    rejects(
      () => sendPayment({ dest_features: [12345] }),
      'dest_features[0]: expected a value of lnrpc.FeatureBit'
    );
  });

  it('accepts the oneof property that decoded messages carry', () => {
    updatePolicy({
      scope: 'chan_point',
      chan_point: { funding_txid: 'funding_txid_str', funding_txid_str: 'ab', output_index: 0 },
      base_fee_msat: '1000',
      fee_rate: 0.000001,
      time_lock_delta: 80,
    });
    rejects(
      () => updatePolicy({ scope: 'everything' }),
      'scope: expected one of "global", "chan_point"'
    );
  });

  it('checks that one member of a oneof is set and named', () => {
    rejects(
      () => updatePolicy({ global: true, chan_point: { funding_txid_str: 'ab' } }),
      'lnrpc.PolicyUpdateRequest.chan_point: only one of "global", "chan_point" may be set (oneof scope)'
    );
    rejects(
      () => updatePolicy({ scope: 'global', chan_point: { funding_txid_str: 'ab' } }),
      'lnrpc.PolicyUpdateRequest.scope: names "global", but "chan_point" is set'
    );
    rejects(
      () => updatePolicy({ scope: 'global' }),
      'scope: names "global", but that field is not set'
    );
    updatePolicy({ global: true, scope: 'global' });
  });

  it('accepts only the base64 that protobufjs decodes', () => {
    sendPayment({ dest: 'YWJj', payment_hash: 'YWI', payment_addr: 'YWI=' });
    rejects(
      () => sendPayment({ dest: 'YW-j' }),
      'dest: expected a Buffer, a Uint8Array or a base64 string'
    );
    rejects(
      () => sendPayment({ dest: 'YW_j' }),
      'dest: expected a Buffer, a Uint8Array or a base64 string'
    );
    rejects(
      () => sendPayment({ dest: 'YQ==YQ==' }),
      'dest: expected a Buffer, a Uint8Array or a base64 string'
    );
  });

  it('checks map keys, including binary keys copied from a response', () => {
    rejects(
      () => sendPayment({ dest_custom_records: { '-1': 'YQ==' } }),
      'dest_custom_records["-1"]: expected an integer map key (uint64)'
    );
    rejects(
      () => sendPayment({ dest_custom_records: { 'laÆF\u0001\u0000\u0000\u0000': 'YQ==' } }),
      'this looks like a key decoded from a response, convert it to a decimal string first'
    );
  });

  it('rejects an unknown field even when its value is undefined', () => {
    rejects(
      () => sendPayment({ payment_request: 'lnbc1', amtt: undefined }),
      'amtt: unknown field (did you mean "amt"?)'
    );
  });

  it('does not take prototype names for fields', () => {
    rejects(() => sendPayment({ constructor: 1 }), 'constructor: unknown field');
    rejects(() => sendPayment(JSON.parse('{"__proto__": {"amt": 1}}')), '__proto__: unknown field');
  });
});
