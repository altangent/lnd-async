/// <reference types="node" />
import type { Client } from '@grpc/grpc-js';
import type { LongOut } from './types/common';
import type {
  DefaultLndVersion,
  LegacyMethodsByVersion,
  LndVersion,
  ServicesByVersion,
} from './types';

export * from './types';
export type {
  Bidi,
  BytesIn,
  BytesOut,
  DuplexStream,
  LongIn,
  LongLike,
  LongOut,
  ResponseEvents,
  ResponseStream,
  ServerStream,
  Unary,
} from './types/common';

export interface ConnectOptions {
  /** Host of the LND gRPC interface. Default: `localhost`. */
  lndHost?: string;
  /** Port of the LND gRPC interface. Default: `10009`. */
  lndPort?: number | string;
  /** Path to `tls.cert`. Default: `tls.cert` in the OS-specific LND data directory. */
  certPath?: string;
  /** Contents of `tls.cert`, base64-encoded. Takes precedence over `certPath`. */
  cert?: string;
  /** Use the system CA store instead of `tls.cert`, for a publicly-signed certificate. */
  noCert?: boolean;
  /** Path to the macaroon file. Default: `admin.macaroon` of mainnet in the LND data directory. */
  macaroonPath?: string;
  /** Contents of the macaroon file, base64-encoded. Takes precedence over `macaroonPath`. */
  macaroon?: string;
  /** Do not send a macaroon. */
  noMacaroons?: boolean;
  /** Return 64-bit integers as `number` instead of `string` (values above 2^53 lose precision). */
  longsAsNumbers?: boolean;
  /**
   * LND release line whose protos (and types) to use. Default: {@link DefaultLndVersion}.
   * At runtime a full version string such as `'0.21.5-beta'` or `'v0.21.5-beta'` is accepted
   * as well and mapped to its line.
   */
  lndVersion?: LndVersion;
  /**
   * Validate every request before it is sent and throw {@link ValidationError} on an unknown
   * field, a value of the wrong type or an unknown enum value. Without it, unknown fields are
   * silently dropped and values are coerced, as protobufjs does.
   */
  strict?: boolean;
}

/** A raw @grpc/grpc-js client with callback-style methods. */
export type RawServiceClient = Client & { [method: string]: (...args: any[]) => any };

export interface RawClients {
  /** The `Lightning`, `WalletUnlocker` and `State` clients, keyed in lowerCamelCase. */
  services: { [service: string]: RawServiceClient };
  /** All clients, keyed by service name. */
  allServices: { [service: string]: RawServiceClient };
}

/**
 * The object returned by connect(): the methods of `Lightning`, `WalletUnlocker` and `State`
 * directly on it, every service as `client.<Service>`, the raw clients as `client.lnrpc`.
 */
export type LndClient<V extends LndVersion = DefaultLndVersion, L extends LongOut = string> =
  LegacyMethodsByVersion<L>[V] & ServicesByVersion<L>[V] & { lnrpc: RawClients };

/** The type of 64-bit integers in responses for a value of `longsAsNumbers`. */
export type LongsFor<N extends boolean> = N extends true ? number : string;

/**
 * Creates the gRPC clients of every LND service. Nothing is sent to LND until the first call.
 * The client type follows the options: `lndVersion` selects the API of that LND line and
 * `longsAsNumbers: true` turns 64-bit integers in responses into numbers. When an option is not
 * known at compile time (a `boolean`, a union of lines) the client type covers every case.
 */
export function connect<V extends LndVersion = DefaultLndVersion, N extends boolean = false>(
  options?: Omit<ConnectOptions, 'lndVersion' | 'longsAsNumbers'> & {
    /** LND release line whose protos (and types) to use. Default: {@link DefaultLndVersion}. */
    lndVersion?: V;
    /** Return 64-bit integers as `number` instead of `string` (values above 2^53 lose precision). */
    longsAsNumbers?: N;
  }
): Promise<LndClient<V, LongsFor<N>>>;

/** LND lines with bundled protos, oldest first. */
export const supportedLndVersions: readonly LndVersion[];

/** The line used when connect() gets no `lndVersion`. */
export const defaultLndVersion: DefaultLndVersion;

/** Thrown in strict mode when a request does not match its protobuf message. */
export class ValidationError extends TypeError {
  /** Full name of the message type of the request, e.g. `lnrpc.Invoice`. */
  readonly messageType: string;
  /** Where in the request the problem is, e.g. `route_hints[0].hop_hints[1].chan_id`. */
  readonly path: string;
}
