// LND release lines whose protos are bundled with lnd-async. Paths are relative to lib/.
//
// `defaultVersion` is used when connect() gets no `lndVersion`. It is the line this major
// version of lnd-async was built on and changes only in a new major version, because a newer
// LND line may remove RPCs and fields that existing code relies on (0.21 removed SendPaymentSync).
// The protos of the default line stay in lib/original-lnd-protos, where they have always been.
module.exports = {
  defaultVersion: '0.20',
  versions: {
    '0.18': {
      lndTag: 'v0.18.5-beta',
      protoDir: 'lnd-0.18/protos',
      api: 'lnd-0.18/all-api.js',
      types: 'types/lnd-0.18.d.ts',
    },
    '0.19': {
      lndTag: 'v0.19.3-beta',
      protoDir: 'lnd-0.19/protos',
      api: 'lnd-0.19/all-api.js',
      types: 'types/lnd-0.19.d.ts',
    },
    '0.20': {
      lndTag: 'v0.20.6-beta',
      protoDir: 'original-lnd-protos',
      api: 'all-api.js',
      types: 'types/lnd-0.20.d.ts',
    },
    '0.21': {
      lndTag: 'v0.21.5-beta',
      protoDir: 'lnd-0.21/protos',
      api: 'lnd-0.21/all-api.js',
      types: 'types/lnd-0.21.d.ts',
    },
  },
};
