#!/bin/bash

set -e

lnd_async_dir=`pwd`
lnd_repo=${1:-extra/lnd}
cd $lnd_repo/lnrpc
rsync -azv --include=**.proto --include=*/ --exclude=** ./ $lnd_async_dir/lib/original-lnd-protos/
echo "The proto files are copied"
