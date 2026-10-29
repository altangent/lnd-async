/// <reference types="node" />
// Helper types shared by the generated lib/types/lnd-*.d.ts files.
import type { CallOptions, ClientDuplexStream, ClientReadableStream, Metadata } from '@grpc/grpc-js';

/** Type of 64-bit integers in responses: `string`, or `number` with `longsAsNumbers: true`. */
export type LongOut = string | number;

/** An object with the fields of a Long.js value, accepted for 64-bit integers in requests. */
export interface LongLike {
  low: number;
  high: number;
  unsigned?: boolean;
}

/** A 64-bit integer in a request: a number, a decimal string or a Long-like object. */
export type LongIn = number | string | LongLike;

/** A `bytes` field in a request: a Buffer or Uint8Array, or a base64 string. */
export type BytesIn = Buffer | Uint8Array | string;

/** A `bytes` field in a response. */
export type BytesOut = Buffer;

/** A unary RPC: the promise resolves with the response. */
export interface Unary<Request, Response> {
  (request: Request, options?: CallOptions): Promise<Response>;
  (request: Request, metadata: Metadata, options?: CallOptions): Promise<Response>;
}

/** grpc-js types `data` events and async iteration as `any`; these give them the response type. */
export interface ResponseEvents<Response> {
  on(event: 'data', listener: (response: Response) => void): this;
  once(event: 'data', listener: (response: Response) => void): this;
  addListener(event: 'data', listener: (response: Response) => void): this;
  [Symbol.asyncIterator](): AsyncIterator<Response>;
}

/** The stream returned by a server-streaming RPC. */
export type ResponseStream<Response> = ResponseEvents<Response> & ClientReadableStream<Response>;

/** The stream returned by a bidirectional-streaming RPC. */
export type DuplexStream<Request, Response> = ResponseEvents<Response> &
  ClientDuplexStream<Request, Response>;

/** A server-streaming RPC: returns a stream of responses. */
export interface ServerStream<Request, Response> {
  (request: Request, options?: CallOptions): ResponseStream<Response>;
  (request: Request, metadata: Metadata, options?: CallOptions): ResponseStream<Response>;
}

/** A bidirectional-streaming RPC: write requests to the stream, read responses from it. */
export interface Bidi<Request, Response> {
  (options?: CallOptions): DuplexStream<Request, Response>;
  (metadata: Metadata, options?: CallOptions): DuplexStream<Request, Response>;
}
