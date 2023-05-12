let allApi = require('./all-api')

function lowerCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}

module.exports = {
  streamApis:
    Object.values({...allApi['lightning.proto'].services, ...allApi['stateservice.proto'].services, ...allApi['walletunlocker.proto'].services})
      .reduce(
        (acc, v) => {
          v.streamApi.forEach(
            v => {
              return acc.add(lowerCamelCase(v));
            }
          );
          return acc;
        },
        new Set()
      ),
  callbackApis:
    Object.values({...allApi['lightning.proto'].services, ...allApi['stateservice.proto'].services, ...allApi['walletunlocker.proto'].services})
      .reduce(
        (acc, v) => {
          v.callbackApi.forEach(
            v => {
              return acc.add(lowerCamelCase(v));
            }
          );
          return acc;
        },
        new Set()
      ),
  lowerCamelCase,
  allApi,
  allStreamApi:
    Object.values(allApi)
      .reduce(
        (acc, proto) => {
          Object.values(proto.services)
            .reduce(
              (acc, service) => {
                service.streamApi.forEach(
                  v => {
                    return acc.add(`${service.service}.${lowerCamelCase(v)}`);
                  }
                );
                return acc;
              },
              acc
            );
          return acc;
        },
        new Set()
      ),
  allCallbackApi:
    Object.values(allApi)
      .reduce(
        (acc, proto) => {
          Object.values(proto.services)
            .reduce(
              (acc, service) => {
                service.callbackApi.forEach(
                  v => {
                    return acc.add(`${service.service}.${lowerCamelCase(v)}`);
                  }
                );
                return acc;
              },
              acc
            );
          return acc;
        },
        new Set()
      ),
};
