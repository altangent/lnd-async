const path = require('path');
const os = require('os');
const fs = require('fs');
const { promisify } = require('util');

const fsReadFile = promisify(fs.readFile);
const fsAccess = promisify(fs.access);

module.exports = {
  getLndRootPath,
  getDefaultCertAndMacaroonPaths,
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
function getDefaultCertAndMacaroonPaths() {
  let lndRootPath = getLndRootPath();
  let defaultCertPath = path.join(lndRootPath, 'tls.cert');
  let defaultMacaroonPath = path.join(lndRootPath, 'admin.macaroon');
  return { defaultCertPath, defaultMacaroonPath };
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
