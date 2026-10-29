// Strict mode: connect({ strict: true }) validates each request against its protobuf message
// before it is sent. Without it protobufjs drops unknown fields, coerces values and replaces an
// unknown enum name with the first value of the enum, all silently.
const fs = require('fs');
const path = require('path');
const protobuf = require('protobufjs');
const { lowerCamelCase } = require('./common');

class ValidationError extends TypeError {
  constructor(messageType, fieldPath, problem) {
    super(`${messageType}${fieldPath ? '.' + fieldPath : ''}: ${problem}`);
    this.name = 'ValidationError';
    this.messageType = messageType;
    this.path = fieldPath;
  }
}

const INT32 = [-2147483648, 2147483647];
const UINT32 = [0, 4294967295];
const INT_RANGES = {
  int32: INT32,
  sint32: INT32,
  sfixed32: INT32,
  uint32: UINT32,
  fixed32: UINT32,
};
const SIGNED_LONGS = new Set(['int64', 'sint64', 'sfixed64']);
const UNSIGNED_LONGS = new Set(['uint64', 'fixed64']);
const LONG_RANGE = { signed: [-(2n ** 63n), 2n ** 63n - 1n], unsigned: [0n, 2n ** 64n - 1n] };
// What protobufjs 6 decodes: the standard alphabet, padding optional, nothing after it
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}(?:==)?|[A-Za-z0-9+/]{3}=?)?$/;

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

function describe(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'an array';
  if (Buffer.isBuffer(value)) return 'a Buffer';
  if (typeof value === 'string') {
    let shown = value.length > 40 ? value.slice(0, 37) + '...' : value;
    return `the string ${JSON.stringify(shown)}`;
  }
  if (typeof value === 'object') return 'an object';
  if (typeof value === 'bigint') return `the bigint ${value}`;
  return `${typeof value} ${String(value)}`;
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !Buffer.isBuffer(value) &&
    !ArrayBuffer.isView(value)
  );
}

function levenshtein(a, b) {
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      let current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = current;
    }
  }
  return row[b.length];
}

function suggestion(type, key) {
  let snake = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  if (snake !== key && has(type.fields, snake)) return ` (did you mean "${snake}"?)`;
  let best;
  let bestDistance = 3;
  for (let name of Object.keys(type.fields)) {
    let distance = levenshtein(key, name);
    if (distance < bestDistance) [best, bestDistance] = [name, distance];
  }
  return best ? ` (did you mean "${best}"?)` : '';
}

function join(at, key) {
  return at ? `${at}.${key}` : key;
}

class Validator {
  constructor(type) {
    this.type = type;
    this.name = type.fullName.slice(1);
  }

  fail(at, problem) {
    throw new ValidationError(this.name, at, problem);
  }

  validate(request) {
    this.message(this.type, request, '');
  }

  message(type, value, at) {
    if (!isPlainObject(value)) this.fail(at, `expected an object, got ${describe(value)}`);
    for (let key of Object.keys(value)) {
      let item = value[key];
      if (has(type.fields, key)) {
        if (item !== undefined && item !== null) this.field(type.fields[key], item, join(at, key));
      } else if (type.oneofs && has(type.oneofs, key)) {
        // The virtual property set by `oneofs: true` in responses; ignored when encoding
        let members = type.oneofs[key].oneof;
        if (item !== undefined && item !== null && !members.includes(item)) {
          this.fail(
            join(at, key),
            `expected one of ${members.map(m => `"${m}"`).join(', ')}, got ${describe(item)}`
          );
        }
      } else {
        this.fail(join(at, key), `unknown field${suggestion(type, key)}`);
      }
    }
    // Only one member of a oneof is sent; the oneof property, when given, must name that member
    for (let oneof of type.oneofsArray) {
      let set = oneof.oneof.filter(
        name => has(value, name) && value[name] !== undefined && value[name] !== null
      );
      if (set.length > 1) {
        let names = set.map(name => `"${name}"`).join(', ');
        this.fail(join(at, set[1]), `only one of ${names} may be set (oneof ${oneof.name})`);
      }
      let named = has(value, oneof.name) ? value[oneof.name] : undefined;
      if (named !== undefined && named !== null && named !== set[0]) {
        let actual = set.length ? `"${set[0]}" is set` : 'that field is not set';
        this.fail(join(at, oneof.name), `names "${named}", but ${actual}`);
      }
    }
  }

  field(field, value, at) {
    if (field.map) {
      if (!isPlainObject(value)) this.fail(at, `expected an object (map), got ${describe(value)}`);
      for (let key of Object.keys(value)) {
        let where = `${at}[${JSON.stringify(key)}]`;
        this.mapKey(field.keyType, key, where);
        this.value(field, value[key], where);
      }
    } else if (field.repeated) {
      if (!Array.isArray(value)) this.fail(at, `expected an array, got ${describe(value)}`);
      value.forEach((item, i) => this.value(field, item, `${at}[${i}]`));
    } else {
      this.value(field, value, at);
    }
  }

