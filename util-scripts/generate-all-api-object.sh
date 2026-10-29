#!/bin/bash

# Usage (from the repository root): util-scripts/generate-all-api-object.sh [proto_dir] [output]
# Defaults: lib/original-lnd-protos, lib/all-api.js

set -e

root=`pwd`
proto_dir=${1:-lib/original-lnd-protos}
output=${2:-lib/all-api.js}

cd "$proto_dir"

node "$root/lib/generate-all-api-object.js" "$root/$output"

echo "Stream/Non-stream files were created"
