#!/bin/bash

set -e

./util-scripts/copy-proto-files.sh $1
./util-scripts/generate-all-api-object.sh
echo "Everything was done OK!"
