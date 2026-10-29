// Compile-only checks of the declarations for the default LND line (`tsc -p test/types`).
// Lines marked @ts-expect-error must fail to compile; the rest must compile.
import { connect, defaultLndVersion, supportedLndVersions, ValidationError } from '../../lib/lnd-async';
import type { ConnectOptions, LndClient, lnrpc, Lnd0_20, routerrpc } from '../../lib/lnd-async';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
function expectType<T extends true>(): void {}

async function responses() {
  const client = await connect();
  const info = await client.getInfo({});
  expectType<Equal<typeof info.block_height, number>>();
  expectType<Equal<typeof info.best_header_timestamp, string>>();
  expectType<Equal<typeof info.chains, lnrpc.Chain__Output<string>[]>>();
  expectType<Equal<typeof info.features, { [key: string]: lnrpc.Feature__Output<string> }>>();
  expectType<Equal<typeof info, lnrpc.GetInfoResponse__Output>>();
  // @ts-expect-error fields keep their proto names (keepCase)
  info.blockHeight;

  const invoice = await client.lookupInvoice({ r_hash_str: 'ab' });
  expectType<Equal<typeof invoice.r_hash, Buffer>>();
  expectType<Equal<typeof invoice.state, 'OPEN' | 'SETTLED' | 'CANCELED' | 'ACCEPTED'>>();
  // A message field is null when it is not set
  const channel = await client.getChanInfo({ chan_id: '1' });
  expectType<Equal<typeof channel.node1_policy, lnrpc.RoutingPolicy__Output<string> | null>>();
}

async function requests() {
  const client = await connect();
  await client.addInvoice({ value: 1000, memo: 'coffee' });
  await client.addInvoice({ value: '1000', r_preimage: Buffer.alloc(32), private: true });
  await client.addInvoice({ value_msat: { low: 1, high: 0 }, r_preimage: 'base64==' });
  await client.addInvoice({ route_hints: [{ hop_hints: [{ chan_id: '1', fee_base_msat: 1 }] }] });
  // @ts-expect-error unknown field
  await client.addInvoice({ valeu: 1000 });
  // @ts-expect-error wrong type
  await client.addInvoice({ value: true });
  // @ts-expect-error the request argument is required
  await client.getInfo();

  // Enums accept names and numbers
  await client.listInvoices({ index_offset: 0, num_max_invoices: 10, reversed: true });
  await client.Router.updateChanStatus({ action: 'DISABLE' });
  await client.Router.updateChanStatus({ action: 1 });
  // @ts-expect-error not a value of the enum
  await client.Router.updateChanStatus({ action: 'OFF' });

  // Call options and metadata
  await client.getInfo({}, { deadline: Date.now() + 1000 });
  const { Metadata } = await import('@grpc/grpc-js');
  await client.getInfo({}, new Metadata(), { deadline: Date.now() + 1000 });

  // An output can be passed back as an input
  const info = await client.Lightning.getNodeInfo({ pub_key: 'ab', include_channels: true });
  const node: lnrpc.LightningNode = info.node!;
  void node;
}

async function streams() {
  const client = await connect();
  const invoices = client.subscribeInvoices({ add_index: '0' });
  invoices.on('data', (invoice: lnrpc.Invoice__Output) => invoice.r_hash.toString('hex'));
  invoices.cancel();

  const payments = client.Router.sendPaymentV2({ payment_request: 'lnbc1', timeout_seconds: 60 });
  payments.on('data', payment => {
    expectType<Equal<typeof payment.status, lnrpc.Payment.PaymentStatus__Output>>();
  });

  const interceptor = client.Router.htlcInterceptor();
  interceptor.on('data', (request: routerrpc.ForwardHtlcInterceptRequest__Output) => {
    interceptor.write({ incoming_circuit_key: request.incoming_circuit_key, action: 'RESUME' });
  });
  // @ts-expect-error not a value of ResolveHoldForwardAction
  interceptor.write({ action: 'ACCEPT' });
  interceptor.on('data', request => {
    expectType<Equal<typeof request, routerrpc.ForwardHtlcInterceptRequest__Output>>();
  });

  // Responses of streams are typed in events and in async iteration
  const graph = client.subscribeChannelGraph({});
  graph.on('data', update => {
    expectType<Equal<typeof update, lnrpc.GraphTopologyUpdate__Output>>();
  }).on('end', () => undefined);
  for await (const update of graph) {
    expectType<Equal<typeof update, lnrpc.GraphTopologyUpdate__Output>>();
  }
}

