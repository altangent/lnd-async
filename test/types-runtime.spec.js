// Checks the shipped TypeScript declarations (the text of lib/types/lnd-<line>.d.ts) against
// what the runtime really decodes: protobufjs 6 through @grpc/proto-loader, with the options of
// lib/lnd-rpc.js. The expected values come from the runtime, never from the generator.
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const protobuf = require('protobufjs');
const { loadSync } = require('@grpc/proto-loader');
const { renderAll } = require('../util-scripts/generate-types');
const { getLine, supportedVersions } = require('../lib/common');
const versions = require('../lib/versions').versions;

const LOADER_OPTIONS = { keepCase: true, enums: String, defaults: true, oneofs: true };

function runtimeRoot(line) {
  let root = new protobuf.Root();
  root.resolvePath = (origin, target) =>
    path.isAbsolute(target) ? target : path.join(line.protoDir, target);
  root.loadSync(
    Object.keys(line.api).map(file => path.join(line.protoDir, file)),
    { keepCase: true }
  );
  root.resolveAll();
  return root;
}

function messageTypes(ns, out = []) {
  for (let obj of ns.nestedArray || []) {
    if (obj instanceof protobuf.Type) out.push(obj);
    messageTypes(obj, out);
  }
  return out;
}

/**
 * The interfaces of a generated declaration file:
 * 'lnrpc.Invoice__Output' -> Map(property -> { optional, type }).
 */
