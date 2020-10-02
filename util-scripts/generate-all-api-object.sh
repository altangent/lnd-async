#!/bin/bash

set -e

cd lib/original-lnd-protos

node ../generate-all-api-object.js ../all-api.js

echo "Stream/Non-stream files were created"
