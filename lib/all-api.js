/* eslint-disable quotes */
module.exports = {
  "routerrpc/router.proto": {
    "file": "routerrpc/router.proto",
    "package": "routerrpc",
    "services": {
      "Router": {
        "service": "Router",
        "streamApi": [
          "SendPaymentV2",
          "TrackPaymentV2",
          "SubscribeHtlcEvents",
          "SendPayment",
          "TrackPayment",
          "HtlcInterceptor"
        ],
        "callbackApi": [
          "EstimateRouteFee",
          "SendToRoute",
          "SendToRouteV2",
          "ResetMissionControl",
          "QueryMissionControl",
          "XImportMissionControl",
          "GetMissionControlConfig",
          "SetMissionControlConfig",
          "QueryProbability",
          "BuildRoute",
          "UpdateChanStatus"
        ]
      }
    }
  },
  "stateservice.proto": {
    "file": "stateservice.proto",
    "package": "lnrpc",
    "services": {
      "State": {
        "service": "State",
        "streamApi": [
          "SubscribeState"
        ],
        "callbackApi": [
          "GetState"
        ]
      }
    }
  },
  "verrpc/verrpc.proto": {
    "file": "verrpc/verrpc.proto",
    "package": "verrpc",
    "services": {
      "Versioner": {
        "service": "Versioner",
        "streamApi": [],
        "callbackApi": [
          "GetVersion"
        ]
      }
    }
  },
  "walletrpc/walletkit.proto": {
    "file": "walletrpc/walletkit.proto",
    "package": "walletrpc",
    "services": {
      "WalletKit": {
        "service": "WalletKit",
        "streamApi": [],
        "callbackApi": [
          "ListUnspent",
          "LeaseOutput",
          "ReleaseOutput",
          "ListLeases",
          "DeriveNextKey",
          "DeriveKey",
          "NextAddr",
          "ListAccounts",
          "ImportAccount",
          "ImportPublicKey",
          "PublishTransaction",
          "SendOutputs",
          "EstimateFee",
          "PendingSweeps",
          "BumpFee",
          "ListSweeps",
          "LabelTransaction",
          "FundPsbt",
          "FinalizePsbt"
        ]
      }
    }
  },
  "invoicesrpc/invoices.proto": {
    "file": "invoicesrpc/invoices.proto",
    "package": "invoicesrpc",
    "services": {
      "Invoices": {
        "service": "Invoices",
        "streamApi": [
          "SubscribeSingleInvoice"
        ],
        "callbackApi": [
          "CancelInvoice",
          "AddHoldInvoice",
          "SettleInvoice"
        ]
      }
    }
  },
  "chainrpc/chainnotifier.proto": {
    "file": "chainrpc/chainnotifier.proto",
    "package": "chainrpc",
    "services": {
      "ChainNotifier": {
        "service": "ChainNotifier",
        "streamApi": [
          "RegisterConfirmationsNtfn",
          "RegisterSpendNtfn",
          "RegisterBlockEpochNtfn"
        ],
        "callbackApi": []
      }
    }
  },
  "watchtowerrpc/watchtower.proto": {
    "file": "watchtowerrpc/watchtower.proto",
    "package": "watchtowerrpc",
    "services": {
      "Watchtower": {
        "service": "Watchtower",
        "streamApi": [],
        "callbackApi": [
          "GetInfo"
        ]
      }
    }
  },
  "autopilotrpc/autopilot.proto": {
    "file": "autopilotrpc/autopilot.proto",
    "package": "autopilotrpc",
    "services": {
      "Autopilot": {
        "service": "Autopilot",
        "streamApi": [],
        "callbackApi": [
          "Status",
          "ModifyStatus",
          "QueryScores",
          "SetScores"
        ]
      }
    }
  },
  "signrpc/signer.proto": {
    "file": "signrpc/signer.proto",
    "package": "signrpc",
    "services": {
      "Signer": {
        "service": "Signer",
        "streamApi": [],
        "callbackApi": [
          "SignOutputRaw",
          "ComputeInputScript",
          "SignMessage",
          "VerifyMessage",
          "DeriveSharedKey"
        ]
      }
    }
  },
  "walletunlocker.proto": {
    "file": "walletunlocker.proto",
    "package": "lnrpc",
    "services": {
      "WalletUnlocker": {
        "service": "WalletUnlocker",
        "streamApi": [],
        "callbackApi": [
          "GenSeed",
          "InitWallet",
          "UnlockWallet",
          "ChangePassword"
        ]
      }
    }
  },
  "wtclientrpc/wtclient.proto": {
    "file": "wtclientrpc/wtclient.proto",
    "package": "wtclientrpc",
    "services": {
      "WatchtowerClient": {
        "service": "WatchtowerClient",
        "streamApi": [],
        "callbackApi": [
          "AddTower",
          "RemoveTower",
          "ListTowers",
          "GetTowerInfo",
          "Stats",
          "Policy"
        ]
      }
    }
  },
  "rpc.proto": {
    "file": "rpc.proto",
    "package": "lnrpc",
    "services": {
      "Lightning": {
        "service": "Lightning",
        "streamApi": [
          "SubscribeTransactions",
          "SubscribePeerEvents",
          "SubscribeChannelEvents",
          "OpenChannel",
          "ChannelAcceptor",
          "CloseChannel",
          "SendPayment",
          "SendToRoute",
          "SubscribeInvoices",
          "SubscribeChannelGraph",
          "SubscribeChannelBackups"
        ],
        "callbackApi": [
          "WalletBalance",
          "ChannelBalance",
          "GetTransactions",
          "EstimateFee",
          "SendCoins",
          "ListUnspent",
          "SendMany",
          "NewAddress",
          "SignMessage",
          "VerifyMessage",
          "ConnectPeer",
          "DisconnectPeer",
          "ListPeers",
          "GetInfo",
          "GetRecoveryInfo",
          "PendingChannels",
          "ListChannels",
          "ClosedChannels",
          "OpenChannelSync",
          "FundingStateStep",
          "AbandonChannel",
          "SendPaymentSync",
          "SendToRouteSync",
          "AddInvoice",
          "ListInvoices",
          "LookupInvoice",
          "DecodePayReq",
          "ListPayments",
          "DeleteAllPayments",
          "DescribeGraph",
          "GetNodeMetrics",
          "GetChanInfo",
          "GetNodeInfo",
          "QueryRoutes",
          "GetNetworkInfo",
          "StopDaemon",
          "DebugLevel",
          "FeeReport",
          "UpdateChannelPolicy",
          "ForwardingHistory",
          "ExportChannelBackup",
          "ExportAllChannelBackups",
          "VerifyChanBackup",
          "RestoreChannelBackups",
          "BakeMacaroon",
          "ListMacaroonIDs",
          "DeleteMacaroonID",
          "ListPermissions"
        ]
      }
    }
  }
};
/* eslint-enable */
