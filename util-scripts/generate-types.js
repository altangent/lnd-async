#!/usr/bin/env node
// Generates the TypeScript declarations for every LND line listed in lib/versions.js:
//   lib/types/lnd-<line>.d.ts  message types and the client surface of that line
//   lib/types/index.d.ts       version maps used by lib/lnd-async.d.ts
//
// Message types describe what @grpc/proto-loader produces with the options of lib/lnd-rpc.js
// (keepCase, longs: String or Number, enums: String, defaults, oneofs):
//   Foo                 what a request accepts (every field optional, permissive scalar types)
//   Foo__Output<L>      what a response contains, L being the type of 64-bit integers
// The service surface follows lib/lnd-async.js and lib/all-api.js: lowerCamelCase methods,
// a Promise for unary RPCs, a grpc-js stream for streaming ones.
//
// Usage: node util-scripts/generate-types.js
//
// protobufjs 7 is used here only to read the protos with their comments: the comment mode of
// protobufjs 6 fails on LND protos. The runtime keeps using protobufjs 6 via proto-loader.

const fs = require('fs');
const path = require('path');
const protobuf = require('protobufjs-7');
const { defaultVersion, versions } = require('../lib/versions');

const LIB = path.join(__dirname, '..', 'lib');
const LEGACY_SERVICES = ['Lightning', 'State', 'WalletUnlocker'];
const NUMBER_TYPES = new Set([
  'double',
  'float',
  'int32',
  'uint32',
  'sint32',
  'fixed32',
  'sfixed32',
]);
const LONG_TYPES = new Set(['int64', 'uint64', 'sint64', 'fixed64', 'sfixed64']);
const LONG_MAP_KEY_NOTE = [
  'Note: the keys of this map are 64-bit integers that protobufjs decodes into 8-character',
  'binary strings (the bytes of the number, least significant first), not decimal strings.',
  'See "64-bit map keys" in the README of lnd-async.',
];
// Names TypeScript does not accept as an interface or type alias name
const RESERVED = new Set([
  'any',
  'bigint',
  'boolean',
  'never',
  'null',
  'number',
  'object',
  'string',
  'symbol',
  'undefined',
  'unknown',
  'void',
]);

function lowerCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}

function loadLine(line) {
  const info = versions[line];
  if (!info) throw new Error(`Unknown LND line ${line}`);
  const protoDir = path.join(LIB, info.protoDir);
  const api = require(path.join(LIB, info.api));
  const root = new protobuf.Root();
  root.resolvePath = (origin, target) => {
    if (path.isAbsolute(target)) return target;
    const local = path.join(protoDir, target);
    return fs.existsSync(local) ? local : protobuf.util.path.resolve(origin, target);
  };
  root.loadSync(
    Object.keys(api)
      .sort()
      .map(file => path.join(protoDir, file)),
    { keepCase: true, alternateCommentMode: true }
  );
  root.resolveAll();
  return { info, api, root };
}

/**
 * How a field looks in a decoded response. `optional` fields are absent unless set: members of
 * a oneof, including the synthetic oneofs of proto3 `optional` fields. All other fields are
 * filled in by `defaults: true` (null for a message, [] and {} for repeated and map fields).
 * The kinds are shared with the tests that check them against the runtime.
 */
function fieldShape(field) {
  const element = scalarKind(field);
  let kind = element;
  if (field.map) kind = 'map';
  else if (field.repeated) kind = 'repeated';
  return { optional: Boolean(field.partOf), kind, element };
}

function scalarKind(field) {
  if (field.resolvedType instanceof protobuf.Enum) return 'enum';
  if (field.resolvedType instanceof protobuf.Type) return 'message';
  if (NUMBER_TYPES.has(field.type)) return 'number';
  if (LONG_TYPES.has(field.type)) return 'long';
  if (field.type === 'bool') return 'bool';
  if (field.type === 'string') return 'string';
  if (field.type === 'bytes') return 'bytes';
  throw new Error(`Unsupported type ${field.type} of ${field.fullName}`);
}

