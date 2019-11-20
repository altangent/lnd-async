Here are utility scripts (bash) for generating some repository files from LND repository ones.

1. copy-proto-files.sh <lnd_repository>

This script copies only proto files from lnd to lib/original-lnd-protos with directory structure keeping.

2. generate-all-api-object.sh

This file generates full JSON structure of all API methods of all sub-servers.

3. This script runs all above listed scripts:

./util-scripts/run-all.sh <lnd_repository>
