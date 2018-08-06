declare module 'lnd-async' {
  export interface ConnectOptions {
    lndHost?: string;
    lndPort?: number;
    certPath?: string;
    cert?: string;
    macaroonPath?: string;
    macaroon?: string;
    noMacaroons?: boolean;
  }

  const lnd: {
    connect(opts?: ConnectOptions): Promise<lnrpc.Lightning>;
  };
  export default lnd;

  /** Namespace lnrpc. */
  export namespace lnrpc {
    /** Represents a Lightning client */
    class Lightning {
      /**
       * lncli: `walletbalance`
       * WalletBalance returns total unspent outputs(confirmed and unconfirmed), all
       * confirmed unspent outputs and all unconfirmed unspent outputs under control
       * of the wallet.
       * @param request WalletBalanceRequest message or plain object
       * @returns Promise
       */
      public walletBalance(
        request: lnrpc.IWalletBalanceRequest
      ): Promise<lnrpc.WalletBalanceResponse>;

      /**
       * lncli: `channelbalance`
       * ChannelBalance returns the total funds available across all open channels
       * in satoshis.
       * @param request ChannelBalanceRequest message or plain object
       * @returns Promise
       */
      public channelBalance(
        request: lnrpc.IChannelBalanceRequest
      ): Promise<lnrpc.ChannelBalanceResponse>;

      /**
       * lncli: `listchaintxns`
       * GetTransactions returns a list describing all the known transactions
       * relevant to the wallet.
       * @param request GetTransactionsRequest message or plain object
       * @returns Promise
       */
      public getTransactions(
        request: lnrpc.IGetTransactionsRequest
      ): Promise<lnrpc.TransactionDetails>;

      /**
       * lncli: `sendcoins`
       * SendCoins executes a request to send coins to a particular address. Unlike
       * SendMany, this RPC call only allows creating a single output at a time. If
       * neither target_conf, or sat_per_byte are set, then the internal wallet will
       * consult its fee model to determine a fee for the default confirmation
       * target.
       * @param request SendCoinsRequest message or plain object
       * @returns Promise
       */
      public sendCoins(request: lnrpc.ISendCoinsRequest): Promise<lnrpc.SendCoinsResponse>;

      /**
       * SubscribeTransactions creates a uni-directional stream from the server to
       * the client in which any newly discovered transactions relevant to the
       * wallet are sent over.
       * @param request GetTransactionsRequest message or plain object
       * @returns Promise
       */
      public subscribeTransactions(
        request: lnrpc.IGetTransactionsRequest
      ): Promise<lnrpc.Transaction>;

      /**
       * lncli: `sendmany`
       * SendMany handles a request for a transaction that creates multiple specified
       * outputs in parallel. If neither target_conf, or sat_per_byte are set, then
       * the internal wallet will consult its fee model to determine a fee for the
       * default confirmation target.
       * @param request SendManyRequest message or plain object
       * @returns Promise
       */
      public sendMany(request: lnrpc.ISendManyRequest): Promise<lnrpc.SendManyResponse>;

      /**
       * lncli: `newaddress`
       * NewAddress creates a new address under control of the local wallet.
       * @param request NewAddressRequest message or plain object
       * @returns Promise
       */
      public newAddress(request: lnrpc.INewAddressRequest): Promise<lnrpc.NewAddressResponse>;

      /**
       * NewWitnessAddress creates a new witness address under control of the local wallet.
       * @param request NewWitnessAddressRequest message or plain object
       * @returns Promise
       */
      public newWitnessAddress(
        request: lnrpc.INewWitnessAddressRequest
      ): Promise<lnrpc.NewAddressResponse>;

      /**
       * lncli: `signmessage`
       * SignMessage signs a message with this node's private key. The returned
       * signature string is `zbase32` encoded and pubkey recoverable, meaning that
       * only the message digest and signature are needed for verification.
       * @param request SignMessageRequest message or plain object
       * @returns Promise
       */
      public signMessage(request: lnrpc.ISignMessageRequest): Promise<lnrpc.SignMessageResponse>;

      /**
       * lncli: `verifymessage`
       * VerifyMessage verifies a signature over a msg. The signature must be
       * zbase32 encoded and signed by an active node in the resident node's
       * channel database. In addition to returning the validity of the signature,
       * VerifyMessage also returns the recovered pubkey from the signature.
       * @param request VerifyMessageRequest message or plain object
       * @returns Promise
       */
      public verifyMessage(
        request: lnrpc.IVerifyMessageRequest
      ): Promise<lnrpc.VerifyMessageResponse>;

      /**
       * lncli: `connect`
       * ConnectPeer attempts to establish a connection to a remote peer. This is at
       * the networking level, and is used for communication between nodes. This is
       * distinct from establishing a channel with a peer.
       * @param request ConnectPeerRequest message or plain object
       * @returns Promise
       */
      public connectPeer(request: lnrpc.IConnectPeerRequest): Promise<lnrpc.ConnectPeerResponse>;

      /**
       * lncli: `disconnect`
       * DisconnectPeer attempts to disconnect one peer from another identified by a
       * given pubKey. In the case that we currently have a pending or active channel
       * with the target peer, then this action will be not be allowed.
       * @param request DisconnectPeerRequest message or plain object
       * @returns Promise
       */
      public disconnectPeer(
        request: lnrpc.IDisconnectPeerRequest
      ): Promise<lnrpc.DisconnectPeerResponse>;

      /**
       * lncli: `listpeers`
       * ListPeers returns a verbose listing of all currently active peers.
       * @param request ListPeersRequest message or plain object
       * @returns Promise
       */
      public listPeers(request: lnrpc.IListPeersRequest): Promise<lnrpc.ListPeersResponse>;

      /**
       * lncli: `getinfo`
       * GetInfo returns general information concerning the lightning node including
       * it's identity pubkey, alias, the chains it is connected to, and information
       * concerning the number of open+pending channels.
       * @param request GetInfoRequest message or plain object
       * @returns Promise
       */
      public getInfo(request: lnrpc.IGetInfoRequest): Promise<lnrpc.GetInfoResponse>;

      /**
       * lncli: `pendingchannels`
       * PendingChannels returns a list of all the channels that are currently
       * considered "pending". A channel is pending if it has finished the funding
       * workflow and is waiting for confirmations for the funding txn, or is in the
       * process of closure, either initiated cooperatively or non-cooperatively.
       * @param request PendingChannelsRequest message or plain object
       * @returns Promise
       */
      public pendingChannels(
        request: lnrpc.IPendingChannelsRequest
      ): Promise<lnrpc.PendingChannelsResponse>;

      /**
       * lncli: `listchannels`
       * ListChannels returns a description of all the open channels that this node
       * is a participant in.
       * @param request ListChannelsRequest message or plain object
       * @returns Promise
       */
      public listChannels(request: lnrpc.IListChannelsRequest): Promise<lnrpc.ListChannelsResponse>;

      /**
       * lncli: `closedchannels`
       * ClosedChannels returns a description of all the closed channels that
       * this node was a participant in.
       * @param request ClosedChannelsRequest message or plain object
       * @returns Promise
       */
      public closedChannels(
        request: lnrpc.IClosedChannelsRequest
      ): Promise<lnrpc.ClosedChannelsResponse>;

      /**
       * OpenChannelSync is a synchronous version of the OpenChannel RPC call. This
       * call is meant to be consumed by clients to the REST proxy. As with all
       * other sync calls, all byte slices are intended to be populated as hex
       * encoded strings.
       * @param request OpenChannelRequest message or plain object
       * @returns Promise
       */
      public openChannelSync(request: lnrpc.IOpenChannelRequest): Promise<lnrpc.ChannelPoint>;

      /**
       * lncli: `openchannel`
       * OpenChannel attempts to open a singly funded channel specified in the
       * request to a remote peer. Users are able to specify a target number of
       * blocks that the funding transaction should be confirmed in, or a manual fee
       * rate to us for the funding transaction. If neither are specified, then a
       * lax block confirmation target is used.
       * @param request OpenChannelRequest message or plain object
       * @returns Promise
       */
      public openChannel(
        request: lnrpc.IOpenChannelRequest
      ): Promise<{
        on: ((data: 'data', cb: (update: lnrpc.OpenStatusUpdate) => any) => any) &
          ((data: 'status', cb: (update: any) => any) => any) &
          ((data: 'end', cb: () => any) => any);
      }>;

      /**
       * lncli: `closechannel`
       * CloseChannel attempts to close an active channel identified by its channel
       * outpoint (ChannelPoint). The actions of this method can additionally be
       * augmented to attempt a force close after a timeout period in the case of an
       * inactive peer. If a non-force close (cooperative closure) is requested,
       * then the user can specify either a target number of blocks until the
       * closure transaction is confirmed, or a manual fee rate. If neither are
       * specified, then a default lax, block confirmation target is used.
       * @param request CloseChannelRequest message or plain object
       * @returns Promise
       */
      public closeChannel(request: lnrpc.ICloseChannelRequest): Promise<lnrpc.CloseStatusUpdate>;

      /**
       * lncli: `sendpayment`
       * SendPayment dispatches a bi-directional streaming RPC for sending payments
       * through the Lightning Network. A single RPC invocation creates a persistent
       * bi-directional stream allowing clients to rapidly send payments through the
       * Lightning Network with a single persistent connection.
       * @param request SendRequest message or plain object
       * @returns Promise
       */
      public sendPayment(
        request: lnrpc.ISendRequest
      ): Promise<{
        on: ((data: 'data', cb: (update: lnrpc.SendResponse) => any) => any) &
          ((data: 'status', cb: (update: any) => any) => any) &
          ((data: 'end', cb: () => any) => any);
      }>;

      /**
       * SendPaymentSync is the synchronous non-streaming version of SendPayment.
       * This RPC is intended to be consumed by clients of the REST proxy.
       * Additionally, this RPC expects the destination's public key and the payment
       * hash (if any) to be encoded as hex strings.
       * @param request SendRequest message or plain object
       * @returns Promise
       */
      public sendPaymentSync(request: lnrpc.ISendRequest): Promise<lnrpc.SendResponse>;

      /**
       * lncli: `sendtoroute`
       * SendToRoute is a bi-directional streaming RPC for sending payment through
       * the Lightning Network. This method differs from SendPayment in that it
       * allows users to specify a full route manually. This can be used for things
       * like rebalancing, and atomic swaps.
       * @param request SendToRouteRequest message or plain object
       * @returns Promise
       */
      public sendToRoute(request: lnrpc.ISendToRouteRequest): Promise<lnrpc.SendResponse>;

      /**
       * SendToRouteSync is a synchronous version of SendToRoute. It Will block
       * until the payment either fails or succeeds.
       * @param request SendToRouteRequest message or plain object
       * @returns Promise
       */
      public sendToRouteSync(request: lnrpc.ISendToRouteRequest): Promise<lnrpc.SendResponse>;

      /**
       * lncli: `addinvoice`
       * AddInvoice attempts to add a new invoice to the invoice database. Any
       * duplicated invoices are rejected, therefore all invoices *must* have a
       * unique payment preimage.
       * @param request Invoice message or plain object
       * @returns Promise
       */
      public addInvoice(request: lnrpc.IInvoice): Promise<lnrpc.AddInvoiceResponse>;

      /**
       * lncli: `listinvoices`
       * ListInvoices returns a list of all the invoices currently stored within the
       * database. Any active debug invoices are ignored.
       * @param request ListInvoiceRequest message or plain object
       * @returns Promise
       */
      public listInvoices(request: lnrpc.IListInvoiceRequest): Promise<lnrpc.ListInvoiceResponse>;

      /**
       * lncli: `lookupinvoice`
       * LookupInvoice attempts to look up an invoice according to its payment hash.
       * The passed payment hash *must* be exactly 32 bytes, if not, an error is
       * returned.
       * @param request PaymentHash message or plain object
       * @returns Promise
       */
      public lookupInvoice(request: lnrpc.IPaymentHash): Promise<lnrpc.Invoice>;

      /**
       * SubscribeInvoices returns a uni-directional stream (sever -> client) for
       * notifying the client of newly added/settled invoices. The caller can
       * optionally specify the add_index and/or the settle_index. If the add_index
       * is specified, then we'll first start by sending add invoice events for all
       * invoices with an add_index greater than the specified value.  If the
       * settle_index is specified, the next, we'll send out all settle events for
       * invoices with a settle_index greater than the specified value.  One or both
       * of these fields can be set. If no fields are set, then we'll only send out
       * the latest add/settle events.
       * @param request InvoiceSubscription message or plain object
       * @returns Promise
       */
      public subscribeInvoices(request: lnrpc.IInvoiceSubscription): Promise<lnrpc.Invoice>;

      /**
       * lncli: `decodepayreq`
       * DecodePayReq takes an encoded payment request string and attempts to decode
       * it, returning a full description of the conditions encoded within the
       * payment request.
       * @param request PayReqString message or plain object
       * @returns Promise
       */
      public decodePayReq(request: lnrpc.IPayReqString): Promise<lnrpc.PayReq>;

      /**
       * lncli: `listpayments`
       * ListPayments returns a list of all outgoing payments.
       * @param request ListPaymentsRequest message or plain object
       * @returns Promise
       */
      public listPayments(request: lnrpc.IListPaymentsRequest): Promise<lnrpc.ListPaymentsResponse>;

      /**
       * DeleteAllPayments deletes all outgoing payments from DB.
       * @param request DeleteAllPaymentsRequest message or plain object
       * @returns Promise
       */
      public deleteAllPayments(
        request: lnrpc.IDeleteAllPaymentsRequest
      ): Promise<lnrpc.DeleteAllPaymentsResponse>;

      /**
       * lncli: `describegraph`
       * DescribeGraph returns a description of the latest graph state from the
       * point of view of the node. The graph information is partitioned into two
       * components: all the nodes/vertexes, and all the edges that connect the
       * vertexes themselves.  As this is a directed graph, the edges also contain
       * the node directional specific routing policy which includes: the time lock
       * delta, fee information, etc.
       * @param request ChannelGraphRequest message or plain object
       * @returns Promise
       */
      public describeGraph(request: lnrpc.IChannelGraphRequest): Promise<lnrpc.ChannelGraph>;

      /**
       * lncli: `getchaninfo`
       * GetChanInfo returns the latest authenticated network announcement for the
       * given channel identified by its channel ID: an 8-byte integer which
       * uniquely identifies the location of transaction's funding output within the
       * blockchain.
       * @param request ChanInfoRequest message or plain object
       * @returns Promise
       */
      public getChanInfo(request: lnrpc.IChanInfoRequest): Promise<lnrpc.ChannelEdge>;

      /**
       * lncli: `getnodeinfo`
       * GetNodeInfo returns the latest advertised, aggregated, and authenticated
       * channel information for the specified node identified by its public key.
       * @param request NodeInfoRequest message or plain object
       * @returns Promise
       */
      public getNodeInfo(request: lnrpc.INodeInfoRequest): Promise<lnrpc.NodeInfo>;

      /**
       * lncli: `queryroutes`
       * QueryRoutes attempts to query the daemon's Channel Router for a possible
       * route to a target destination capable of carrying a specific amount of
       * satoshis. The retuned route contains the full details required to craft and
       * send an HTLC, also including the necessary information that should be
       * present within the Sphinx packet encapsulated within the HTLC.
       * @param request QueryRoutesRequest message or plain object
       * @returns Promise
       */
      public queryRoutes(request: lnrpc.IQueryRoutesRequest): Promise<lnrpc.QueryRoutesResponse>;

      /**
       * lncli: `getnetworkinfo`
       * GetNetworkInfo returns some basic stats about the known channel graph from
       * the point of view of the node.
       * @param request NetworkInfoRequest message or plain object
       * @returns Promise
       */
      public getNetworkInfo(request: lnrpc.INetworkInfoRequest): Promise<lnrpc.NetworkInfo>;

      /**
       * lncli: `stop`
       * StopDaemon will send a shutdown request to the interrupt handler, triggering
       * a graceful shutdown of the daemon.
       * @param request StopRequest message or plain object
       * @returns Promise
       */
      public stopDaemon(request: lnrpc.IStopRequest): Promise<lnrpc.StopResponse>;

      /**
       * SubscribeChannelGraph launches a streaming RPC that allows the caller to
       * receive notifications upon any changes to the channel graph topology from
       * the point of view of the responding node. Events notified include: new
       * nodes coming online, nodes updating their authenticated attributes, new
       * channels being advertised, updates in the routing policy for a directional
       * channel edge, and when channels are closed on-chain.
       * @param request GraphTopologySubscription message or plain object
       * @returns Promise
       */
      public subscribeChannelGraph(
        request: lnrpc.IGraphTopologySubscription
      ): Promise<lnrpc.GraphTopologyUpdate>;

      /**
       * lncli: `debuglevel`
       * DebugLevel allows a caller to programmatically set the logging verbosity of
       * lnd. The logging can be targeted according to a coarse daemon-wide logging
       * level, or in a granular fashion to specify the logging for a target
       * sub-system.
       * @param request DebugLevelRequest message or plain object
       * @returns Promise
       */
      public debugLevel(request: lnrpc.IDebugLevelRequest): Promise<lnrpc.DebugLevelResponse>;
      /**
       * lncli: `feereport`
       * FeeReport allows the caller to obtain a report detailing the current fee
       * schedule enforced by the node globally for each channel.
       * @param request FeeReportRequest message or plain object
       * @returns Promise
       */
      public feeReport(request: lnrpc.IFeeReportRequest): Promise<lnrpc.FeeReportResponse>;

      /**
       * lncli: `updatechanpolicy`
       * UpdateChannelPolicy allows the caller to update the fee schedule and
       * channel policies for all channels globally, or a particular channel.
       * @param request PolicyUpdateRequest message or plain object
       * @returns Promise
       */
      public updateChannelPolicy(
        request: lnrpc.IPolicyUpdateRequest
      ): Promise<lnrpc.PolicyUpdateResponse>;

      /**
       * lncli: `fwdinghistory`
       * ForwardingHistory allows the caller to query the htlcswitch for a record of
       * all HTLC's forwarded within the target time range, and integer offset
       * within that time range. If no time-range is specified, then the first chunk
       * of the past 24 hrs of forwarding history are returned.
       *
       * A list of forwarding events are returned. The size of each forwarding event
       * is 40 bytes, and the max message size able to be returned in gRPC is 4 MiB.
       * As a result each message can only contain 50k entries.  Each response has
       * the index offset of the last entry. The index offset can be provided to the
       * request to allow the caller to skip a series of records.
       * @param request ForwardingHistoryRequest message or plain object
       * @returns Promise
       */
      public forwardingHistory(
        request: lnrpc.IForwardingHistoryRequest
      ): Promise<lnrpc.ForwardingHistoryResponse>;
    }

    /** Properties of a Transaction. */
    interface ITransaction {
      /** The transaction hash */
      tx_hash?: string | null;

      /** The transaction ammount, denominated in satoshis */
      amount?: number | null;

      /** The number of confirmations */
      num_confirmations?: number | null;

      /** The hash of the block this transaction was included in */
      block_hash?: string | null;

      /** The height of the block this transaction was included in */
      block_height?: number | null;

      /** Timestamp of this transaction */
      time_stamp?: number | null;

      /** Fees paid for this transaction */
      total_fees?: number | null;

      /** Addresses that received funds for this transaction */
      dest_addresses?: string[] | null;
    }

    /** Represents a Transaction. */
    class Transaction implements ITransaction {
      /**
       * Constructs a new Transaction.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ITransaction);

      /** The transaction hash */
      public tx_hash: string;

      /** The transaction ammount, denominated in satoshis */
      public amount: number;

      /** The number of confirmations */
      public num_confirmations: number;

      /** The hash of the block this transaction was included in */
      public block_hash: string;

      /** The height of the block this transaction was included in */
      public block_height: number;

      /** Timestamp of this transaction */
      public time_stamp: number;

      /** Fees paid for this transaction */
      public total_fees: number;

      /** Addresses that received funds for this transaction */
      public dest_addresses: string[];
    }

    /** Properties of a GetTransactionsRequest. */
    interface IGetTransactionsRequest {}

    /** Represents a GetTransactionsRequest. */
    class GetTransactionsRequest implements IGetTransactionsRequest {
      /**
       * Constructs a new GetTransactionsRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IGetTransactionsRequest);
    }

    /** Properties of a TransactionDetails. */
    interface ITransactionDetails {
      /** The list of transactions relevant to the wallet. */
      transactions?: lnrpc.ITransaction[] | null;
    }

    /** Represents a TransactionDetails. */
    class TransactionDetails implements ITransactionDetails {
      /**
       * Constructs a new TransactionDetails.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ITransactionDetails);

      /** The list of transactions relevant to the wallet. */
      public transactions: lnrpc.ITransaction[];
    }

    /** Properties of a FeeLimit. */
    interface IFeeLimit {
      /** The fee limit expressed as a fixed amount of satoshis. */
      fixed?: number | null;

      /** The fee limit expressed as a percentage of the payment amount. */
      percent?: number | null;
    }

    /** Represents a FeeLimit. */
    class FeeLimit implements IFeeLimit {
      /**
       * Constructs a new FeeLimit.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IFeeLimit);

      /** The fee limit expressed as a fixed amount of satoshis. */
      public fixed: number;

      /** The fee limit expressed as a percentage of the payment amount. */
      public percent: number;

      /** FeeLimit limit. */
      public limit?: 'fixed' | 'percent';
    }

    /** Properties of a SendRequest. */
    interface ISendRequest {
      /** The identity pubkey of the payment recipient */
      dest?: Uint8Array | null;

      /** The hex-encoded identity pubkey of the payment recipient */
      dest_string?: string | null;

      /** Number of satoshis to send. */
      amt?: number | null;

      /** The hash to use within the payment's HTLC */
      payment_hash?: Uint8Array | null;

      /** The hex-encoded hash to use within the payment's HTLC */
      payment_hash_string?: string | null;

      /**
       * A bare-bones invoice for a payment within the Lightning Network.  With the
       * details of the invoice, the sender has all the data necessary to send a
       * payment to the recipient.
       */
      payment_request?: string | null;

      /**
       * The CLTV delta from the current height that should be used to set the
       * timelock for the final hop.
       */
      final_cltv_delta?: number | null;

      /**
       * The maximum number of satoshis that will be paid as a fee of the payment.
       * This value can be represented either as a percentage of the amount being
       * sent, or as a fixed amount of the maximum fee the user is willing the pay to
       * send the payment.
       */
      fee_limit?: lnrpc.IFeeLimit | null;
    }

    /** Represents a SendRequest. */
    class SendRequest implements ISendRequest {
      /**
       * Constructs a new SendRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ISendRequest);

      /** The identity pubkey of the payment recipient */
      public dest: Uint8Array;

      /** The hex-encoded identity pubkey of the payment recipient */
      public dest_string: string;

      /** Number of satoshis to send. */
      public amt: number;

      /** The hash to use within the payment's HTLC */
      public payment_hash: Uint8Array;

      /** The hex-encoded hash to use within the payment's HTLC */
      public payment_hash_string: string;

      /**
       * A bare-bones invoice for a payment within the Lightning Network.  With the
       * details of the invoice, the sender has all the data necessary to send a
       * payment to the recipient.
       */
      public payment_request: string;

      /**
       * The CLTV delta from the current height that should be used to set the
       * timelock for the final hop.
       */
      public final_cltv_delta: number;

      /**
       * The maximum number of satoshis that will be paid as a fee of the payment.
       * This value can be represented either as a percentage of the amount being
       * sent, or as a fixed amount of the maximum fee the user is willing the pay to
       * send the payment.
       */
      public fee_limit?: lnrpc.IFeeLimit | null;
    }

    /** Properties of a SendResponse. */
    interface ISendResponse {
      /** SendResponse payment_error */
      payment_error?: string | null;

      /** SendResponse payment_preimage */
      payment_preimage?: Uint8Array | null;

      /** SendResponse payment_route */
      payment_route?: lnrpc.IRoute | null;
    }

    /** Represents a SendResponse. */
    class SendResponse implements ISendResponse {
      /**
       * Constructs a new SendResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ISendResponse);

      /** SendResponse payment_error. */
      public payment_error: string;

      /** SendResponse payment_preimage. */
      public payment_preimage: Uint8Array;

      /** SendResponse payment_route. */
      public payment_route?: lnrpc.IRoute | null;
    }

    /** Properties of a SendToRouteRequest. */
    interface ISendToRouteRequest {
      /** The payment hash to use for the HTLC. */
      payment_hash?: Uint8Array | null;

      /** An optional hex-encoded payment hash to be used for the HTLC. */
      payment_hash_string?: string | null;

      /** The set of routes that should be used to attempt to complete the payment. */
      routes?: lnrpc.IRoute[] | null;
    }

    /** Represents a SendToRouteRequest. */
    class SendToRouteRequest implements ISendToRouteRequest {
      /**
       * Constructs a new SendToRouteRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ISendToRouteRequest);

      /** The payment hash to use for the HTLC. */
      public payment_hash: Uint8Array;

      /** An optional hex-encoded payment hash to be used for the HTLC. */
      public payment_hash_string: string;

      /** The set of routes that should be used to attempt to complete the payment. */
      public routes: lnrpc.IRoute[];
    }

    /** Properties of a ChannelPoint. */
    interface IChannelPoint {
      /** Txid of the funding transaction */
      funding_txid_bytes: Uint8Array;

      /** Hex-encoded string representing the funding transaction */
      funding_txid_str: string;

      /** The index of the output of the funding transaction */
      output_index: number;
    }

    /** Represents a ChannelPoint. */
    class ChannelPoint implements IChannelPoint {
      /**
       * Constructs a new ChannelPoint.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelPoint);

      /** Txid of the funding transaction */
      public funding_txid_bytes: Uint8Array;

      /** Hex-encoded string representing the funding transaction */
      public funding_txid_str: string;

      /** The index of the output of the funding transaction */
      public output_index: number;
    }

    /** Properties of a LightningAddress. */
    interface ILightningAddress {
      /** The identity pubkey of the Lightning node */
      pubkey?: string | null;

      /** The network location of the lightning node, e.g. `69.69.69.69:1337` or `localhost:10011` */
      host?: string | null;
    }

    /** Represents a LightningAddress. */
    class LightningAddress implements ILightningAddress {
      /**
       * Constructs a new LightningAddress.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ILightningAddress);

      /** The identity pubkey of the Lightning node */
      public pubkey: string;

      /** The network location of the lightning node, e.g. `69.69.69.69:1337` or `localhost:10011` */
      public host: string;
    }

    /** Properties of a SendManyRequest. */
    interface ISendManyRequest {
      /** The map from addresses to amounts */
      AddrToAmount?: { [k: string]: number } | null;

      /** The target number of blocks that this transaction should be confirmed by. */
      target_conf?: number | null;

      /** A manual fee rate set in sat/byte that should be used when crafting the transaction. */
      sat_per_byte?: number | null;
    }

    /** Represents a SendManyRequest. */
    class SendManyRequest implements ISendManyRequest {
      /**
       * Constructs a new SendManyRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ISendManyRequest);

      /** The map from addresses to amounts */
      public AddrToAmount: { [k: string]: number };

      /** The target number of blocks that this transaction should be confirmed by. */
      public target_conf: number;

      /** A manual fee rate set in sat/byte that should be used when crafting the transaction. */
      public sat_per_byte: number;
    }

    /** Properties of a SendManyResponse. */
    interface ISendManyResponse {
      /** The id of the transaction */
      txid?: string | null;
    }

    /** Represents a SendManyResponse. */
    class SendManyResponse implements ISendManyResponse {
      /**
       * Constructs a new SendManyResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ISendManyResponse);

      /** The id of the transaction */
      public txid: string;
    }

    /** Properties of a SendCoinsRequest. */
    interface ISendCoinsRequest {
      /** The address to send coins to */
      addr?: string | null;

      /** The amount in satoshis to send */
      amount?: number | null;

      /** The target number of blocks that this transaction should be confirmed by. */
      target_conf?: number | null;

      /** A manual fee rate set in sat/byte that should be used when crafting the transaction. */
      sat_per_byte?: number | null;
    }

    /** Represents a SendCoinsRequest. */
    class SendCoinsRequest implements ISendCoinsRequest {
      /**
       * Constructs a new SendCoinsRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ISendCoinsRequest);

      /** The address to send coins to */
      public addr: string;

      /** The amount in satoshis to send */
      public amount: number;

      /** The target number of blocks that this transaction should be confirmed by. */
      public target_conf: number;

      /** A manual fee rate set in sat/byte that should be used when crafting the transaction. */
      public sat_per_byte: number;
    }

    /** Properties of a SendCoinsResponse. */
    interface ISendCoinsResponse {
      /** The transaction ID of the transaction */
      txid?: string | null;
    }

    /** Represents a SendCoinsResponse. */
    class SendCoinsResponse implements ISendCoinsResponse {
      /**
       * Constructs a new SendCoinsResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ISendCoinsResponse);

      /** The transaction ID of the transaction */
      public txid: string;
    }

    /** Properties of a NewAddressRequest. */
    interface INewAddressRequest {
      /** The address type */
      type?: lnrpc.NewAddressRequest.AddressType | null;
    }

    /**
     * `AddressType` has to be one of:
     *
     * - `p2wkh`: Pay to witness key hash (`WITNESS_PUBKEY_HASH` = 0)
     * - `np2wkh`: Pay to nested witness key hash (`NESTED_PUBKEY_HASH` = 1)
     * - `p2pkh`:  Pay to public key hash (`PUBKEY_HASH` = 2)
     */
    class NewAddressRequest implements INewAddressRequest {
      /**
       * Constructs a new NewAddressRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.INewAddressRequest);

      /** The address type */
      public type: lnrpc.NewAddressRequest.AddressType;
    }

    namespace NewAddressRequest {
      /** AddressType enum. */
      enum AddressType {
        WITNESS_PUBKEY_HASH = 0,
        NESTED_PUBKEY_HASH = 1,
      }
    }

    /** Properties of a NewWitnessAddressRequest. */
    interface INewWitnessAddressRequest {}

    /** Represents a NewWitnessAddressRequest. */
    class NewWitnessAddressRequest implements INewWitnessAddressRequest {
      /**
       * Constructs a new NewWitnessAddressRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.INewWitnessAddressRequest);
    }

    /** Properties of a NewAddressResponse. */
    interface INewAddressResponse {
      /** The newly generated wallet address */
      address?: string | null;
    }

    /** Represents a NewAddressResponse. */
    class NewAddressResponse implements INewAddressResponse {
      /**
       * Constructs a new NewAddressResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.INewAddressResponse);

      /** The newly generated wallet address */
      public address: string;
    }

    /** Properties of a SignMessageRequest. */
    interface ISignMessageRequest {
      /** The message to be signed */
      msg?: Uint8Array | null;
    }

    /** Represents a SignMessageRequest. */
    class SignMessageRequest implements ISignMessageRequest {
      /**
       * Constructs a new SignMessageRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ISignMessageRequest);

      /** The message to be signed */
      public msg: Uint8Array;
    }

    /** Properties of a SignMessageResponse. */
    interface ISignMessageResponse {
      /** The signature for the given message */
      signature?: string | null;
    }

    /** Represents a SignMessageResponse. */
    class SignMessageResponse implements ISignMessageResponse {
      /**
       * Constructs a new SignMessageResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ISignMessageResponse);

      /** The signature for the given message */
      public signature: string;
    }

    /** Properties of a VerifyMessageRequest. */
    interface IVerifyMessageRequest {
      /** The message over which the signature is to be verified */
      msg?: Uint8Array | null;

      /** The signature to be verified over the given message */
      signature?: string | null;
    }

    /** Represents a VerifyMessageRequest. */
    class VerifyMessageRequest implements IVerifyMessageRequest {
      /**
       * Constructs a new VerifyMessageRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IVerifyMessageRequest);

      /** The message over which the signature is to be verified */
      public msg: Uint8Array;

      /** The signature to be verified over the given message */
      public signature: string;
    }

    /** Properties of a VerifyMessageResponse. */
    interface IVerifyMessageResponse {
      /** Whether the signature was valid over the given message */
      valid?: boolean | null;

      /** The pubkey recovered from the signature */
      pubkey?: string | null;
    }

    /** Represents a VerifyMessageResponse. */
    class VerifyMessageResponse implements IVerifyMessageResponse {
      /**
       * Constructs a new VerifyMessageResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IVerifyMessageResponse);

      /** Whether the signature was valid over the given message */
      public valid: boolean;

      /** The pubkey recovered from the signature */
      public pubkey: string;
    }

    /** Properties of a ConnectPeerRequest. */
    interface IConnectPeerRequest {
      /** Lightning address of the peer, in the format `<pubkey>@host` */
      addr?: lnrpc.ILightningAddress | null;

      /**
       * If set, the daemon will attempt to persistently connect to the target
       * peer.  Otherwise, the call will be synchronous.
       */
      perm?: boolean | null;
    }

    /** Represents a ConnectPeerRequest. */
    class ConnectPeerRequest implements IConnectPeerRequest {
      /**
       * Constructs a new ConnectPeerRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IConnectPeerRequest);

      /** Lightning address of the peer, in the format `<pubkey>@host` */
      public addr?: lnrpc.ILightningAddress | null;

      /**
       * If set, the daemon will attempt to persistently connect to the target
       * peer.  Otherwise, the call will be synchronous.
       */
      public perm: boolean;
    }

    /** Properties of a ConnectPeerResponse. */
    interface IConnectPeerResponse {}

    /** Represents a ConnectPeerResponse. */
    class ConnectPeerResponse implements IConnectPeerResponse {
      /**
       * Constructs a new ConnectPeerResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IConnectPeerResponse);
    }

    /** Properties of a DisconnectPeerRequest. */
    interface IDisconnectPeerRequest {
      /** The pubkey of the node to disconnect from */
      pub_key?: string | null;
    }

    /** Represents a DisconnectPeerRequest. */
    class DisconnectPeerRequest implements IDisconnectPeerRequest {
      /**
       * Constructs a new DisconnectPeerRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IDisconnectPeerRequest);

      /** The pubkey of the node to disconnect from */
      public pub_key: string;
    }

    /** Properties of a DisconnectPeerResponse. */
    interface IDisconnectPeerResponse {}

    /** Represents a DisconnectPeerResponse. */
    class DisconnectPeerResponse implements IDisconnectPeerResponse {
      /**
       * Constructs a new DisconnectPeerResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IDisconnectPeerResponse);
    }

    /** Properties of a HTLC. */
    interface IHTLC {
      /** HTLC incoming */
      incoming?: boolean | null;

      /** HTLC amount */
      amount?: number | null;

      /** HTLC hash_lock */
      hash_lock?: Uint8Array | null;

      /** HTLC expiration_height */
      expiration_height?: number | null;
    }

    /** Represents a HTLC. */
    class HTLC implements IHTLC {
      /**
       * Constructs a new HTLC.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IHTLC);

      /** HTLC incoming. */
      public incoming: boolean;

      /** HTLC amount. */
      public amount: number;

      /** HTLC hash_lock. */
      public hash_lock: Uint8Array;

      /** HTLC expiration_height. */
      public expiration_height: number;
    }

    /** Properties of a Channel. */
    interface IChannel {
      /** Whether this channel is active or not */
      active?: boolean | null;

      /** The identity pubkey of the remote node */
      remote_pubkey: string;

      /**
       * The outpoint (txid:index) of the funding transaction. With this value, Bob
       * will be able to generate a signature for Alice's version of the commitment
       * transaction.
       */
      channel_point: string;

      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      chan_id: number;

      /** The total amount of funds held in this channel */
      capacity: number;

      /** This node's current balance in this channel */
      local_balance: number;

      /** The counterparty's current balance in this channel */
      remote_balance: number;

      /**
       * The amount calculated to be paid in fees for the current set of commitment
       * transactions. The fee amount is persisted with the channel in order to
       * allow the fee amount to be removed and recalculated with each channel state
       * update, including updates that happen after a system restart.
       */
      commit_fee: number;

      /** The weight of the commitment transaction */
      commit_weight: number;

      /**
       * The required number of satoshis per kilo-weight that the requester will pay
       * at all times, for both the funding transaction and commitment transaction.
       * This value can later be updated once the channel is open.
       */
      fee_per_kw: number;

      /** The unsettled balance in this channel */
      unsettled_balance: number;

      /** The total number of satoshis we've sent within this channel. */
      total_satoshis_sent: number;

      /** The total number of satoshis we've received within this channel. */
      total_satoshis_received: number;

      /** The total number of updates conducted within this channel. */
      num_updates: number;

      /** The list of active, uncleared HTLCs currently pending within the channel. */
      pending_htlcs: lnrpc.IHTLC[];

      /**
       * The CSV delay expressed in relative blocks. If the channel is force
       * closed, we'll need to wait for this many blocks before we can regain our
       * funds.
       */
      csv_delay: number;

      /** Whether this channel is advertised to the network or not */
      private: boolean;
    }

    /** Represents a Channel. */
    class Channel implements IChannel {
      /**
       * Constructs a new Channel.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannel);

      /** Whether this channel is active or not */
      public active: boolean;

      /** The identity pubkey of the remote node */
      public remote_pubkey: string;

      /**
       * The outpoint (txid:index) of the funding transaction. With this value, Bob
       * will be able to generate a signature for Alice's version of the commitment
       * transaction.
       */
      public channel_point: string;

      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      public chan_id: number;

      /** The total amount of funds held in this channel */
      public capacity: number;

      /** This node's current balance in this channel */
      public local_balance: number;

      /** The counterparty's current balance in this channel */
      public remote_balance: number;

      /**
       * The amount calculated to be paid in fees for the current set of commitment
       * transactions. The fee amount is persisted with the channel in order to
       * allow the fee amount to be removed and recalculated with each channel state
       * update, including updates that happen after a system restart.
       */
      public commit_fee: number;

      /** The weight of the commitment transaction */
      public commit_weight: number;

      /**
       * The required number of satoshis per kilo-weight that the requester will pay
       * at all times, for both the funding transaction and commitment transaction.
       * This value can later be updated once the channel is open.
       */
      public fee_per_kw: number;

      /** The unsettled balance in this channel */
      public unsettled_balance: number;

      /** The total number of satoshis we've sent within this channel. */
      public total_satoshis_sent: number;

      /** The total number of satoshis we've received within this channel. */
      public total_satoshis_received: number;

      /** The total number of updates conducted within this channel. */
      public num_updates: number;

      /** The list of active, uncleared HTLCs currently pending within the channel. */
      public pending_htlcs: lnrpc.IHTLC[];

      /**
       * The CSV delay expressed in relative blocks. If the channel is force
       * closed, we'll need to wait for this many blocks before we can regain our
       * funds.
       */
      public csv_delay: number;

      /** Whether this channel is advertised to the network or not */
      public private: boolean;
    }

    /** Properties of a ListChannelsRequest. */
    interface IListChannelsRequest {
      /** ListChannelsRequest active_only */
      active_only?: boolean | null;

      /** ListChannelsRequest inactive_only */
      inactive_only?: boolean | null;

      /** ListChannelsRequest public_only */
      public_only?: boolean | null;

      /** ListChannelsRequest private_only */
      private_only?: boolean | null;
    }

    /** Represents a ListChannelsRequest. */
    class ListChannelsRequest implements IListChannelsRequest {
      /**
       * Constructs a new ListChannelsRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IListChannelsRequest);

      /** ListChannelsRequest active_only. */
      public active_only: boolean;

      /** ListChannelsRequest inactive_only. */
      public inactive_only: boolean;

      /** ListChannelsRequest public_only. */
      public public_only: boolean;

      /** ListChannelsRequest private_only. */
      public private_only: boolean;
    }

    /** Properties of a ListChannelsResponse. */
    interface IListChannelsResponse {
      /** The list of active channels */
      channels?: lnrpc.IChannel[] | null;
    }

    /** Represents a ListChannelsResponse. */
    class ListChannelsResponse implements IListChannelsResponse {
      /**
       * Constructs a new ListChannelsResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IListChannelsResponse);

      /** The list of active channels */
      public channels: lnrpc.IChannel[];
    }

    /** Properties of a ChannelCloseSummary. */
    interface IChannelCloseSummary {
      /** The outpoint (txid:index) of the funding transaction. */
      channel_point?: string | null;

      /** The unique channel ID for the channel. */
      chan_id?: number | null;

      /** The hash of the genesis block that this channel resides within. */
      chain_hash?: string | null;

      /** The txid of the transaction which ultimately closed this channel. */
      closing_tx_hash?: string | null;

      /** Public key of the remote peer that we formerly had a channel with. */
      remote_pubkey?: string | null;

      /** Total capacity of the channel. */
      capacity?: number | null;

      /** Height at which the funding transaction was spent. */
      close_height?: number | null;

      /** Settled balance at the time of channel closure */
      settled_balance?: number | null;

      /** The sum of all the time-locked outputs at the time of channel closure */
      time_locked_balance?: number | null;

      /** Details on how the channel was closed. */
      close_type?: lnrpc.ChannelCloseSummary.ClosureType | null;
    }

    /** Represents a ChannelCloseSummary. */
    class ChannelCloseSummary implements IChannelCloseSummary {
      /**
       * Constructs a new ChannelCloseSummary.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelCloseSummary);

      /** The outpoint (txid:index) of the funding transaction. */
      public channel_point: string;

      /** The unique channel ID for the channel. */
      public chan_id: number;

      /** The hash of the genesis block that this channel resides within. */
      public chain_hash: string;

      /** The txid of the transaction which ultimately closed this channel. */
      public closing_tx_hash: string;

      /** Public key of the remote peer that we formerly had a channel with. */
      public remote_pubkey: string;

      /** Total capacity of the channel. */
      public capacity: number;

      /** Height at which the funding transaction was spent. */
      public close_height: number;

      /** Settled balance at the time of channel closure */
      public settled_balance: number;

      /** The sum of all the time-locked outputs at the time of channel closure */
      public time_locked_balance: number;

      /** Details on how the channel was closed. */
      public close_type: lnrpc.ChannelCloseSummary.ClosureType;
    }

    namespace ChannelCloseSummary {
      /** ClosureType enum. */
      enum ClosureType {
        COOPERATIVE_CLOSE = 0,
        LOCAL_FORCE_CLOSE = 1,
        REMOTE_FORCE_CLOSE = 2,
        BREACH_CLOSE = 3,
        FUNDING_CANCELED = 4,
      }
    }

    /** Properties of a ClosedChannelsRequest. */
    interface IClosedChannelsRequest {
      /** ClosedChannelsRequest cooperative */
      cooperative?: boolean | null;

      /** ClosedChannelsRequest local_force */
      local_force?: boolean | null;

      /** ClosedChannelsRequest remote_force */
      remote_force?: boolean | null;

      /** ClosedChannelsRequest breach */
      breach?: boolean | null;

      /** ClosedChannelsRequest funding_canceled */
      funding_canceled?: boolean | null;
    }

    /** Represents a ClosedChannelsRequest. */
    class ClosedChannelsRequest implements IClosedChannelsRequest {
      /**
       * Constructs a new ClosedChannelsRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IClosedChannelsRequest);

      /** ClosedChannelsRequest cooperative. */
      public cooperative: boolean;

      /** ClosedChannelsRequest local_force. */
      public local_force: boolean;

      /** ClosedChannelsRequest remote_force. */
      public remote_force: boolean;

      /** ClosedChannelsRequest breach. */
      public breach: boolean;

      /** ClosedChannelsRequest funding_canceled. */
      public funding_canceled: boolean;
    }

    /** Properties of a ClosedChannelsResponse. */
    interface IClosedChannelsResponse {
      /** ClosedChannelsResponse channels */
      channels?: lnrpc.IChannelCloseSummary[] | null;
    }

    /** Represents a ClosedChannelsResponse. */
    class ClosedChannelsResponse implements IClosedChannelsResponse {
      /**
       * Constructs a new ClosedChannelsResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IClosedChannelsResponse);

      /** ClosedChannelsResponse channels. */
      public channels: lnrpc.IChannelCloseSummary[];
    }

    /** Properties of a Peer. */
    interface IPeer {
      /** The identity pubkey of the peer */
      pub_key?: string | null;

      /** Network address of the peer; eg `127.0.0.1:10011` */
      address?: string | null;

      /** Bytes of data transmitted to this peer */
      bytes_sent?: number | null;

      /** Bytes of data transmitted from this peer */
      bytes_recv?: number | null;

      /** Satoshis sent to this peer */
      sat_sent?: number | null;

      /** Satoshis received from this peer */
      sat_recv?: number | null;

      /** A channel is inbound if the counterparty initiated the channel */
      inbound?: boolean | null;

      /** Ping time to this peer */
      ping_time?: number | null;
    }

    /** Represents a Peer. */
    class Peer implements IPeer {
      /**
       * Constructs a new Peer.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPeer);

      /** The identity pubkey of the peer */
      public pub_key: string;

      /** Network address of the peer; eg `127.0.0.1:10011` */
      public address: string;

      /** Bytes of data transmitted to this peer */
      public bytes_sent: number;

      /** Bytes of data transmitted from this peer */
      public bytes_recv: number;

      /** Satoshis sent to this peer */
      public sat_sent: number;

      /** Satoshis received from this peer */
      public sat_recv: number;

      /** A channel is inbound if the counterparty initiated the channel */
      public inbound: boolean;

      /** Ping time to this peer */
      public ping_time: number;
    }

    /** Properties of a ListPeersRequest. */
    interface IListPeersRequest {}

    /** Represents a ListPeersRequest. */
    class ListPeersRequest implements IListPeersRequest {
      /**
       * Constructs a new ListPeersRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IListPeersRequest);
    }

    /** Properties of a ListPeersResponse. */
    interface IListPeersResponse {
      /** The list of currently connected peers */
      peers?: lnrpc.IPeer[] | null;
    }

    /** Represents a ListPeersResponse. */
    class ListPeersResponse implements IListPeersResponse {
      /**
       * Constructs a new ListPeersResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IListPeersResponse);

      /** The list of currently connected peers */
      public peers: lnrpc.IPeer[];
    }

    /** Properties of a GetInfoRequest. */
    interface IGetInfoRequest {}

    /** Represents a GetInfoRequest. */
    class GetInfoRequest implements IGetInfoRequest {
      /**
       * Constructs a new GetInfoRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IGetInfoRequest);
    }

    /** Properties of a GetInfoResponse. */
    interface IGetInfoResponse {
      /** The identity pubkey of the current node. */
      identity_pubkey?: string | null;

      /** If applicable, the alias of the current node, e.g. "bob" */
      alias?: string | null;

      /** Number of pending channels */
      num_pending_channels?: number | null;

      /** Number of active channels */
      num_active_channels?: number | null;

      /** Number of peers */
      num_peers?: number | null;

      /** The node's current view of the height of the best block */
      block_height?: number | null;

      /** The node's current view of the hash of the best block */
      block_hash?: string | null;

      /** Whether the wallet's view is synced to the main chain */
      synced_to_chain?: boolean | null;

      /** Whether the current node is connected to testnet */
      testnet?: boolean | null;

      /** A list of active chains the node is connected to */
      chains?: string[] | null;

      /** The URIs of the current node. */
      uris?: string[] | null;

      /** Timestamp of the block best known to the wallet */
      best_header_timestamp?: number | null;

      /** The version of the LND software that the node is running. */
      version?: string | null;
    }

    /** Represents a GetInfoResponse. */
    class GetInfoResponse implements IGetInfoResponse {
      /**
       * Constructs a new GetInfoResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IGetInfoResponse);

      /** The identity pubkey of the current node. */
      public identity_pubkey: string;

      /** If applicable, the alias of the current node, e.g. "bob" */
      public alias: string;

      /** Number of pending channels */
      public num_pending_channels: number;

      /** Number of active channels */
      public num_active_channels: number;

      /** Number of peers */
      public num_peers: number;

      /** The node's current view of the height of the best block */
      public block_height: number;

      /** The node's current view of the hash of the best block */
      public block_hash: string;

      /** Whether the wallet's view is synced to the main chain */
      public synced_to_chain: boolean;

      /** Whether the current node is connected to testnet */
      public testnet: boolean;

      /** A list of active chains the node is connected to */
      public chains: string[];

      /** The URIs of the current node. */
      public uris: string[];

      /** Timestamp of the block best known to the wallet */
      public best_header_timestamp: number;

      /** The version of the LND software that the node is running. */
      public version: string;
    }

    /** Properties of a ConfirmationUpdate. */
    interface IConfirmationUpdate {
      /** ConfirmationUpdate block_sha */
      block_sha: Uint8Array;

      /** ConfirmationUpdate block_height */
      block_height: number;

      /** ConfirmationUpdate num_confs_left */
      num_confs_left: number;
    }

    /** Represents a ConfirmationUpdate. */
    class ConfirmationUpdate implements IConfirmationUpdate {
      /**
       * Constructs a new ConfirmationUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IConfirmationUpdate);

      /** ConfirmationUpdate block_sha. */
      public block_sha: Uint8Array;

      /** ConfirmationUpdate block_height. */
      public block_height: number;

      /** ConfirmationUpdate num_confs_left. */
      public num_confs_left: number;
    }

    /** Properties of a ChannelOpenUpdate. */
    interface IChannelOpenUpdate {
      /** ChannelOpenUpdate channel_point */
      channel_point: lnrpc.IChannelPoint;
    }

    /** Represents a ChannelOpenUpdate. */
    class ChannelOpenUpdate implements IChannelOpenUpdate {
      /**
       * Constructs a new ChannelOpenUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelOpenUpdate);

      /** ChannelOpenUpdate channel_point. */
      public channel_point: lnrpc.IChannelPoint;
    }

    /** Properties of a ChannelCloseUpdate. */
    interface IChannelCloseUpdate {
      /** ChannelCloseUpdate closing_txid */
      closing_txid?: Uint8Array | null;

      /** ChannelCloseUpdate success */
      success?: boolean | null;
    }

    /** Represents a ChannelCloseUpdate. */
    class ChannelCloseUpdate implements IChannelCloseUpdate {
      /**
       * Constructs a new ChannelCloseUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelCloseUpdate);

      /** ChannelCloseUpdate closing_txid. */
      public closing_txid: Uint8Array;

      /** ChannelCloseUpdate success. */
      public success: boolean;
    }

    /** Properties of a CloseChannelRequest. */
    interface ICloseChannelRequest {
      /**
       * The outpoint (txid:index) of the funding transaction. With this value, Bob
       * will be able to generate a signature for Alice's version of the commitment
       * transaction.
       */
      channel_point?: lnrpc.IChannelPoint | null;

      /** If true, then the channel will be closed forcibly. This means the current commitment transaction will be signed and broadcast. */
      force?: boolean | null;

      /** The target number of blocks that the closure transaction should be confirmed by. */
      target_conf?: number | null;

      /** A manual fee rate set in sat/byte that should be used when crafting the closure transaction. */
      sat_per_byte?: number | null;
    }

    /** Represents a CloseChannelRequest. */
    class CloseChannelRequest implements ICloseChannelRequest {
      /**
       * Constructs a new CloseChannelRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ICloseChannelRequest);

      /**
       * The outpoint (txid:index) of the funding transaction. With this value, Bob
       * will be able to generate a signature for Alice's version of the commitment
       * transaction.
       */
      public channel_point?: lnrpc.IChannelPoint | null;

      /** If true, then the channel will be closed forcibly. This means the current commitment transaction will be signed and broadcast. */
      public force: boolean;

      /** The target number of blocks that the closure transaction should be confirmed by. */
      public target_conf: number;

      /** A manual fee rate set in sat/byte that should be used when crafting the closure transaction. */
      public sat_per_byte: number;
    }

    /** Properties of a CloseStatusUpdate. */
    interface ICloseStatusUpdate {
      /** CloseStatusUpdate close_pending */
      close_pending?: lnrpc.IPendingUpdate | null;

      /** CloseStatusUpdate confirmation */
      confirmation?: lnrpc.IConfirmationUpdate | null;

      /** CloseStatusUpdate chan_close */
      chan_close?: lnrpc.IChannelCloseUpdate | null;
    }

    /** Represents a CloseStatusUpdate. */
    class CloseStatusUpdate implements ICloseStatusUpdate {
      /**
       * Constructs a new CloseStatusUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ICloseStatusUpdate);

      /** CloseStatusUpdate close_pending. */
      public close_pending?: lnrpc.IPendingUpdate | null;

      /** CloseStatusUpdate confirmation. */
      public confirmation?: lnrpc.IConfirmationUpdate | null;

      /** CloseStatusUpdate chan_close. */
      public chan_close?: lnrpc.IChannelCloseUpdate | null;

      /** CloseStatusUpdate update. */
      public update?: 'close_pending' | 'confirmation' | 'chan_close';
    }

    /** Properties of a PendingUpdate. */
    interface IPendingUpdate {
      /** PendingUpdate txid */
      txid: Uint8Array;

      /** PendingUpdate output_index */
      output_index: number;
    }

    /** Represents a PendingUpdate. */
    class PendingUpdate implements IPendingUpdate {
      /**
       * Constructs a new PendingUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPendingUpdate);

      /** PendingUpdate txid. */
      public txid: Uint8Array;

      /** PendingUpdate output_index. */
      public output_index: number;
    }

    /** Properties of an OpenChannelRequest. */
    interface IOpenChannelRequest {
      /** The pubkey of the node to open a channel with */
      node_pubkey?: Uint8Array | null;

      /** The hex encoded pubkey of the node to open a channel with */
      node_pubkey_string?: string | null;

      /** The number of satoshis the wallet should commit to the channel */
      local_funding_amount?: number | null;

      /** The number of satoshis to push to the remote side as part of the initial commitment state */
      push_sat?: number | null;

      /** The target number of blocks that the funding transaction should be confirmed by. */
      target_conf?: number | null;

      /** A manual fee rate set in sat/byte that should be used when crafting the funding transaction. */
      sat_per_byte?: number | null;

      /** Whether this channel should be private, not announced to the greater network. */
      private?: boolean | null;

      /** The minimum value in millisatoshi we will require for incoming HTLCs on the channel. */
      min_htlc_msat?: number | null;

      /** The delay we require on the remote's commitment transaction. If this is not set, it will be scaled automatically with the channel size. */
      remote_csv_delay?: number | null;
    }

    /** Represents an OpenChannelRequest. */
    class OpenChannelRequest implements IOpenChannelRequest {
      /**
       * Constructs a new OpenChannelRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IOpenChannelRequest);

      /** The pubkey of the node to open a channel with */
      public node_pubkey: Uint8Array;

      /** The hex encoded pubkey of the node to open a channel with */
      public node_pubkey_string: string;

      /** The number of satoshis the wallet should commit to the channel */
      public local_funding_amount: number;

      /** The number of satoshis to push to the remote side as part of the initial commitment state */
      public push_sat: number;

      /** The target number of blocks that the funding transaction should be confirmed by. */
      public target_conf: number;

      /** A manual fee rate set in sat/byte that should be used when crafting the funding transaction. */
      public sat_per_byte: number;

      /** Whether this channel should be private, not announced to the greater network. */
      public private: boolean;

      /** The minimum value in millisatoshi we will require for incoming HTLCs on the channel. */
      public min_htlc_msat: number;

      /** The delay we require on the remote's commitment transaction. If this is not set, it will be scaled automatically with the channel size. */
      public remote_csv_delay: number;
    }

    /** Properties of an OpenStatusUpdate. */
    interface IOpenStatusUpdate {
      /** OpenStatusUpdate chan_pending */
      chan_pending?: lnrpc.IPendingUpdate | null;

      /** OpenStatusUpdate confirmation */
      confirmation?: lnrpc.IConfirmationUpdate | null;

      /** OpenStatusUpdate chan_open */
      chan_open?: lnrpc.IChannelOpenUpdate | null;
    }

    /** Represents an OpenStatusUpdate. */
    class OpenStatusUpdate implements IOpenStatusUpdate {
      /**
       * Constructs a new OpenStatusUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IOpenStatusUpdate);

      /** OpenStatusUpdate chan_pending. */
      public chan_pending?: lnrpc.IPendingUpdate | null;

      /** OpenStatusUpdate confirmation. */
      public confirmation?: lnrpc.IConfirmationUpdate | null;

      /** OpenStatusUpdate chan_open. */
      public chan_open?: lnrpc.IChannelOpenUpdate | null;

      /** OpenStatusUpdate update. */
      public update?: 'chan_pending' | 'confirmation' | 'chan_open';
    }

    /** Properties of a PendingHTLC. */
    interface IPendingHTLC {
      /** The direction within the channel that the htlc was sent */
      incoming?: boolean | null;

      /** The total value of the htlc */
      amount?: number | null;

      /** The final output to be swept back to the user's wallet */
      outpoint?: string | null;

      /** The next block height at which we can spend the current stage */
      maturity_height?: number | null;

      /**
       * The number of blocks remaining until the current stage can be swept.
       * Negative values indicate how many blocks have passed since becoming
       * mature.
       */
      blocks_til_maturity?: number | null;

      /** Indicates whether the htlc is in its first or second stage of recovery */
      stage?: number | null;
    }

    /** Represents a PendingHTLC. */
    class PendingHTLC implements IPendingHTLC {
      /**
       * Constructs a new PendingHTLC.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPendingHTLC);

      /** The direction within the channel that the htlc was sent */
      public incoming: boolean;

      /** The total value of the htlc */
      public amount: number;

      /** The final output to be swept back to the user's wallet */
      public outpoint: string;

      /** The next block height at which we can spend the current stage */
      public maturity_height: number;

      /**
       * The number of blocks remaining until the current stage can be swept.
       * Negative values indicate how many blocks have passed since becoming
       * mature.
       */
      public blocks_til_maturity: number;

      /** Indicates whether the htlc is in its first or second stage of recovery */
      public stage: number;
    }

    /** Properties of a PendingChannelsRequest. */
    interface IPendingChannelsRequest {}

    /** Represents a PendingChannelsRequest. */
    class PendingChannelsRequest implements IPendingChannelsRequest {
      /**
       * Constructs a new PendingChannelsRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPendingChannelsRequest);
    }

    /** Properties of a PendingChannelsResponse. */
    interface IPendingChannelsResponse {
      /** The balance in satoshis encumbered in pending channels */
      total_limbo_balance?: number | null;

      /** Channels pending opening */
      pending_open_channels?: lnrpc.PendingChannelsResponse.IPendingOpenChannel[] | null;

      /** Channels pending closing */
      pending_closing_channels?: lnrpc.PendingChannelsResponse.IClosedChannel[] | null;

      /** Channels pending force closing */
      pending_force_closing_channels?: lnrpc.PendingChannelsResponse.IForceClosedChannel[] | null;

      /** Channels waiting for closing tx to confirm */
      waiting_close_channels?: lnrpc.PendingChannelsResponse.IWaitingCloseChannel[] | null;
    }

    /** Represents a PendingChannelsResponse. */
    class PendingChannelsResponse implements IPendingChannelsResponse {
      /**
       * Constructs a new PendingChannelsResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPendingChannelsResponse);

      /** The balance in satoshis encumbered in pending channels */
      public total_limbo_balance: number;

      /** Channels pending opening */
      public pending_open_channels: lnrpc.PendingChannelsResponse.IPendingOpenChannel[];

      /** Channels pending closing */
      public pending_closing_channels: lnrpc.PendingChannelsResponse.IClosedChannel[];

      /** Channels pending force closing */
      public pending_force_closing_channels: lnrpc.PendingChannelsResponse.IForceClosedChannel[];

      /** Channels waiting for closing tx to confirm */
      public waiting_close_channels: lnrpc.PendingChannelsResponse.IWaitingCloseChannel[];
    }

    namespace PendingChannelsResponse {
      /** Properties of a PendingChannel. */
      interface IPendingChannel {
        /** PendingChannel remote_node_pub */
        remote_node_pub?: string | null;

        /** PendingChannel channel_point */
        channel_point?: string | null;

        /** PendingChannel capacity */
        capacity?: number | null;

        /** PendingChannel local_balance */
        local_balance?: number | null;

        /** PendingChannel remote_balance */
        remote_balance?: number | null;
      }

      /** Represents a PendingChannel. */
      class PendingChannel implements IPendingChannel {
        /**
         * Constructs a new PendingChannel.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.PendingChannelsResponse.IPendingChannel);

        /** PendingChannel remote_node_pub. */
        public remote_node_pub: string;

        /** PendingChannel channel_point. */
        public channel_point: string;

        /** PendingChannel capacity. */
        public capacity: number;

        /** PendingChannel local_balance. */
        public local_balance: number;

        /** PendingChannel remote_balance. */
        public remote_balance: number;
      }

      /** Properties of a PendingOpenChannel. */
      interface IPendingOpenChannel {
        /** The pending channel */
        channel?: lnrpc.PendingChannelsResponse.IPendingChannel | null;

        /** The height at which this channel will be confirmed */
        confirmation_height?: number | null;

        /**
         * The amount calculated to be paid in fees for the current set of
         * commitment transactions. The fee amount is persisted with the channel
         * in order to allow the fee amount to be removed and recalculated with
         * each channel state update, including updates that happen after a system
         * restart.
         */
        commit_fee?: number | null;

        /** The weight of the commitment transaction */
        commit_weight?: number | null;

        /**
         * The required number of satoshis per kilo-weight that the requester will
         * pay at all times, for both the funding transaction and commitment
         * transaction. This value can later be updated once the channel is open.
         */
        fee_per_kw?: number | null;
      }

      /** Represents a PendingOpenChannel. */
      class PendingOpenChannel implements IPendingOpenChannel {
        /**
         * Constructs a new PendingOpenChannel.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.PendingChannelsResponse.IPendingOpenChannel);

        /** The pending channel */
        public channel?: lnrpc.PendingChannelsResponse.IPendingChannel | null;

        /** The height at which this channel will be confirmed */
        public confirmation_height: number;

        /**
         * The amount calculated to be paid in fees for the current set of
         * commitment transactions. The fee amount is persisted with the channel
         * in order to allow the fee amount to be removed and recalculated with
         * each channel state update, including updates that happen after a system
         * restart.
         */
        public commit_fee: number;

        /** The weight of the commitment transaction */
        public commit_weight: number;

        /**
         * The required number of satoshis per kilo-weight that the requester will
         * pay at all times, for both the funding transaction and commitment
         * transaction. This value can later be updated once the channel is open.
         */
        public fee_per_kw: number;
      }

      /** Properties of a WaitingCloseChannel. */
      interface IWaitingCloseChannel {
        /** The pending channel waiting for closing tx to confirm */
        channel?: lnrpc.PendingChannelsResponse.IPendingChannel | null;

        /** The balance in satoshis encumbered in this channel */
        limbo_balance?: number | null;
      }

      /** Represents a WaitingCloseChannel. */
      class WaitingCloseChannel implements IWaitingCloseChannel {
        /**
         * Constructs a new WaitingCloseChannel.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.PendingChannelsResponse.IWaitingCloseChannel);

        /** The pending channel waiting for closing tx to confirm */
        public channel?: lnrpc.PendingChannelsResponse.IPendingChannel | null;

        /** The balance in satoshis encumbered in this channel */
        public limbo_balance: number;
      }

      /** Properties of a ClosedChannel. */
      interface IClosedChannel {
        /** The pending channel to be closed */
        channel?: lnrpc.PendingChannelsResponse.IPendingChannel | null;

        /** The transaction id of the closing transaction */
        closing_txid?: string | null;
      }

      /** Represents a ClosedChannel. */
      class ClosedChannel implements IClosedChannel {
        /**
         * Constructs a new ClosedChannel.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.PendingChannelsResponse.IClosedChannel);

        /** The pending channel to be closed */
        public channel?: lnrpc.PendingChannelsResponse.IPendingChannel | null;

        /** The transaction id of the closing transaction */
        public closing_txid: string;
      }

      /** Properties of a ForceClosedChannel. */
      interface IForceClosedChannel {
        /** The pending channel to be force closed */
        channel?: lnrpc.PendingChannelsResponse.IPendingChannel | null;

        /** The transaction id of the closing transaction */
        closing_txid?: string | null;

        /** The balance in satoshis encumbered in this pending channel */
        limbo_balance?: number | null;

        /** The height at which funds can be sweeped into the wallet */
        maturity_height?: number | null;

        /** ForceClosedChannel blocks_til_maturity */
        blocks_til_maturity?: number | null;

        /** The total value of funds successfully recovered from this channel */
        recovered_balance?: number | null;

        /** ForceClosedChannel pending_htlcs */
        pending_htlcs?: lnrpc.IPendingHTLC[] | null;
      }

      /** Represents a ForceClosedChannel. */
      class ForceClosedChannel implements IForceClosedChannel {
        /**
         * Constructs a new ForceClosedChannel.
         * @param [properties] Properties to set
         */
        constructor(properties?: lnrpc.PendingChannelsResponse.IForceClosedChannel);

        /** The pending channel to be force closed */
        public channel?: lnrpc.PendingChannelsResponse.IPendingChannel | null;

        /** The transaction id of the closing transaction */
        public closing_txid: string;

        /** The balance in satoshis encumbered in this pending channel */
        public limbo_balance: number;

        /** The height at which funds can be sweeped into the wallet */
        public maturity_height: number;

        /** ForceClosedChannel blocks_til_maturity. */
        public blocks_til_maturity: number;

        /** The total value of funds successfully recovered from this channel */
        public recovered_balance: number;

        /** ForceClosedChannel pending_htlcs. */
        public pending_htlcs: lnrpc.IPendingHTLC[];
      }
    }

    /** Properties of a WalletBalanceRequest. */
    interface IWalletBalanceRequest {}

    /** Represents a WalletBalanceRequest. */
    class WalletBalanceRequest implements IWalletBalanceRequest {
      /**
       * Constructs a new WalletBalanceRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IWalletBalanceRequest);
    }

    /** Properties of a WalletBalanceResponse. */
    interface IWalletBalanceResponse {
      /** The balance of the wallet */
      total_balance?: number | null;

      /** The confirmed balance of a wallet(with >= 1 confirmations) */
      confirmed_balance?: number | null;

      /** The unconfirmed balance of a wallet(with 0 confirmations) */
      unconfirmed_balance?: number | null;
    }

    /** Represents a WalletBalanceResponse. */
    class WalletBalanceResponse implements IWalletBalanceResponse {
      /**
       * Constructs a new WalletBalanceResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IWalletBalanceResponse);

      /** The balance of the wallet */
      public total_balance: number;

      /** The confirmed balance of a wallet(with >= 1 confirmations) */
      public confirmed_balance: number;

      /** The unconfirmed balance of a wallet(with 0 confirmations) */
      public unconfirmed_balance: number;
    }

    /** Properties of a ChannelBalanceRequest. */
    interface IChannelBalanceRequest {}

    /** Represents a ChannelBalanceRequest. */
    class ChannelBalanceRequest implements IChannelBalanceRequest {
      /**
       * Constructs a new ChannelBalanceRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelBalanceRequest);
    }

    /** Properties of a ChannelBalanceResponse. */
    interface IChannelBalanceResponse {
      /** Sum of channels balances denominated in satoshis */
      balance?: number | null;

      /** Sum of channels pending balances denominated in satoshis */
      pending_open_balance?: number | null;
    }

    /** Represents a ChannelBalanceResponse. */
    class ChannelBalanceResponse implements IChannelBalanceResponse {
      /**
       * Constructs a new ChannelBalanceResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelBalanceResponse);

      /** Sum of channels balances denominated in satoshis */
      public balance: number;

      /** Sum of channels pending balances denominated in satoshis */
      public pending_open_balance: number;
    }

    /** Properties of a QueryRoutesRequest. */
    interface IQueryRoutesRequest {
      /** The 33-byte hex-encoded public key for the payment destination */
      pub_key?: string | null;

      /** The amount to send expressed in satoshis */
      amt?: number | null;

      /** The max number of routes to return. */
      num_routes?: number | null;

      /** An optional CLTV delta from the current height that should be used for the timelock of the final hop */
      final_cltv_delta?: number | null;

      /**
       * The maximum number of satoshis that will be paid as a fee of the payment.
       * This value can be represented either as a percentage of the amount being
       * sent, or as a fixed amount of the maximum fee the user is willing the pay to
       * send the payment.
       */
      fee_limit?: lnrpc.IFeeLimit | null;
    }

    /** Represents a QueryRoutesRequest. */
    class QueryRoutesRequest implements IQueryRoutesRequest {
      /**
       * Constructs a new QueryRoutesRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IQueryRoutesRequest);

      /** The 33-byte hex-encoded public key for the payment destination */
      public pub_key: string;

      /** The amount to send expressed in satoshis */
      public amt: number;

      /** The max number of routes to return. */
      public num_routes: number;

      /** An optional CLTV delta from the current height that should be used for the timelock of the final hop */
      public final_cltv_delta: number;

      /**
       * The maximum number of satoshis that will be paid as a fee of the payment.
       * This value can be represented either as a percentage of the amount being
       * sent, or as a fixed amount of the maximum fee the user is willing the pay to
       * send the payment.
       */
      public fee_limit?: lnrpc.IFeeLimit | null;
    }

    /** Properties of a QueryRoutesResponse. */
    interface IQueryRoutesResponse {
      /** QueryRoutesResponse routes */
      routes?: lnrpc.IRoute[] | null;
    }

    /** Represents a QueryRoutesResponse. */
    class QueryRoutesResponse implements IQueryRoutesResponse {
      /**
       * Constructs a new QueryRoutesResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IQueryRoutesResponse);

      /** QueryRoutesResponse routes. */
      public routes: lnrpc.IRoute[];
    }

    /** Properties of a Hop. */
    interface IHop {
      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      chan_id?: number | null;

      /** Hop chan_capacity */
      chan_capacity?: number | null;

      /** Hop amt_to_forward */
      amt_to_forward?: number | null;

      /** Hop fee */
      fee?: number | null;

      /** Hop expiry */
      expiry?: number | null;

      /** Hop amt_to_forward_msat */
      amt_to_forward_msat?: number | null;

      /** Hop fee_msat */
      fee_msat?: number | null;
    }

    /** Represents a Hop. */
    class Hop implements IHop {
      /**
       * Constructs a new Hop.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IHop);

      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      public chan_id: number;

      /** Hop chan_capacity. */
      public chan_capacity: number;

      /** Hop amt_to_forward. */
      public amt_to_forward: number;

      /** Hop fee. */
      public fee: number;

      /** Hop expiry. */
      public expiry: number;

      /** Hop amt_to_forward_msat. */
      public amt_to_forward_msat: number;

      /** Hop fee_msat. */
      public fee_msat: number;
    }

    /** Properties of a Route. */
    interface IRoute {
      /**
       * The cumulative (final) time lock across the entire route.  This is the CLTV
       * value that should be extended to the first hop in the route. All other hops
       * will decrement the time-lock as advertised, leaving enough time for all
       * hops to wait for or present the payment preimage to complete the payment.
       */
      total_time_lock?: number | null;

      /**
       * The sum of the fees paid at each hop within the final route.  In the case
       * of a one-hop payment, this value will be zero as we don't need to pay a fee
       * it ourself.
       */
      total_fees?: number | null;

      /**
       * The total amount of funds required to complete a payment over this route.
       * This value includes the cumulative fees at each hop. As a result, the HTLC
       * extended to the first-hop in the route will need to have at least this many
       * satoshis, otherwise the route will fail at an intermediate node due to an
       * insufficient amount of fees.
       */
      total_amt?: number | null;

      /** Contains details concerning the specific forwarding details at each hop. */
      hops?: lnrpc.IHop[] | null;

      /** The total fees in millisatoshis. */
      total_fees_msat?: number | null;

      /** The total amount in millisatoshis. */
      total_amt_msat?: number | null;
    }

    /**
     * A path through the channel graph which runs over one or more channels in
     * succession. This struct carries all the information required to craft the
     * Sphinx onion packet, and send the payment along the first hop in the path. A
     * route is only selected as valid if all the channels have sufficient capacity to
     * carry the initial payment amount after fees are accounted for.
     */
    class Route implements IRoute {
      /**
       * Constructs a new Route.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IRoute);

      /**
       * The cumulative (final) time lock across the entire route.  This is the CLTV
       * value that should be extended to the first hop in the route. All other hops
       * will decrement the time-lock as advertised, leaving enough time for all
       * hops to wait for or present the payment preimage to complete the payment.
       */
      public total_time_lock: number;

      /**
       * The sum of the fees paid at each hop within the final route.  In the case
       * of a one-hop payment, this value will be zero as we don't need to pay a fee
       * it ourself.
       */
      public total_fees: number;

      /**
       * The total amount of funds required to complete a payment over this route.
       * This value includes the cumulative fees at each hop. As a result, the HTLC
       * extended to the first-hop in the route will need to have at least this many
       * satoshis, otherwise the route will fail at an intermediate node due to an
       * insufficient amount of fees.
       */
      public total_amt: number;

      /** Contains details concerning the specific forwarding details at each hop. */
      public hops: lnrpc.IHop[];

      /** The total fees in millisatoshis. */
      public total_fees_msat: number;

      /** The total amount in millisatoshis. */
      public total_amt_msat: number;
    }

    /** Properties of a NodeInfoRequest. */
    interface INodeInfoRequest {
      /** The 33-byte hex-encoded compressed public of the target node */
      pub_key?: string | null;
    }

    /** Represents a NodeInfoRequest. */
    class NodeInfoRequest implements INodeInfoRequest {
      /**
       * Constructs a new NodeInfoRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.INodeInfoRequest);

      /** The 33-byte hex-encoded compressed public of the target node */
      public pub_key: string;
    }

    /** Properties of a NodeInfo. */
    interface INodeInfo {
      /**
       * An individual vertex/node within the channel graph. A node is
       * connected to other nodes by one or more channel edges emanating from it. As
       * the graph is directed, a node will also have an incoming edge attached to
       * it for each outgoing edge.
       */
      node?: lnrpc.ILightningNode | null;

      /** NodeInfo num_channels */
      num_channels?: number | null;

      /** NodeInfo total_capacity */
      total_capacity?: number | null;
    }

    /** Represents a NodeInfo. */
    class NodeInfo implements INodeInfo {
      /**
       * Constructs a new NodeInfo.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.INodeInfo);

      /**
       * An individual vertex/node within the channel graph. A node is
       * connected to other nodes by one or more channel edges emanating from it. As
       * the graph is directed, a node will also have an incoming edge attached to
       * it for each outgoing edge.
       */
      public node?: lnrpc.ILightningNode | null;

      /** NodeInfo num_channels. */
      public num_channels: number;

      /** NodeInfo total_capacity. */
      public total_capacity: number;
    }

    /** Properties of a LightningNode. */
    interface ILightningNode {
      /** LightningNode last_update */
      last_update?: number | null;

      /** LightningNode pub_key */
      pub_key?: string | null;

      /** LightningNode alias */
      alias?: string | null;

      /** LightningNode addresses */
      addresses?: lnrpc.INodeAddress[] | null;

      /** LightningNode color */
      color?: string | null;
    }

    /**
     * An individual vertex/node within the channel graph. A node is
     * connected to other nodes by one or more channel edges emanating from it. As the
     * graph is directed, a node will also have an incoming edge attached to it for
     * each outgoing edge.
     */
    class LightningNode implements ILightningNode {
      /**
       * Constructs a new LightningNode.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.ILightningNode);

      /** LightningNode last_update. */
      public last_update: number;

      /** LightningNode pub_key. */
      public pub_key: string;

      /** LightningNode alias. */
      public alias: string;

      /** LightningNode addresses. */
      public addresses: lnrpc.INodeAddress[];

      /** LightningNode color. */
      public color: string;
    }

    /** Properties of a NodeAddress. */
    interface INodeAddress {
      /** NodeAddress network */
      network?: string | null;

      /** NodeAddress addr */
      addr?: string | null;
    }

    /** Represents a NodeAddress. */
    class NodeAddress implements INodeAddress {
      /**
       * Constructs a new NodeAddress.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.INodeAddress);

      /** NodeAddress network. */
      public network: string;

      /** NodeAddress addr. */
      public addr: string;
    }

    /** Properties of a RoutingPolicy. */
    interface IRoutingPolicy {
      /** RoutingPolicy time_lock_delta */
      time_lock_delta?: number | null;

      /** RoutingPolicy min_htlc */
      min_htlc?: number | null;

      /** RoutingPolicy fee_base_msat */
      fee_base_msat?: number | null;

      /** RoutingPolicy fee_rate_milli_msat */
      fee_rate_milli_msat?: number | null;

      /** RoutingPolicy disabled */
      disabled?: boolean | null;
    }

    /** Represents a RoutingPolicy. */
    class RoutingPolicy implements IRoutingPolicy {
      /**
       * Constructs a new RoutingPolicy.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IRoutingPolicy);

      /** RoutingPolicy time_lock_delta. */
      public time_lock_delta: number;

      /** RoutingPolicy min_htlc. */
      public min_htlc: number;

      /** RoutingPolicy fee_base_msat. */
      public fee_base_msat: number;

      /** RoutingPolicy fee_rate_milli_msat. */
      public fee_rate_milli_msat: number;

      /** RoutingPolicy disabled. */
      public disabled: boolean;
    }

    /** Properties of a ChannelEdge. */
    interface IChannelEdge {
      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      channel_id?: number | null;

      /** ChannelEdge chan_point */
      chan_point?: string | null;

      /** ChannelEdge last_update */
      last_update?: number | null;

      /** ChannelEdge node1_pub */
      node1_pub?: string | null;

      /** ChannelEdge node2_pub */
      node2_pub?: string | null;

      /** ChannelEdge capacity */
      capacity?: number | null;

      /** ChannelEdge node1_policy */
      node1_policy?: lnrpc.IRoutingPolicy | null;

      /** ChannelEdge node2_policy */
      node2_policy?: lnrpc.IRoutingPolicy | null;
    }

    /**
     * A fully authenticated channel along with all its unique attributes.
     * Once an authenticated channel announcement has been processed on the network,
     * then an instance of ChannelEdgeInfo encapsulating the channels attributes is
     * stored. The other portions relevant to routing policy of a channel are stored
     * within a ChannelEdgePolicy for each direction of the channel.
     */
    class ChannelEdge implements IChannelEdge {
      /**
       * Constructs a new ChannelEdge.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelEdge);

      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      public channel_id: number;

      /** ChannelEdge chan_point. */
      public chan_point: string;

      /** ChannelEdge last_update. */
      public last_update: number;

      /** ChannelEdge node1_pub. */
      public node1_pub: string;

      /** ChannelEdge node2_pub. */
      public node2_pub: string;

      /** ChannelEdge capacity. */
      public capacity: number;

      /** ChannelEdge node1_policy. */
      public node1_policy?: lnrpc.IRoutingPolicy | null;

      /** ChannelEdge node2_policy. */
      public node2_policy?: lnrpc.IRoutingPolicy | null;
    }

    /** Properties of a ChannelGraphRequest. */
    interface IChannelGraphRequest {}

    /** Represents a ChannelGraphRequest. */
    class ChannelGraphRequest implements IChannelGraphRequest {
      /**
       * Constructs a new ChannelGraphRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelGraphRequest);
    }

    /** Properties of a ChannelGraph. */
    interface IChannelGraph {
      /** The list of `LightningNode`s in this channel graph */
      nodes?: lnrpc.ILightningNode[] | null;

      /** The list of `ChannelEdge`s in this channel graph */
      edges?: lnrpc.IChannelEdge[] | null;
    }

    /** Returns a new instance of the directed channel graph. */
    class ChannelGraph implements IChannelGraph {
      /**
       * Constructs a new ChannelGraph.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelGraph);

      /** The list of `LightningNode`s in this channel graph */
      public nodes: lnrpc.ILightningNode[];

      /** The list of `ChannelEdge`s in this channel graph */
      public edges: lnrpc.IChannelEdge[];
    }

    /** Properties of a ChanInfoRequest. */
    interface IChanInfoRequest {
      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      chan_id?: number | null;
    }

    /** Represents a ChanInfoRequest. */
    class ChanInfoRequest implements IChanInfoRequest {
      /**
       * Constructs a new ChanInfoRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChanInfoRequest);

      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      public chan_id: number;
    }

    /** Properties of a NetworkInfoRequest. */
    interface INetworkInfoRequest {}

    /** Represents a NetworkInfoRequest. */
    class NetworkInfoRequest implements INetworkInfoRequest {
      /**
       * Constructs a new NetworkInfoRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.INetworkInfoRequest);
    }

    /** Properties of a NetworkInfo. */
    interface INetworkInfo {
      /** NetworkInfo graph_diameter */
      graph_diameter?: number | null;

      /** NetworkInfo avg_out_degree */
      avg_out_degree?: number | null;

      /** NetworkInfo max_out_degree */
      max_out_degree?: number | null;

      /** NetworkInfo num_nodes */
      num_nodes?: number | null;

      /** NetworkInfo num_channels */
      num_channels?: number | null;

      /** NetworkInfo total_network_capacity */
      total_network_capacity?: number | null;

      /** NetworkInfo avg_channel_size */
      avg_channel_size?: number | null;

      /** NetworkInfo min_channel_size */
      min_channel_size?: number | null;

      /** NetworkInfo max_channel_size */
      max_channel_size?: number | null;
    }

    /** Represents a NetworkInfo. */
    class NetworkInfo implements INetworkInfo {
      /**
       * Constructs a new NetworkInfo.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.INetworkInfo);

      /** NetworkInfo graph_diameter. */
      public graph_diameter: number;

      /** NetworkInfo avg_out_degree. */
      public avg_out_degree: number;

      /** NetworkInfo max_out_degree. */
      public max_out_degree: number;

      /** NetworkInfo num_nodes. */
      public num_nodes: number;

      /** NetworkInfo num_channels. */
      public num_channels: number;

      /** NetworkInfo total_network_capacity. */
      public total_network_capacity: number;

      /** NetworkInfo avg_channel_size. */
      public avg_channel_size: number;

      /** NetworkInfo min_channel_size. */
      public min_channel_size: number;

      /** NetworkInfo max_channel_size. */
      public max_channel_size: number;
    }

    /** Properties of a StopRequest. */
    interface IStopRequest {}

    /** Represents a StopRequest. */
    class StopRequest implements IStopRequest {
      /**
       * Constructs a new StopRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IStopRequest);
    }

    /** Properties of a StopResponse. */
    interface IStopResponse {}

    /** Represents a StopResponse. */
    class StopResponse implements IStopResponse {
      /**
       * Constructs a new StopResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IStopResponse);
    }

    /** Properties of a GraphTopologySubscription. */
    interface IGraphTopologySubscription {}

    /** Represents a GraphTopologySubscription. */
    class GraphTopologySubscription implements IGraphTopologySubscription {
      /**
       * Constructs a new GraphTopologySubscription.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IGraphTopologySubscription);
    }

    /** Properties of a GraphTopologyUpdate. */
    interface IGraphTopologyUpdate {
      /** GraphTopologyUpdate node_updates */
      node_updates?: lnrpc.INodeUpdate[] | null;

      /** GraphTopologyUpdate channel_updates */
      channel_updates?: lnrpc.IChannelEdgeUpdate[] | null;

      /** GraphTopologyUpdate closed_chans */
      closed_chans?: lnrpc.IClosedChannelUpdate[] | null;
    }

    /** Represents a GraphTopologyUpdate. */
    class GraphTopologyUpdate implements IGraphTopologyUpdate {
      /**
       * Constructs a new GraphTopologyUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IGraphTopologyUpdate);

      /** GraphTopologyUpdate node_updates. */
      public node_updates: lnrpc.INodeUpdate[];

      /** GraphTopologyUpdate channel_updates. */
      public channel_updates: lnrpc.IChannelEdgeUpdate[];

      /** GraphTopologyUpdate closed_chans. */
      public closed_chans: lnrpc.IClosedChannelUpdate[];
    }

    /** Properties of a NodeUpdate. */
    interface INodeUpdate {
      /** NodeUpdate addresses */
      addresses?: string[] | null;

      /** NodeUpdate identity_key */
      identity_key?: string | null;

      /** NodeUpdate global_features */
      global_features?: Uint8Array | null;

      /** NodeUpdate alias */
      alias?: string | null;
    }

    /** Represents a NodeUpdate. */
    class NodeUpdate implements INodeUpdate {
      /**
       * Constructs a new NodeUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.INodeUpdate);

      /** NodeUpdate addresses. */
      public addresses: string[];

      /** NodeUpdate identity_key. */
      public identity_key: string;

      /** NodeUpdate global_features. */
      public global_features: Uint8Array;

      /** NodeUpdate alias. */
      public alias: string;
    }

    /** Properties of a ChannelEdgeUpdate. */
    interface IChannelEdgeUpdate {
      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      chan_id?: number | null;

      /** ChannelEdgeUpdate chan_point */
      chan_point?: lnrpc.IChannelPoint | null;

      /** ChannelEdgeUpdate capacity */
      capacity?: number | null;

      /** ChannelEdgeUpdate routing_policy */
      routing_policy?: lnrpc.IRoutingPolicy | null;

      /** ChannelEdgeUpdate advertising_node */
      advertising_node?: string | null;

      /** ChannelEdgeUpdate connecting_node */
      connecting_node?: string | null;
    }

    /** Represents a ChannelEdgeUpdate. */
    class ChannelEdgeUpdate implements IChannelEdgeUpdate {
      /**
       * Constructs a new ChannelEdgeUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelEdgeUpdate);

      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      public chan_id: number;

      /** ChannelEdgeUpdate chan_point. */
      public chan_point?: lnrpc.IChannelPoint | null;

      /** ChannelEdgeUpdate capacity. */
      public capacity: number;

      /** ChannelEdgeUpdate routing_policy. */
      public routing_policy?: lnrpc.IRoutingPolicy | null;

      /** ChannelEdgeUpdate advertising_node. */
      public advertising_node: string;

      /** ChannelEdgeUpdate connecting_node. */
      public connecting_node: string;
    }

    /** Properties of a ClosedChannelUpdate. */
    interface IClosedChannelUpdate {
      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      chan_id?: number | null;

      /** ClosedChannelUpdate capacity */
      capacity?: number | null;

      /** ClosedChannelUpdate closed_height */
      closed_height?: number | null;

      /** ClosedChannelUpdate chan_point */
      chan_point?: lnrpc.IChannelPoint | null;
    }

    /** Represents a ClosedChannelUpdate. */
    class ClosedChannelUpdate implements IClosedChannelUpdate {
      /**
       * Constructs a new ClosedChannelUpdate.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IClosedChannelUpdate);

      /**
       * The unique channel ID for the channel. The first 3 bytes are the block
       * height, the next 3 the index within the block, and the last 2 bytes are the
       * output index for the channel.
       */
      public chan_id: number;

      /** ClosedChannelUpdate capacity. */
      public capacity: number;

      /** ClosedChannelUpdate closed_height. */
      public closed_height: number;

      /** ClosedChannelUpdate chan_point. */
      public chan_point?: lnrpc.IChannelPoint | null;
    }

    /** Properties of a HopHint. */
    interface IHopHint {
      /** The public key of the node at the start of the channel. */
      node_id?: string | null;

      /** The unique identifier of the channel. */
      chan_id?: number | null;

      /** The base fee of the channel denominated in millisatoshis. */
      fee_base_msat?: number | null;

      /**
       * The fee rate of the channel for sending one satoshi across it denominated in
       * millionths of a satoshi.
       */
      fee_proportional_millionths?: number | null;

      /** The time-lock delta of the channel. */
      cltv_expiry_delta?: number | null;
    }

    /** Represents a HopHint. */
    class HopHint implements IHopHint {
      /**
       * Constructs a new HopHint.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IHopHint);

      /** The public key of the node at the start of the channel. */
      public node_id: string;

      /** The unique identifier of the channel. */
      public chan_id: number;

      /** The base fee of the channel denominated in millisatoshis. */
      public fee_base_msat: number;

      /**
       * The fee rate of the channel for sending one satoshi across it denominated in
       * millionths of a satoshi.
       */
      public fee_proportional_millionths: number;

      /** The time-lock delta of the channel. */
      public cltv_expiry_delta: number;
    }

    /** Properties of a RouteHint. */
    interface IRouteHint {
      /**
       * A list of hop hints that when chained together can assist in reaching a
       * specific destination.
       */
      hop_hints?: lnrpc.IHopHint[] | null;
    }

    /** Represents a RouteHint. */
    class RouteHint implements IRouteHint {
      /**
       * Constructs a new RouteHint.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IRouteHint);

      /**
       * A list of hop hints that when chained together can assist in reaching a
       * specific destination.
       */
      public hop_hints: lnrpc.IHopHint[];
    }

    /** Properties of an Invoice. */
    interface IInvoice {
      /**
       * An optional memo to attach along with the invoice. Used for record keeping
       * purposes for the invoice's creator, and will also be set in the description
       * field of the encoded payment request if the description_hash field is not
       * being used.
       */
      memo?: string | null;

      /** An optional cryptographic receipt of payment */
      receipt?: Uint8Array | null;

      /**
       * The hex-encoded preimage (32 byte) which will allow settling an incoming
       * HTLC payable to this preimage
       */
      r_preimage?: Uint8Array | null;

      /** The hash of the preimage */
      r_hash?: Uint8Array | null;

      /** The value of this invoice in satoshis */
      value?: number | null;

      /** Whether this invoice has been fulfilled */
      settled?: boolean | null;

      /** When this invoice was created */
      creation_date?: number | null;

      /** When this invoice was settled */
      settle_date?: number | null;

      /**
       * A bare-bones invoice for a payment within the Lightning Network.  With the
       * details of the invoice, the sender has all the data necessary to send a
       * payment to the recipient.
       */
      payment_request?: string | null;

      /**
       * Hash (SHA-256) of a description of the payment. Used if the description of
       * payment (memo) is too long to naturally fit within the description field
       * of an encoded payment request.
       */
      description_hash?: Uint8Array | null;

      /** Payment request expiry time in seconds. Default is 3600 (1 hour). */
      expiry?: number | null;

      /** Fallback on-chain address. */
      fallback_addr?: string | null;

      /** Delta to use for the time-lock of the CLTV extended to the final hop. */
      cltv_expiry?: number | null;

      /**
       * Route hints that can each be individually used to assist in reaching the
       * invoice's destination.
       */
      route_hints?: lnrpc.IRouteHint[] | null;

      /** Whether this invoice should include routing hints for private channels. */
      private?: boolean | null;

      /**
       * The "add" index of this invoice. Each newly created invoice will increment
       * this index making it monotonically increasing. Callers to the
       * SubscribeInvoices call can use this to instantly get notified of all added
       * invoices with an add_index greater than this one.
       */
      add_index?: number | null;

      /**
       * The "settle" index of this invoice. Each newly settled invoice will
       * increment this index making it monotonically increasing. Callers to the
       * SubscribeInvoices call can use this to instantly get notified of all
       * settled invoices with an settle_index greater than this one.
       */
      settle_index?: number | null;

      /**
       * The amount that was accepted for this invoice. This will ONLY be set if
       * this invoice has been settled. We provide this field as if the invoice was
       * created with a zero value, then we need to record what amount was
       * ultimately accepted. Additionally, it's possible that the sender paid MORE
       * that was specified in the original invoice. So we'll record that here as
       * well.
       */
      amt_paid?: number | null;
    }

    /** Represents an Invoice. */
    class Invoice implements IInvoice {
      /**
       * Constructs a new Invoice.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IInvoice);

      /**
       * An optional memo to attach along with the invoice. Used for record keeping
       * purposes for the invoice's creator, and will also be set in the description
       * field of the encoded payment request if the description_hash field is not
       * being used.
       */
      public memo: string;

      /** An optional cryptographic receipt of payment */
      public receipt: Uint8Array;

      /**
       * The hex-encoded preimage (32 byte) which will allow settling an incoming
       * HTLC payable to this preimage
       */
      public r_preimage: Uint8Array;

      /** The hash of the preimage */
      public r_hash: Uint8Array;

      /** The value of this invoice in satoshis */
      public value: number;

      /** Whether this invoice has been fulfilled */
      public settled: boolean;

      /** When this invoice was created */
      public creation_date: number;

      /** When this invoice was settled */
      public settle_date: number;

      /**
       * A bare-bones invoice for a payment within the Lightning Network.  With the
       * details of the invoice, the sender has all the data necessary to send a
       * payment to the recipient.
       */
      public payment_request: string;

      /**
       * Hash (SHA-256) of a description of the payment. Used if the description of
       * payment (memo) is too long to naturally fit within the description field
       * of an encoded payment request.
       */
      public description_hash: Uint8Array;

      /** Payment request expiry time in seconds. Default is 3600 (1 hour). */
      public expiry: number;

      /** Fallback on-chain address. */
      public fallback_addr: string;

      /** Delta to use for the time-lock of the CLTV extended to the final hop. */
      public cltv_expiry: number;

      /**
       * Route hints that can each be individually used to assist in reaching the
       * invoice's destination.
       */
      public route_hints: lnrpc.IRouteHint[];

      /** Whether this invoice should include routing hints for private channels. */
      public private: boolean;

      /**
       * The "add" index of this invoice. Each newly created invoice will increment
       * this index making it monotonically increasing. Callers to the
       * SubscribeInvoices call can use this to instantly get notified of all added
       * invoices with an add_index greater than this one.
       */
      public add_index: number;

      /**
       * The "settle" index of this invoice. Each newly settled invoice will
       * increment this index making it monotonically increasing. Callers to the
       * SubscribeInvoices call can use this to instantly get notified of all
       * settled invoices with an settle_index greater than this one.
       */
      public settle_index: number;

      /**
       * The amount that was accepted for this invoice. This will ONLY be set if
       * this invoice has been settled. We provide this field as if the invoice was
       * created with a zero value, then we need to record what amount was
       * ultimately accepted. Additionally, it's possible that the sender paid MORE
       * that was specified in the original invoice. So we'll record that here as
       * well.
       */
      public amt_paid: number;
    }

    /** Properties of an AddInvoiceResponse. */
    interface IAddInvoiceResponse {
      /** AddInvoiceResponse r_hash */
      r_hash?: Uint8Array | null;

      /**
       * A bare-bones invoice for a payment within the Lightning Network.  With the
       * details of the invoice, the sender has all the data necessary to send a
       * payment to the recipient.
       */
      payment_request?: string | null;

      /**
       * The "add" index of this invoice. Each newly created invoice will increment
       * this index making it monotonically increasing. Callers to the
       * SubscribeInvoices call can use this to instantly get notified of all added
       * invoices with an add_index greater than this one.
       */
      add_index?: number | null;
    }

    /** Represents an AddInvoiceResponse. */
    class AddInvoiceResponse implements IAddInvoiceResponse {
      /**
       * Constructs a new AddInvoiceResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IAddInvoiceResponse);

      /** AddInvoiceResponse r_hash. */
      public r_hash: Uint8Array;

      /**
       * A bare-bones invoice for a payment within the Lightning Network.  With the
       * details of the invoice, the sender has all the data necessary to send a
       * payment to the recipient.
       */
      public payment_request: string;

      /**
       * The "add" index of this invoice. Each newly created invoice will increment
       * this index making it monotonically increasing. Callers to the
       * SubscribeInvoices call can use this to instantly get notified of all added
       * invoices with an add_index greater than this one.
       */
      public add_index: number;
    }

    /** Properties of a PaymentHash. */
    interface IPaymentHash {
      /**
       * The hex-encoded payment hash of the invoice to be looked up. The passed
       * payment hash must be exactly 32 bytes, otherwise an error is returned.
       */
      r_hash_str?: string | null;

      /** The payment hash of the invoice to be looked up. */
      r_hash?: Uint8Array | null;
    }

    /** Represents a PaymentHash. */
    class PaymentHash implements IPaymentHash {
      /**
       * Constructs a new PaymentHash.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPaymentHash);

      /**
       * The hex-encoded payment hash of the invoice to be looked up. The passed
       * payment hash must be exactly 32 bytes, otherwise an error is returned.
       */
      public r_hash_str: string;

      /** The payment hash of the invoice to be looked up. */
      public r_hash: Uint8Array;
    }

    /** Properties of a ListInvoiceRequest. */
    interface IListInvoiceRequest {
      /** Toggles if all invoices should be returned, or only those that are currently unsettled. */
      pending_only?: boolean | null;
    }

    /** Represents a ListInvoiceRequest. */
    class ListInvoiceRequest implements IListInvoiceRequest {
      /**
       * Constructs a new ListInvoiceRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IListInvoiceRequest);

      /** Toggles if all invoices should be returned, or only those that are currently unsettled. */
      public pending_only: boolean;
    }

    /** Properties of a ListInvoiceResponse. */
    interface IListInvoiceResponse {
      /** ListInvoiceResponse invoices */
      invoices?: lnrpc.IInvoice[] | null;
    }

    /** Represents a ListInvoiceResponse. */
    class ListInvoiceResponse implements IListInvoiceResponse {
      /**
       * Constructs a new ListInvoiceResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IListInvoiceResponse);

      /** ListInvoiceResponse invoices. */
      public invoices: lnrpc.IInvoice[];
    }

    /** Properties of an InvoiceSubscription. */
    interface IInvoiceSubscription {
      /**
       * If specified (non-zero), then we'll first start by sending out
       * notifications for all added indexes with an add_index greater than this
       * value. This allows callers to catch up on any events they missed while they
       * weren't connected to the streaming RPC.
       */
      add_index?: number | null;

      /**
       * If specified (non-zero), then we'll first start by sending out
       * notifications for all settled indexes with an settle_index greater than
       * this value. This allows callers to catch up on any events they missed while
       * they weren't connected to the streaming RPC.
       */
      settle_index?: number | null;
    }

    /** Represents an InvoiceSubscription. */
    class InvoiceSubscription implements IInvoiceSubscription {
      /**
       * Constructs a new InvoiceSubscription.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IInvoiceSubscription);

      /**
       * If specified (non-zero), then we'll first start by sending out
       * notifications for all added indexes with an add_index greater than this
       * value. This allows callers to catch up on any events they missed while they
       * weren't connected to the streaming RPC.
       */
      public add_index: number;

      /**
       * If specified (non-zero), then we'll first start by sending out
       * notifications for all settled indexes with an settle_index greater than
       * this value. This allows callers to catch up on any events they missed while
       * they weren't connected to the streaming RPC.
       */
      public settle_index: number;
    }

    /** Properties of a Payment. */
    interface IPayment {
      /** The payment hash */
      payment_hash?: string | null;

      /** The value of the payment in satoshis */
      value?: number | null;

      /** The date of this payment */
      creation_date?: number | null;

      /** The path this payment took */
      path?: string[] | null;

      /** The fee paid for this payment in satoshis */
      fee?: number | null;

      /** The payment preimage */
      payment_preimage?: string | null;
    }

    /** Represents a Payment. */
    class Payment implements IPayment {
      /**
       * Constructs a new Payment.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPayment);

      /** The payment hash */
      public payment_hash: string;

      /** The value of the payment in satoshis */
      public value: number;

      /** The date of this payment */
      public creation_date: number;

      /** The path this payment took */
      public path: string[];

      /** The fee paid for this payment in satoshis */
      public fee: number;

      /** The payment preimage */
      public payment_preimage: string;
    }

    /** Properties of a ListPaymentsRequest. */
    interface IListPaymentsRequest {}

    /** Represents a ListPaymentsRequest. */
    class ListPaymentsRequest implements IListPaymentsRequest {
      /**
       * Constructs a new ListPaymentsRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IListPaymentsRequest);
    }

    /** Properties of a ListPaymentsResponse. */
    interface IListPaymentsResponse {
      /** The list of payments */
      payments?: lnrpc.IPayment[] | null;
    }

    /** Represents a ListPaymentsResponse. */
    class ListPaymentsResponse implements IListPaymentsResponse {
      /**
       * Constructs a new ListPaymentsResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IListPaymentsResponse);

      /** The list of payments */
      public payments: lnrpc.IPayment[];
    }

    /** Properties of a DeleteAllPaymentsRequest. */
    interface IDeleteAllPaymentsRequest {}

    /** Represents a DeleteAllPaymentsRequest. */
    class DeleteAllPaymentsRequest implements IDeleteAllPaymentsRequest {
      /**
       * Constructs a new DeleteAllPaymentsRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IDeleteAllPaymentsRequest);
    }

    /** Properties of a DeleteAllPaymentsResponse. */
    interface IDeleteAllPaymentsResponse {}

    /** Represents a DeleteAllPaymentsResponse. */
    class DeleteAllPaymentsResponse implements IDeleteAllPaymentsResponse {
      /**
       * Constructs a new DeleteAllPaymentsResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IDeleteAllPaymentsResponse);
    }

    /** Properties of a DebugLevelRequest. */
    interface IDebugLevelRequest {
      /** DebugLevelRequest show */
      show?: boolean | null;

      /** DebugLevelRequest level_spec */
      level_spec?: string | null;
    }

    /** Represents a DebugLevelRequest. */
    class DebugLevelRequest implements IDebugLevelRequest {
      /**
       * Constructs a new DebugLevelRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IDebugLevelRequest);

      /** DebugLevelRequest show. */
      public show: boolean;

      /** DebugLevelRequest level_spec. */
      public level_spec: string;
    }

    /** Properties of a DebugLevelResponse. */
    interface IDebugLevelResponse {
      /** DebugLevelResponse sub_systems */
      sub_systems?: string | null;
    }

    /** Represents a DebugLevelResponse. */
    class DebugLevelResponse implements IDebugLevelResponse {
      /**
       * Constructs a new DebugLevelResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IDebugLevelResponse);

      /** DebugLevelResponse sub_systems. */
      public sub_systems: string;
    }

    /** Properties of a PayReqString. */
    interface IPayReqString {
      /** The payment request string to be decoded */
      pay_req?: string | null;
    }

    /** Represents a PayReqString. */
    class PayReqString implements IPayReqString {
      /**
       * Constructs a new PayReqString.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPayReqString);

      /** The payment request string to be decoded */
      public pay_req: string;
    }

    /** Properties of a PayReq. */
    interface IPayReq {
      /** PayReq destination */
      destination?: string | null;

      /** PayReq payment_hash */
      payment_hash?: string | null;

      /** PayReq num_satoshis */
      num_satoshis?: number | null;

      /** PayReq timestamp */
      timestamp?: number | null;

      /** PayReq expiry */
      expiry?: number | null;

      /** PayReq description */
      description?: string | null;

      /** PayReq description_hash */
      description_hash?: string | null;

      /** PayReq fallback_addr */
      fallback_addr?: string | null;

      /** PayReq cltv_expiry */
      cltv_expiry?: number | null;

      /** PayReq route_hints */
      route_hints?: lnrpc.IRouteHint[] | null;
    }

    /** Represents a PayReq. */
    class PayReq implements IPayReq {
      /**
       * Constructs a new PayReq.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPayReq);

      /** PayReq destination. */
      public destination: string;

      /** PayReq payment_hash. */
      public payment_hash: string;

      /** PayReq num_satoshis. */
      public num_satoshis: number;

      /** PayReq timestamp. */
      public timestamp: number;

      /** PayReq expiry. */
      public expiry: number;

      /** PayReq description. */
      public description: string;

      /** PayReq description_hash. */
      public description_hash: string;

      /** PayReq fallback_addr. */
      public fallback_addr: string;

      /** PayReq cltv_expiry. */
      public cltv_expiry: number;

      /** PayReq route_hints. */
      public route_hints: lnrpc.IRouteHint[];
    }

    /** Properties of a FeeReportRequest. */
    interface IFeeReportRequest {}

    /** Represents a FeeReportRequest. */
    class FeeReportRequest implements IFeeReportRequest {
      /**
       * Constructs a new FeeReportRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IFeeReportRequest);
    }

    /** Properties of a ChannelFeeReport. */
    interface IChannelFeeReport {
      /** The channel that this fee report belongs to. */
      chan_point?: string | null;

      /** The base fee charged regardless of the number of milli-satoshis sent. */
      base_fee_msat?: number | null;

      /** The amount charged per milli-satoshis transferred expressed in millionths of a satoshi. */
      fee_per_mil?: number | null;

      /** The effective fee rate in milli-satoshis. Computed by dividing the fee_per_mil value by 1 million. */
      fee_rate?: number | null;
    }

    /** Represents a ChannelFeeReport. */
    class ChannelFeeReport implements IChannelFeeReport {
      /**
       * Constructs a new ChannelFeeReport.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IChannelFeeReport);

      /** The channel that this fee report belongs to. */
      public chan_point: string;

      /** The base fee charged regardless of the number of milli-satoshis sent. */
      public base_fee_msat: number;

      /** The amount charged per milli-satoshis transferred expressed in millionths of a satoshi. */
      public fee_per_mil: number;

      /** The effective fee rate in milli-satoshis. Computed by dividing the fee_per_mil value by 1 million. */
      public fee_rate: number;
    }

    /** Properties of a FeeReportResponse. */
    interface IFeeReportResponse {
      /** An array of channel fee reports which describes the current fee schedule for each channel. */
      channel_fees?: lnrpc.IChannelFeeReport[] | null;

      /** The total amount of fee revenue (in satoshis) the switch has collected over the past 24 hrs. */
      day_fee_sum?: number | null;

      /** The total amount of fee revenue (in satoshis) the switch has collected over the past 1 week. */
      week_fee_sum?: number | null;

      /** The total amount of fee revenue (in satoshis) the switch has collected over the past 1 month. */
      month_fee_sum?: number | null;
    }

    /** Represents a FeeReportResponse. */
    class FeeReportResponse implements IFeeReportResponse {
      /**
       * Constructs a new FeeReportResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IFeeReportResponse);

      /** An array of channel fee reports which describes the current fee schedule for each channel. */
      public channel_fees: lnrpc.IChannelFeeReport[];

      /** The total amount of fee revenue (in satoshis) the switch has collected over the past 24 hrs. */
      public day_fee_sum: number;

      /** The total amount of fee revenue (in satoshis) the switch has collected over the past 1 week. */
      public week_fee_sum: number;

      /** The total amount of fee revenue (in satoshis) the switch has collected over the past 1 month. */
      public month_fee_sum: number;
    }

    /** Properties of a PolicyUpdateRequest. */
    interface IPolicyUpdateRequest {
      /** If set, then this update applies to all currently active channels. */
      global?: boolean | null;

      /** If set, this update will target a specific channel. */
      chan_point?: lnrpc.IChannelPoint | null;

      /** The base fee charged regardless of the number of milli-satoshis sent. */
      base_fee_msat?: number | null;

      /** The effective fee rate in milli-satoshis. The precision of this value goes up to 6 decimal places, so 1e-6. */
      fee_rate?: number | null;

      /** The required timelock delta for HTLCs forwarded over the channel. */
      time_lock_delta?: number | null;
    }

    /** Represents a PolicyUpdateRequest. */
    class PolicyUpdateRequest implements IPolicyUpdateRequest {
      /**
       * Constructs a new PolicyUpdateRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPolicyUpdateRequest);

      /** If set, then this update applies to all currently active channels. */
      public global: boolean;

      /** If set, this update will target a specific channel. */
      public chan_point?: lnrpc.IChannelPoint | null;

      /** The base fee charged regardless of the number of milli-satoshis sent. */
      public base_fee_msat: number;

      /** The effective fee rate in milli-satoshis. The precision of this value goes up to 6 decimal places, so 1e-6. */
      public fee_rate: number;

      /** The required timelock delta for HTLCs forwarded over the channel. */
      public time_lock_delta: number;

      /** PolicyUpdateRequest scope. */
      public scope?: 'global' | 'chan_point';
    }

    /** Properties of a PolicyUpdateResponse. */
    interface IPolicyUpdateResponse {}

    /** Represents a PolicyUpdateResponse. */
    class PolicyUpdateResponse implements IPolicyUpdateResponse {
      /**
       * Constructs a new PolicyUpdateResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IPolicyUpdateResponse);
    }

    /** Properties of a ForwardingHistoryRequest. */
    interface IForwardingHistoryRequest {
      /** Start time is the starting point of the forwarding history request. All records beyond this point will be included, respecting the end time, and the index offset. */
      start_time?: number | null;

      /** End time is the end point of the forwarding history request. The response will carry at most 50k records between the start time and the end time. The index offset can be used to implement pagination. */
      end_time?: number | null;

      /** Index offset is the offset in the time series to start at. As each response can only contain 50k records, callers can use this to skip around within a packed time series. */
      index_offset?: number | null;

      /** The max number of events to return in the response to this query. */
      num_max_events?: number | null;
    }

    /** Represents a ForwardingHistoryRequest. */
    class ForwardingHistoryRequest implements IForwardingHistoryRequest {
      /**
       * Constructs a new ForwardingHistoryRequest.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IForwardingHistoryRequest);

      /** Start time is the starting point of the forwarding history request. All records beyond this point will be included, respecting the end time, and the index offset. */
      public start_time: number;

      /** End time is the end point of the forwarding history request. The response will carry at most 50k records between the start time and the end time. The index offset can be used to implement pagination. */
      public end_time: number;

      /** Index offset is the offset in the time series to start at. As each response can only contain 50k records, callers can use this to skip around within a packed time series. */
      public index_offset: number;

      /** The max number of events to return in the response to this query. */
      public num_max_events: number;
    }

    /** Properties of a ForwardingEvent. */
    interface IForwardingEvent {
      /** Timestamp is the time (unix epoch offset) that this circuit was completed. */
      timestamp?: number | null;

      /** The incoming channel ID that carried the HTLC that created the circuit. */
      chan_id_in?: number | null;

      /** The outgoing channel ID that carried the preimage that completed the circuit. */
      chan_id_out?: number | null;

      /** The total amount of the incoming HTLC that created half the circuit. */
      amt_in?: number | null;

      /** The total amount of the outgoign HTLC that created the second half of the circuit. */
      amt_out?: number | null;

      /** The total fee that this payment circuit carried. */
      fee?: number | null;
    }

    /** Represents a ForwardingEvent. */
    class ForwardingEvent implements IForwardingEvent {
      /**
       * Constructs a new ForwardingEvent.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IForwardingEvent);

      /** Timestamp is the time (unix epoch offset) that this circuit was completed. */
      public timestamp: number;

      /** The incoming channel ID that carried the HTLC that created the circuit. */
      public chan_id_in: number;

      /** The outgoing channel ID that carried the preimage that completed the circuit. */
      public chan_id_out: number;

      /** The total amount of the incoming HTLC that created half the circuit. */
      public amt_in: number;

      /** The total amount of the outgoign HTLC that created the second half of the circuit. */
      public amt_out: number;

      /** The total fee that this payment circuit carried. */
      public fee: number;
    }

    /** Properties of a ForwardingHistoryResponse. */
    interface IForwardingHistoryResponse {
      /** A list of forwarding events from the time slice of the time series specified in the request. */
      forwarding_events?: lnrpc.IForwardingEvent[] | null;

      /** The index of the last time in the set of returned forwarding events. Can be used to seek further, pagination style. */
      last_offset_index?: number | null;
    }

    /** Represents a ForwardingHistoryResponse. */
    class ForwardingHistoryResponse implements IForwardingHistoryResponse {
      /**
       * Constructs a new ForwardingHistoryResponse.
       * @param [properties] Properties to set
       */
      constructor(properties?: lnrpc.IForwardingHistoryResponse);

      /** A list of forwarding events from the time slice of the time series specified in the request. */
      public forwarding_events: lnrpc.IForwardingEvent[];

      /** The index of the last time in the set of returned forwarding events. Can be used to seek further, pagination style. */
      public last_offset_index: number;
    }
  }
}