  value(field, value, at) {
    let resolved = field.resolvedType;
    if (resolved instanceof protobuf.Type) return this.message(resolved, value, at);
    if (resolved instanceof protobuf.Enum) return this.enumValue(resolved, value, at);
    let type = field.type;
    if (type === 'string') {
      if (typeof value !== 'string') this.fail(at, `expected a string, got ${describe(value)}`);
    } else if (type === 'bool') {
      if (typeof value !== 'boolean') this.fail(at, `expected a boolean, got ${describe(value)}`);
    } else if (type === 'double' || type === 'float') {
      if (typeof value !== 'number') this.fail(at, `expected a number, got ${describe(value)}`);
    } else if (type === 'bytes') {
      let ok = value instanceof Uint8Array || (typeof value === 'string' && BASE64.test(value));
      if (!ok)
        this.fail(at, `expected a Buffer, a Uint8Array or a base64 string, got ${describe(value)}`);
    } else if (has(INT_RANGES, type)) {
      let [min, max] = INT_RANGES[type];
      if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
        this.fail(
          at,
          `expected an integer from ${min} to ${max} (${type}), got ${describe(value)}`
        );
      }
    } else if (SIGNED_LONGS.has(type) || UNSIGNED_LONGS.has(type)) {
      this.long(type, value, at);
    } else {
      this.fail(at, `unsupported field type ${type}`);
    }
  }

  long(type, value, at) {
    let unsigned = UNSIGNED_LONGS.has(type);
    let [min, max] = unsigned ? LONG_RANGE.unsigned : LONG_RANGE.signed;
    let expected = `an integer from ${min} to ${max} (${type}) as a number, a decimal string or a Long`;
    if (typeof value === 'number') {
      if (!Number.isSafeInteger(value) || BigInt(value) < min) {
        let hint = Number.isInteger(value) ? ' (beyond 2^53, pass it as a string)' : '';
        this.fail(at, `expected ${expected}, got ${describe(value)}${hint}`);
      }
    } else if (typeof value === 'string') {
      if (!/^-?\d+$/.test(value) || BigInt(value) < min || BigInt(value) > max) {
        this.fail(at, `expected ${expected}, got ${describe(value)}`);
      }
    } else if (
      !(isPlainObject(value) && Number.isInteger(value.low) && Number.isInteger(value.high))
    ) {
      this.fail(at, `expected ${expected}, got ${describe(value)}`);
    }
  }

  enumValue(type, value, at) {
    let known =
      typeof value === 'string'
        ? has(type.values, value)
        : typeof value === 'number' && has(type.valuesById, value);
    if (!known) {
      let names = Object.keys(type.values)
        .map(n => `"${n}"`)
        .join(', ');
      this.fail(
        at,
        `expected a value of ${type.fullName.slice(1)} (${names}), got ${describe(value)}`
      );
    }
  }

  mapKey(keyType, key, at) {
    if (keyType === 'string') return;
    if (keyType === 'bool') {
      if (key !== 'true' && key !== 'false') this.fail(at, `expected a map key "true" or "false"`);
      return;
    }
    let unsigned = UNSIGNED_LONGS.has(keyType) || keyType === 'uint32' || keyType === 'fixed32';
    if (/^-?\d+$/.test(key) && !(unsigned && key.startsWith('-'))) return;
    // protobufjs 6 decodes 64-bit map keys of a response into 8-character binary strings
    let hint =
      key.length === 8 && (UNSIGNED_LONGS.has(keyType) || SIGNED_LONGS.has(keyType))
        ? '; this looks like a key decoded from a response, convert it to a decimal string first'
        : '';
    this.fail(at, `expected an integer map key (${keyType})${hint}`);
  }
}

function loadRoot(line) {
  let root = new protobuf.Root();
  root.resolvePath = (origin, target) => {
    if (path.isAbsolute(target)) return target;
    let local = path.join(line.protoDir, target);
    return fs.existsSync(local) ? local : protobuf.util.path.resolve(origin, target);
  };
  root.loadSync(
    Object.keys(line.api).map(file => path.join(line.protoDir, file)),
    { keepCase: true }
  );
  root.resolveAll();
  return root;
}

let cache = new Map();

/**
 * Validators of every method of an LND line, keyed `Service.method` (lowerCamelCase method).
 * `requestStream` tells that requests are written to the returned stream (bidirectional RPC).
 * @param line as returned by getLine() of lib/common.js
 * @returns {Map<String, {validate: Function, requestStream: Boolean}>}
 */
function getValidators(line) {
  if (!cache.has(line.line)) {
    let root = loadRoot(line);
    let validators = new Map();
    for (let proto of Object.values(line.api)) {
      for (let [serviceName, lists] of Object.entries(proto.services)) {
        let service = root.lookupService(`${proto.package}.${serviceName}`);
        for (let methodName of [...lists.streamApi, ...lists.callbackApi]) {
          let method = service.methods[methodName];
          let validator = new Validator(method.resolvedRequestType);
          validators.set(`${serviceName}.${lowerCamelCase(methodName)}`, {
            validate: request => validator.validate(request),
            requestStream: method.requestStream,
          });
        }
      }
    }
    cache.set(line.line, validators);
  }
  return cache.get(line.line);
}

module.exports = {
  ValidationError,
  getValidators,
};
