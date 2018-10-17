const path = require('path');
const os = require('os');
const fs = require('fs');
const { promisify } = require('util');

const fsReadFile = promisify(fs.readFile);
const fsAccess = promisify(fs.access);

module.exports = {
  getLndRootPath,
  findCertPath,
  findMacaroonPath,
  validateFileAccess,
  readFile: fsReadFile,
};

/**
 * Retrieves the OS specific path to LND installation.
 * @returns {String}
 */
function getLndRootPath() {
  let platform = os.platform();
  if (platform === 'darwin') return path.join(os.homedir(), '/Library/Application Support/Lnd');
  else if (platform === 'win32') return path.join(os.homedir(), '/AppData/Local/Lnd');
  else return path.join(os.homedir(), '.lnd');
}

/**
 * Retrieves the default cert and macaroon from the OS
 * specific LND director
 * @returns {{defaultCertPath:String,defaultMacaroonPath:String}}
 */
function findCertPath() {
  let lndRootPath = getLndRootPath();
  return path.join(lndRootPath, 'tls.cert');
}

/**
 * Validates that the file at the specified path can be read
 * @param {String} path
 * @returns {Promise<Boolean>}
 */
async function validateFileAccess(path) {
  try {
    await fsAccess(path, fs.constants.F_OK | fs.constants.R_OK);
    return true;
  } catch (ex) {
    return false;
  }
}

function findMacaroonPath() {
  let macaroonPath = path.join(getLndRootPath(), 'data', 'chain');

  // search chain folder
  let dirs = fs.readdirSync(macaroonPath);
  if (dirs.length > 1)
    throw new Error('Macaroon path could not be auto configured, use macaroonPath');
  macaroonPath = path.join(macaroonPath, dirs[0]);

  // search network folder for network
  dirs = fs.readdirSync(macaroonPath);
  if (dirs.length > 1)
    throw new Error('Macaroon path could not be auto configured, use macaroonPath');

  macaroonPath = path.join(macaroonPath, dirs[0], 'admin.macaroon');

  return macaroonPath;
}