async function longsAsNumbers(flag: boolean, options: ConnectOptions) {
  const numbers = await connect({ longsAsNumbers: true });
  const info = await numbers.getInfo({});
  expectType<Equal<typeof info.best_header_timestamp, number>>();
  const invoice = await numbers.Lightning.lookupInvoice({});
  expectType<Equal<typeof invoice.value_msat, number>>();

  const strings = await (await connect({ longsAsNumbers: false })).getInfo({});
  expectType<Equal<typeof strings.best_header_timestamp, string>>();

  // Not known at compile time
  const either = await (await connect({ longsAsNumbers: flag })).getInfo({});
  expectType<Equal<typeof either.best_header_timestamp, string | number>>();
  const fromVariable = await (await connect(options)).getInfo({});
  expectType<Equal<typeof fromVariable.best_header_timestamp, string | number>>();
}

async function connectOptions() {
  await connect({ lndHost: 'node', lndPort: 10009, cert: 'base64', macaroon: 'base64' });
  await connect({ lndPort: '10009', certPath: '/tls.cert', macaroonPath: '/admin.macaroon' });
  await connect({ noCert: true, noMacaroons: true, strict: true });
  // @ts-expect-error unknown option
  await connect({ lndHost: 'node', lndPortt: 10009 });
  // @ts-expect-error wrong type of an option
  await connect({ noCert: 'yes' });
  // @ts-expect-error not a bundled line
  await connect({ lndHost: 'node', lndVersion: '0.17' });

  // A configuration object with more fields than connect() needs is fine
  const stored = { lndHost: 'node', lndPort: 10009, label: 'main node' };
  const fromStored = await connect(stored);
  expectType<Equal<(typeof fromStored)['lnrpc'], LndClient['lnrpc']>>();
  interface NodeConfig extends ConnectOptions {
    name: string;
  }
  const config: NodeConfig = { name: 'main', lndHost: 'node' };
  const fromConfig = await (await connect(config)).getInfo({});
  expectType<Equal<typeof fromConfig.best_header_timestamp, string | number>>();
}

function runtimeExports(error: unknown) {
  expectType<Equal<typeof defaultLndVersion, '0.20'>>();
  const lines: readonly string[] = supportedLndVersions;
  void lines;
  if (error instanceof ValidationError) {
    const where: string = error.path + error.messageType + error.message;
    void where;
  }
}

async function rawClients() {
  const client = await connect();
  client.lnrpc.allServices.Lightning.getInfo({}, (err: Error | null) => err);
  client.lnrpc.services.lightning.close();
}

function oneofs(update: lnrpc.OpenStatusUpdate__Output, request: lnrpc.PolicyUpdateRequest) {
  // The property named after a oneof tells which member is set
  expectType<Equal<typeof update.update, 'chan_pending' | 'chan_open' | 'psbt_fund' | undefined>>();
  expectType<Equal<typeof update.chan_open, lnrpc.ChannelOpenUpdate__Output | undefined>>();
  expectType<Equal<typeof request.scope, 'global' | 'chan_point' | undefined>>();
}

// The versioned namespace of the default line is the same as the top-level one
expectType<Equal<Lnd0_20.lnrpc.GetInfoResponse__Output, lnrpc.GetInfoResponse__Output>>();

void [responses, requests, streams, longsAsNumbers, connectOptions, runtimeExports, rawClients, oneofs];
