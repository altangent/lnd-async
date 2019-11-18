#!/bin/bash

set -e

cd lib/original-lnd-protos

grep -rE '^package |^service|rpc ' > ../../util-scripts/all-data.txt~
node ../../util-scripts/generate-all-api-object.js ../../util-scripts/all-data.txt~ ../all-api.js
rm -f ../../util-scripts/all-data.txt~

echo "Stream/Non-stream files were created"
