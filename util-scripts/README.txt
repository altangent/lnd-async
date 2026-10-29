Here are utility scripts for generating repository files from the LND repository.
Run them from the root of the `lnd-async` repository.

The bundled LND lines are listed in lib/versions.js: for each line its LND tag, the directory
of its protos and its all-api.js. The default line keeps its protos in lib/original-lnd-protos
and its API list in lib/all-api.js.

1. util-scripts/copy-proto-files.sh <lnd_repository> [target_dir]

Copies the proto files of lnrpc/ (keeping the directory structure) into target_dir
(default: lib/original-lnd-protos) and removes protos that LND no longer has.

2. util-scripts/generate-all-api-object.sh [proto_dir] [output]

Generates the list of services and methods (stream or not) of every proto
(default: lib/original-lnd-protos -> lib/all-api.js).

3. node util-scripts/generate-types.js   (or: npm run generate-types)

Generates the TypeScript declarations lib/types/lnd-<line>.d.ts of every line and
lib/types/index.d.ts. `npm test` fails when they are out of date.

4. util-scripts/run-all.sh <lnd_repository> [line]

Runs all of the above for one line (default: the default line). The LND checkout must be at
the tag recorded for the line in lib/versions.js:

    git -C /path/to/lnd checkout v0.21.5-beta
    ./util-scripts/run-all.sh /path/to/lnd 0.21

To add a new line, add it to lib/versions.js first (protoDir 'lnd-<line>/protos',
api 'lnd-<line>/all-api.js', types 'types/lnd-<line>.d.ts'), then run run-all.sh, and update
the list of lines in test/offline.spec.js and README.md.