function tsName(reflectionObject) {
  return reflectionObject.fullName.slice(1);
}

function elementType(field, kind, output) {
  switch (kind) {
    case 'number':
      return 'number';
    case 'long':
      return output ? 'L' : '$LongIn';
    case 'bool':
      return 'boolean';
    case 'string':
      return 'string';
    case 'bytes':
      return output ? '$BytesOut' : '$BytesIn';
    case 'enum':
      return tsName(field.resolvedType) + (output ? '__Output' : '');
    case 'message':
      return tsName(field.resolvedType) + (output ? '__Output<L>' : '');
  }
  throw new Error(`Unexpected kind ${kind}`);
}

function fieldType(field, output) {
  const shape = fieldShape(field);
  const element = elementType(field, shape.element, output);
  if (shape.kind === 'map') return `{ [key: string]: ${element} }`;
  if (shape.kind === 'repeated') return `(${element})[]`;
  // A message field is null in a response when it is not set (unless it belongs to a oneof)
  if (shape.kind === 'message' && !(output && shape.optional)) return `${element} | null`;
  return element;
}

function jsdoc(indent, comment, { deprecated = false, extra = [] } = {}) {
  const lines = comment ? comment.replace(/\*\//g, '*\\/').split('\n') : [];
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  if (extra.length) {
    if (lines.length) lines.push('');
    lines.push(...extra);
  }
  if (deprecated) lines.push('@deprecated');
  if (!lines.length) return [];
  return [
    `${indent}/**`,
    ...lines.map(l => `${indent} *${l.trim() ? ' ' + l.trimEnd() : ''}`),
    `${indent} */`,
  ];
}

function isDeprecated(reflectionObject) {
  return Boolean(reflectionObject.options && reflectionObject.options.deprecated);
}

function checkName(obj) {
  if (RESERVED.has(obj.name))
    throw new Error(`${obj.fullName}: "${obj.name}" cannot be a type name`);
}

function byName(a, b) {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

function renderEnum(e, indent) {
  checkName(e);
  const names = Object.keys(e.values);
  const numbers = [...new Set(Object.values(e.values))];
  const extra = names
    .filter(
      n =>
        (e.comments && e.comments[n]) ||
        (e.valuesOptions && e.valuesOptions[n] && e.valuesOptions[n].deprecated)
    )
    .map(n => {
      const comment = ((e.comments && e.comments[n]) || '').replace(/\s*\n\s*/g, ' ').trim();
      const deprecated = e.valuesOptions && e.valuesOptions[n] && e.valuesOptions[n].deprecated;
      return `- \`${n}\`${comment ? ': ' + comment : ''}${deprecated ? ' (deprecated)' : ''}`;
    });
  const doc = jsdoc(indent, e.comment, { deprecated: isDeprecated(e), extra });
  const quoted = names.map(n => `'${n}'`);
  return [
    ...doc,
    `${indent}export type ${e.name} = ${quoted.concat(numbers.map(String)).join(' | ')};`,
    ...doc,
    `${indent}export type ${e.name}__Output = ${quoted.join(' | ')};`,
  ];
}

function renderMessage(type, indent) {
  checkName(type);
  const doc = jsdoc(indent, type.comment, { deprecated: isDeprecated(type) });
  const fieldLines = output => {
    const lines = [];
    for (const field of type.fieldsArray) {
      const optional = !output || fieldShape(field).optional;
      // protobufjs 6 decodes 64-bit map keys into binary strings, not decimal ones
      const extra = output && field.map && LONG_TYPES.has(field.keyType) ? LONG_MAP_KEY_NOTE : [];
      lines.push(
        ...jsdoc(indent + '  ', field.comment, { deprecated: isDeprecated(field), extra })
      );
      lines.push(`${indent}  '${field.name}'${optional ? '?' : ''}: ${fieldType(field, output)};`);
    }
    // With `oneofs: true` the decoded message names the member that is set
    for (const oneof of type.oneofsArray) {
      const members = oneof.fieldsArray.map(f => `'${f.name}'`).join(' | ');
      lines.push(`${indent}  '${oneof.name}'?: ${members};`);
    }
    return lines;
  };
  const lines = [
    ...doc,
    `${indent}export interface ${type.name} {`,
    ...fieldLines(false),
    `${indent}}`,
    ...doc,
    `${indent}export interface ${type.name}__Output<L extends $LongOut = string> {`,
    ...fieldLines(true),
    `${indent}}`,
  ];
  const nested = renderNested(type, indent + '  ');
  if (nested.length)
    lines.push(`${indent}export namespace ${type.name} {`, ...nested, `${indent}}`);
  return lines;
}

function renderNested(ns, indent) {
  const lines = [];
  for (const obj of (ns.nestedArray || []).slice().sort(byName)) {
    if (obj instanceof protobuf.Type) lines.push(...renderMessage(obj, indent));
    else if (obj instanceof protobuf.Enum) lines.push(...renderEnum(obj, indent));
    else if (obj instanceof protobuf.Service) continue;
    else if (obj instanceof protobuf.Namespace) {
      const inner = renderNested(obj, indent + '  ');
      if (inner.length)
        lines.push(`${indent}export namespace ${obj.name} {`, ...inner, `${indent}}`);
    }
  }
  return lines;
}

function rpcSignature(method, isStreamApi) {
  const req = tsName(method.resolvedRequestType);
  const res = `${tsName(method.resolvedResponseType)}__Output<L>`;
  const where = `${tsName(method.parent)}.${method.name}`;
  if (!isStreamApi) {
    if (method.requestStream || method.responseStream) {
      throw new Error(`${where} streams, but all-api.js lists it as a unary call`);
    }
    return `$Unary<${req}, ${res}>`;
  }
  if (method.requestStream && method.responseStream) return `$Bidi<${req}, ${res}>`;
  if (method.responseStream) return `$ServerStream<${req}, ${res}>`;
  // lib/lnd-async.js would promisify such a method, which does not work for client streaming
  throw new Error(`${where}: client-streaming RPCs are not supported by lnd-async`);
}

function renderServices(api, root) {
  const services = [];
  for (const entry of Object.values(api)) {
    for (const [name, lists] of Object.entries(entry.services)) {
      services.push({ name, pkg: entry.package, lists });
    }
  }
  services.sort(byName);

  const lines = [
    '/** The services of this LND line as exposed by connect(): `client.<Service>.<method>`. */',
    'export interface Services<L extends $LongOut = string> {',
  ];
  for (const { name, pkg, lists } of services) {
    const service = root.lookupService(`${pkg}.${name}`);
    const streams = new Set(lists.streamApi);
    const listed = new Set([...lists.streamApi, ...lists.callbackApi]);
    const methods = service.methodsArray.filter(m => listed.has(m.name));
    // all-api.js is what the runtime exposes; a mismatch means its regex parser missed something
    const missing = service.methodsArray.filter(m => !listed.has(m.name)).map(m => m.name);
    const unknown = [...listed].filter(m => !service.methods[m]);
    if (missing.length || unknown.length) {
      throw new Error(`${pkg}.${name}: all-api.js lacks [${missing}] and has unknown [${unknown}]`);
    }
    lines.push(...jsdoc('  ', service.comment, { deprecated: isDeprecated(service) }));
    lines.push(`  ${name}: {`);
    for (const method of methods.slice().sort(byName)) {
      lines.push(...jsdoc('    ', method.comment, { deprecated: isDeprecated(method) }));
      lines.push(
        `    ${lowerCamelCase(method.name)}: ${rpcSignature(method, streams.has(method.name))};`
      );
    }
    lines.push('  };');
  }
  lines.push('}', '');

  const legacy = LEGACY_SERVICES.filter(s => services.some(x => x.name === s));
  lines.push(
    '/** Methods available directly on the client (`client.getInfo()`): the ' +
      legacy.map(s => '`' + s + '`').join(', ') +
      ' services. */',
    'export type LegacyMethods<L extends $LongOut = string> =',
    '  ' + legacy.map(s => `Services<L>['${s}']`).join(' & ') + ';'
  );
  return lines;
}

function renderLine(line) {
  const { info, api, root } = loadLine(line);
  const packages = root.nestedArray.filter(o => o instanceof protobuf.Namespace).sort(byName);
  // References are written as `lnrpc.Foo`; a nested type named like a package would shadow it
  const packageNames = new Set(packages.map(p => p.name));
  (function visit(ns) {
    for (const obj of ns.nestedArray || []) {
      if (ns !== root && packageNames.has(obj.name)) {
        throw new Error(`${obj.fullName} shadows the package name ${obj.name}`);
      }
      visit(obj);
    }
  })(root);
  const lines = [
    `// Generated by util-scripts/generate-types.js from the protos of LND ${info.lndTag}`,
    `// (lib/${info.protoDir}). Do not edit.`,
    'import type {',
    '  Bidi as $Bidi,',
    '  BytesIn as $BytesIn,',
    '  BytesOut as $BytesOut,',
    '  LongIn as $LongIn,',
    '  LongOut as $LongOut,',
    '  ServerStream as $ServerStream,',
    '  Unary as $Unary,',
    "} from './common';",
    '',
    `/** LND release whose protos these types were generated from. */`,
    `export type LndTag = '${info.lndTag}';`,
    '',
  ];
  for (const pkg of packages) {
    lines.push(`export namespace ${pkg.name} {`, ...renderNested(pkg, '  '), '}', '');
  }
  lines.push(...renderServices(api, root), '');
  return { text: lines.join('\n'), packages: packages.map(p => p.name) };
}

function renderIndex(packagesOfDefault) {
  const lines = Object.keys(versions).sort();
  const alias = line => 'Lnd' + line.replace(/\./g, '_');
  const out = [
    '// Generated by util-scripts/generate-types.js from lib/versions.js. Do not edit.',
    "import type { LongOut } from './common';",
    ...lines.map(l => `import type * as ${alias(l)}Types from './lnd-${l}';`),
    '',
    '/** LND release lines with bundled protos; pass one as `lndVersion` to connect(). */',
    `export type LndVersion = ${lines.map(l => `'${l}'`).join(' | ')};`,
    '',
    '/** The line used when connect() gets no `lndVersion`. */',
    `export type DefaultLndVersion = '${defaultVersion}';`,
    '',
    'export interface ServicesByVersion<L extends LongOut = string> {',
    ...lines.map(l => `  '${l}': ${alias(l)}Types.Services<L>;`),
    '}',
    '',
    'export interface LegacyMethodsByVersion<L extends LongOut = string> {',
    ...lines.map(l => `  '${l}': ${alias(l)}Types.LegacyMethods<L>;`),
    '}',
    '',
    '// Message types of every line: Lnd0_21.lnrpc.GetInfoResponse__Output',
    ...lines.map(l => `export * as ${alias(l)} from './lnd-${l}';`),
    '',
    `// Message types of the default line (${defaultVersion}): lnrpc.GetInfoResponse__Output`,
    `export { ${packagesOfDefault.join(', ')} } from './lnd-${defaultVersion}';`,
    '',
  ];
  return out.join('\n');
}

/** Every generated file: absolute path -> contents. */
function renderAll() {
  const files = new Map();
  let defaultPackages;
  for (const line of Object.keys(versions).sort()) {
    const { text, packages } = renderLine(line);
    if (line === defaultVersion) defaultPackages = packages;
    files.set(path.join(LIB, versions[line].types), text);
  }
  files.set(path.join(LIB, 'types', 'index.d.ts'), renderIndex(defaultPackages));
  return files;
}

function main() {
  for (const [file, text] of renderAll()) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
    console.log(`${path.relative(process.cwd(), file)}: ${Math.ceil(text.length / 1024)} KiB`);
  }
}

module.exports = { loadLine, fieldShape, renderAll };

if (require.main === module) main();