function declaredInterfaces(file) {
  let interfaces = new Map();
  let namespaces = [];
  let current = null;
  for (let line of fs.readFileSync(file, 'utf8').split('\n')) {
    let m;
    if ((m = /^(\s*)export namespace (\w+) \{$/.exec(line))) {
      namespaces.push({ name: m[2], indent: m[1] });
    } else if ((m = /^(\s*)export interface (\w+)(?:<[^>]*>)? \{$/.exec(line))) {
      current = { indent: m[1], properties: new Map() };
      interfaces.set([...namespaces.map(n => n.name), m[2]].join('.'), current.properties);
    } else if (current && (m = /^\s*'(\w+)'(\?)?: (.*);$/.exec(line))) {
      current.properties.set(m[1], { optional: Boolean(m[2]), type: m[3] });
    } else if ((m = /^(\s*)\}$/.exec(line))) {
      if (current && m[1] === current.indent) current = null;
      else if (namespaces.length && m[1] === namespaces[namespaces.length - 1].indent)
        namespaces.pop();
    }
  }
  return interfaces;
}

/** The kind of a response property, read from its declared type. */
function declaredKind(type) {
  if (type.startsWith('{ [key: string]: ')) return 'map';
  if (type.endsWith(')[]')) return 'repeated';
  if (type.endsWith('__Output<L> | null')) return 'message';
  if (type.endsWith('__Output')) return 'enum';
  let scalars = {
    L: 'long',
    number: 'number',
    boolean: 'bool',
    string: 'string',
    $BytesOut: 'bytes',
  };
  return scalars[type] || `unknown type ${type}`;
}

/** Asserts the value `defaults: true` gives an unset field of the declared kind. */
function expectDefault(kind, value, longs, field, where) {
  switch (kind) {
    case 'map':
      return expect(value, where).to.deep.equal({});
    case 'repeated':
      return expect(value, where).to.deep.equal([]);
    case 'message':
      return expect(value, where).to.equal(null);
    case 'number':
      return expect(value, where).to.equal(0);
    case 'long':
      return expect(value, where).to.equal(longs === String ? '0' : 0);
    case 'bool':
      return expect(value, where).to.equal(false);
    case 'string':
      return expect(value, where).to.equal('');
    case 'bytes':
      return expect(Buffer.isBuffer(value) && value.length === 0, where).to.equal(true);
    case 'enum':
      return expect(Object.keys(field.resolvedType.values), where).to.include(value);
  }
  throw new Error(`${where}: ${kind}`);
}

describe('generated TypeScript declarations', function() {
  this.timeout(60000);

  it('are up to date with the protos (run npm run generate-types)', () => {
    for (let [file, text] of renderAll()) {
      let current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
      expect(current === text, path.relative(process.cwd(), file)).to.equal(true);
    }
  });

  for (let lndVersion of supportedVersions) {
    it(`declare what is decoded for every message of LND ${lndVersion}`, () => {
      let runtime = runtimeRoot(getLine(lndVersion));
      let declared = declaredInterfaces(
        path.join(__dirname, '..', 'lib', versions[lndVersion].types)
      );
      let types = messageTypes(runtime);
      expect(types.length).to.be.greaterThan(300);
      for (let type of types) {
        let name = type.fullName.slice(1);
        let input = declared.get(name);
        let output = declared.get(`${name}__Output`);
        expect(input, name).to.be.instanceOf(Map);
        expect(output, `${name}__Output`).to.be.instanceOf(Map);

        // Every field and every oneof property, nothing else; all optional in requests
        let properties = [
          ...type.fieldsArray.map(f => f.name),
          ...type.oneofsArray.map(o => o.name),
        ];
        expect([...input.keys()].sort(), name).to.deep.equal(properties.slice().sort());
        expect([...output.keys()].sort(), `${name}__Output`).to.deep.equal(
          properties.slice().sort()
        );
        for (let [property, { optional }] of input)
          expect(optional, `${name}.${property}`).to.equal(true);
        for (let oneof of type.oneofsArray) {
          expect(output.get(oneof.name).optional, `${name}__Output.${oneof.name}`).to.equal(true);
        }

        for (let longs of [String, Number]) {
          let decoded = type.toObject(type.decode(Buffer.alloc(0)), { ...LOADER_OPTIONS, longs });
          let required = type.fieldsArray
            .filter(f => !output.get(f.name).optional)
            .map(f => f.name);
          expect(Object.keys(decoded).sort(), `${name}__Output required fields`).to.deep.equal(
            required.sort()
          );
          for (let field of type.fieldsArray) {
            if (output.get(field.name).optional) continue;
            let where = `${name}__Output.${field.name}: ${output.get(field.name).type}`;
            expectDefault(
              declaredKind(output.get(field.name).type),
              decoded[field.name],
              longs,
              field,
              where
            );
          }
        }
      }
    });
  }

  it('declare what proto-loader returns for every RPC response of the default line', () => {
    let line = getLine('0.20');
    let declared = declaredInterfaces(path.join(__dirname, '..', 'lib', versions['0.20'].types));
    let runtime = runtimeRoot(line);
    let checked = 0;
    for (let [file, proto] of Object.entries(line.api)) {
      let definition = loadSync(path.join(line.protoDir, file), {
        ...LOADER_OPTIONS,
        longs: String,
        includeDirs: [line.protoDir],
      });
      for (let serviceName of Object.keys(proto.services)) {
        let service = runtime.lookupService(`${proto.package}.${serviceName}`);
        for (let method of service.methodsArray) {
          let decoded = definition[`${proto.package}.${serviceName}`][
            method.name
          ].responseDeserialize(Buffer.alloc(0));
          let response = method.resolvedResponseType;
          let output = declared.get(`${response.fullName.slice(1)}__Output`);
          let required = response.fieldsArray
            .filter(f => !output.get(f.name).optional)
            .map(f => f.name);
          expect(Object.keys(decoded).sort(), method.fullName).to.deep.equal(required.sort());
          checked++;
        }
      }
    }
    expect(checked).to.equal(173);
  });

  it('name the member that is set in a oneof', () => {
    let runtime = runtimeRoot(getLine('0.20'));
    let type = runtime.lookupType('lnrpc.OpenStatusUpdate');
    let message = type
      .encode(type.fromObject({ chan_pending: { txid: Buffer.alloc(32, 1), output_index: 1 } }))
      .finish();
    let decoded = type.toObject(type.decode(message), { ...LOADER_OPTIONS, longs: String });
    expect(decoded.update).to.equal('chan_pending');
    expect(decoded.chan_pending.output_index).to.equal(1);
    expect(decoded).to.not.have.property('chan_open');
    expect(decoded).to.not.have.property('psbt_fund');
  });

  it('leave an unset proto3 optional field absent and name a set one', () => {
    let runtime = runtimeRoot(getLine('0.20'));
    let type = runtime.lookupType('invoicesrpc.HtlcModifyResponse');
    let empty = type.toObject(type.decode(Buffer.alloc(0)), { ...LOADER_OPTIONS, longs: String });
    expect(empty).to.not.have.property('amt_paid');
    let set = type.toObject(type.decode(type.encode(type.fromObject({ amt_paid: 5 })).finish()), {
      ...LOADER_OPTIONS,
      longs: String,
    });
    expect(set.amt_paid).to.equal('5');
    expect(set._amt_paid).to.equal('amt_paid');
  });

  it('decode 64-bit map keys into 8-character binary strings, as the README says', () => {
    let runtime = runtimeRoot(getLine('0.20'));
    let hop = runtime.lookupType('lnrpc.Hop');
    let message = hop
      .encode(hop.fromObject({ custom_records: { 5482373484: Buffer.from('x') } }))
      .finish();
    let decoded = hop.toObject(hop.decode(message), { ...LOADER_OPTIONS, longs: String });
    let [key] = Object.keys(decoded.custom_records);
    expect(key).to.equal('laÆF\u0001\u0000\u0000\u0000');
    // The conversion given in the README
    let decimal = [...key]
      .reduceRight((n, c) => (n << 8n) | BigInt(c.charCodeAt(0)), 0n)
      .toString();
    expect(decimal).to.equal('5482373484');
  });
});
