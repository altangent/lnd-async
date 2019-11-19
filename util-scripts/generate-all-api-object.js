const fs = require('fs');
const readline = require('readline');
const util = require('util');

const writeFile = util.promisify(fs.writeFile)

;(async () => {
  // non-srteam
  let output = await processLineByLine(process.argv[2]);
  await writeFile(process.argv[3], `/* eslint-disable quotes */\nmodule.exports = ${JSON.stringify(output, null,2)};
/* eslint-enable */
`)
})();

async function processLineByLine(file) {
  const fileStream = fs.createReadStream(file);
  let pkg = null;
  let service = null;
  let output = {};

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  let res;
  for await (const line of rl) {
    if (res = /^(.*\.proto):package (\w+);/.exec(line)) {
      pkg = output[res[1]] = {file: res[1], package: res[2], services: {} };
    }
    else if (res = /^(.*\.proto):service (\w+) /.exec(line)) {
      service = pkg.services[res[2]] = {service: res[2], streamApi: [], callbackApi: []};
    }
    else if (res = /^.*\.proto:\s+rpc (\w+)\s*\(.*returns \(stream /.exec(line)) {
      service.streamApi.push(res[1]);
    }
    else if (res = /^.*\.proto:\s+rpc (\w+)\s*\(.*returns \(/.exec(line)) {
      service.callbackApi.push(res[1]);
    }
    else {
      throw new Error(`Should not be! [${line}]`)
    }
  }
  return output;
}
