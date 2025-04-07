/* eslint-disable quotes */
module.exports = {
  "lightning.proto": {
    "file": "lightning.proto",
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
          "SubscribeChannelBackups",
          "RegisterRPCMiddleware",
          "SubscribeCustomMessages"
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
          "GetDebugInfo",
          "GetRecoveryInfo",
          "PendingChannels",
          "ListChannels",
          "ClosedChannels",
          "OpenChannelSync",
          "BatchOpenChannel",
          "FundingStateStep",
          "AbandonChannel",
          "SendPaymentSync",
          "SendToRouteSync",
          "AddInvoice",
          "ListInvoices",
          "LookupInvoice",
          "DecodePayReq",
          "ListPayments",
          "DeletePayment",
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
          "ListPermissions",
          "CheckMacaroonPermissions",
          "SendCustomMessage",
          "ListAliases",
          "LookupHtlcResolution"
        ]
      }
    }
  },
  "routerrpc/router.proto": {
    "file": "routerrpc/router.proto",
    "package": "routerrpc",
    "services": {
      "Router": {
        "service": "Router",
        "streamApi": [
          "SendPaymentV2",
          "TrackPaymentV2",
          "TrackPayments",
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
          "UpdateChanStatus",
          "XAddLocalChanAliases",
          "XDeleteLocalChanAliases"
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
  "devrpc/dev.proto": {
    "file": "devrpc/dev.proto",
    "package": "devrpc",
    "services": {
      "Dev": {
        "service": "Dev",
        "streamApi": [],
        "callbackApi": [
          "ImportGraph"
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
  "peersrpc/peers.proto": {
    "file": "peersrpc/peers.proto",
    "package": "peersrpc",
    "services": {
      "Peers": {
        "service": "Peers",
        "streamApi": [],
        "callbackApi": [
          "UpdateNodeAnnouncement"
        ]
      }
    }
  },
  "neutrinorpc/neutrino.proto": {
    "file": "neutrinorpc/neutrino.proto",
    "package": "neutrinorpc",
    "services": {
      "NeutrinoKit": {
        "service": "NeutrinoKit",
        "streamApi": [],
        "callbackApi": [
          "Status",
          "AddPeer",
          "DisconnectPeer",
          "IsBanned",
          "GetBlockHeader",
          "GetBlock",
          "GetCFilter",
          "GetBlockHash"
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
          "GetTransaction",
          "ListAccounts",
          "RequiredReserve",
          "ListAddresses",
          "SignMessageWithAddr",
          "VerifyMessageWithAddr",
          "ImportAccount",
          "ImportPublicKey",
          "ImportTapscript",
          "PublishTransaction",
          "RemoveTransaction",
          "SendOutputs",
          "EstimateFee",
          "PendingSweeps",
          "BumpFee",
          "ListSweeps",
          "LabelTransaction",
          "FundPsbt",
          "SignPsbt",
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
          "SubscribeSingleInvoice",
          "HtlcModifier"
        ],
        "callbackApi": [
          "CancelInvoice",
          "AddHoldInvoice",
          "SettleInvoice",
          "LookupInvoiceV2"
        ]
      }
    }
  },
  "chainrpc/chainkit.proto": {
    "file": "chainrpc/chainkit.proto",
    "package": "chainrpc",
    "services": {
      "ChainKit": {
        "service": "ChainKit",
        "streamApi": [],
        "callbackApi": [
          "GetBlock",
          "GetBlockHeader",
          "GetBestBlock",
          "GetBlockHash"
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
          "DeriveSharedKey",
          "MuSig2CombineKeys",
          "MuSig2CreateSession",
          "MuSig2RegisterNonces",
          "MuSig2Sign",
          "MuSig2CombineSig",
          "MuSig2Cleanup"
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
          "DeactivateTower",
          "TerminateSession",
          "ListTowers",
          "GetTowerInfo",
          "Stats",
          "Policy"
        ]
      }
    }
  }
};
/* eslint-enable */
