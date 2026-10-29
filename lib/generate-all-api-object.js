const fs = require('fs')
const {writeFile, readdir} = require('fs/promises')
const readline = require('readline')
const path = require('path')

let output = {}

;(async () => {
  for (const fileOrDir of await readSortedDir('.')) {
    await readFileOrDirectory('.', fileOrDir)
  }

  await writeFile(process.argv[2], `/* eslint-disable quotes */\nmodule.exports = ${JSON.stringify(output, null,2)};
/* eslint-enable */
`)
})()

// The order of directory entries depends on the filesystem, so they are sorted
// by name (code points, not locale) to keep all-api.js stable between runs
async function readSortedDir(dir) {
  let entries = await readdir(dir, {withFileTypes: true})
  return entries.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
}

async function readFileOrDirectory(base, fileOrDir){
  if (fileOrDir.isDirectory()) {
    let newBase = path.join(base, fileOrDir.name)

    for (const entry of await readSortedDir(newBase)) {
      await readFileOrDirectory(newBase, entry)
    }
  }
  else {
    try {
      await processLineByLine(path.join(base, fileOrDir.name))
    } catch (e) {
      console.error("Error processing: %s", e.message)
    }
  }
}

async function processLineByLine(file) {
  console.log("processLineByLine, file: %s", file)

  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  let res, oneOrTwoLines = null, pkg = null, service = null

  for await (const line of rl) {
    if (oneOrTwoLines === null)
      oneOrTwoLines = line
    else
      oneOrTwoLines += "\n" + line

    if (res = /^package (\w+);/.exec(oneOrTwoLines)) {
      pkg = output[file] = {file, package: res[1], services: {} }
    }
    else if (res = /^service (\w+) /.exec(oneOrTwoLines)) {
      if (service)
        throw new Error(`The file ${file} has one more service!`)
      service = pkg.services[res[1]] = {service: res[1], streamApi: [], callbackApi: []}
    }
    else if (res = /^\s+rpc (\w+) \(/.exec(oneOrTwoLines)) {
      if (! /\s+returns \(/.exec(oneOrTwoLines))
        continue

      let rpcName = res[1]

      if (res = /\s+returns \(stream /.exec(oneOrTwoLines))
        service.streamApi.push(rpcName)
      else
        service.callbackApi.push(rpcName)
    }
    oneOrTwoLines = null
  }

  if (! pkg || ! service) {
    console.warn(`Warning: the file ${file} doesn't have a "package" or "service" directive`)
    if (pkg)
      delete output[file]
  }
}
