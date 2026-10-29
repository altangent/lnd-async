// Compile-only checks of `lndVersion`: the client type follows the selected LND line.
import { connect } from '../../lib/lnd-async';
import type { ConnectOptions, LndClient, LndVersion, Lnd0_18, Lnd0_21, lnrpc } from '../../lib/lnd-async';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
function expectType<T extends true>(): void {}

async function defaultLine() {
  const client = await connect();
  expectType<Equal<typeof client, LndClient<'0.20', string>>>();
  // Deprecated in 0.20 but still present
  await client.sendPaymentSync({ payment_request: 'lnbc1' });
  await client.deleteCanceledInvoice({ invoice_hash: 'ab' });
  // @ts-expect-error added in 0.21
  client.sendOnionMessage;
}

async function line021() {
  const client = await connect({ lndVersion: '0.21' });
  expectType<Equal<typeof client, LndClient<'0.21', string>>>();
  await client.sendOnionMessage({ peer: Buffer.alloc(33), path_key: Buffer.alloc(33), onion: Buffer.alloc(0) });
  client.subscribeOnionMessages({}).on('data', message => {
    expectType<Equal<typeof message, Lnd0_21.lnrpc.OnionMessageUpdate__Output>>();
  });
  await client.Router.deleteForwardingHistory({});
  // @ts-expect-error removed in 0.21
  await client.sendPaymentSync({ payment_request: 'lnbc1' });
  // @ts-expect-error removed in 0.21
  client.Router.trackPayment;
  // @ts-expect-error outgoing_chan_id was removed from SendPaymentRequest in 0.21
  client.Router.sendPaymentV2({ payment_request: 'lnbc1', outgoing_chan_id: '1' });
  client.Router.sendPaymentV2({ payment_request: 'lnbc1', outgoing_chan_ids: ['1'] });
}

async function line018() {
  const client = await connect({ lndVersion: '0.18', longsAsNumbers: true });
  const info = await client.getInfo({});
  expectType<Equal<typeof info, Lnd0_18.lnrpc.GetInfoResponse__Output<number>>>();
  expectType<Equal<typeof info.best_header_timestamp, number>>();
  // @ts-expect-error added in 0.19
  client.Lightning.deleteCanceledInvoice;
  // @ts-expect-error added in 0.20
  client.Dev.quiesce;
}

async function unknownAtCompileTime(version: LndVersion, options: ConnectOptions) {
  // A union of clients: methods common to all lines are callable
  const client = await connect({ lndVersion: version });
  const info = await client.getInfo({});
  const height: number = info.block_height;
  void height;
  // @ts-expect-error not present in every line
  client.sendOnionMessage;

  const fromVariable = await connect(options);
  await fromVariable.getInfo({});
}

async function invalidVersion() {
  // @ts-expect-error not a bundled line (a full version string is accepted only at runtime)
  await connect({ lndVersion: '0.21.5-beta' });
  // @ts-expect-error not a bundled line
  await connect({ lndVersion: '0.17' });
}

// Message types of different lines are distinct where the protos differ
type Payment020 = lnrpc.SendRequest;
// @ts-expect-error SendRequest was removed in 0.21
type Payment021 = Lnd0_21.lnrpc.SendRequest;

void [defaultLine, line021, line018, unknownAtCompileTime, invalidVersion];
export type { Payment020, Payment021 };
