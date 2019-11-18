let allApi = require('all-api')

function lowerCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}

module.exports = {
  streamApis: [
    Object.values(allApi['rpc.proto'].services)
      .reduce(
        (acc, v) => {
          v.streamApi.forEach(
            v => {
              acc.push(lowerCamelCase(v));
            }
          );
        },
        []
      )
  ],
  callbackApis: [
    Object.values(allApi['rpc.proto'].services)
      .reduce(
        (acc, v) => {
          v.callbackApi.forEach(
            v => {
              acc.push(lowerCamelCase(v));
            }
          );
        },
        []
      )
  ],
  lowerCamelCase,
  allApi
};
