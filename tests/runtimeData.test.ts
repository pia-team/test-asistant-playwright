import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import { runtimeData, FAKER_KINDS } from '../support/runtimeData';
import { uniqueFromPattern } from '../support/uniqueValue';

const RUNNERS_ROOT = path.resolve(__dirname, '..', '..');
const COPIES = [
  'test-assistant-mobile/support/runtimeData.ts',
  'playwright-cucumber-api-test/src/utils/runtimeData.ts',
];

describe('runtimeData', () => {
  it('uuid returns a fresh RFC 4122 v4 value per call', () => {
    const first = runtimeData.uuid();
    assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.notEqual(runtimeData.uuid(), first);
  });

  it('timestamp is generated at call time in the requested format', () => {
    const before = Date.now();
    const millis = Number(runtimeData.timestamp());
    assert.ok(millis >= before && millis <= Date.now());
    assert.match(runtimeData.timestamp({ format: 'epochSeconds' }), /^\d{10}$/);
    assert.match(runtimeData.timestamp({ format: 'iso' }), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    assert.match(runtimeData.timestamp({ format: 'isoDate' }), /^\d{4}-\d{2}-\d{2}$/);
    assert.match(runtimeData.timestamp({ pattern: 'yyyyMMdd-HHmmss' }), /^\d{8}-\d{6}$/);
    assert.throws(() => runtimeData.timestamp({ pattern: 'yyyy QQ' }), /token "QQ"/);
  });

  it('numeric honours length and inclusive ranges', () => {
    assert.match(runtimeData.numeric({ length: 6 }), /^\d{6}$/);
    for (let i = 0; i < 200; i += 1) {
      const value = Number(runtimeData.numeric({ min: 5, max: 7 }));
      assert.ok(value >= 5 && value <= 7);
    }
    assert.equal(runtimeData.numeric({ max: 0 }), '0');
    assert.throws(() => runtimeData.numeric({ min: 3, max: 1 }), /min <= max/);
    assert.throws(() => runtimeData.numeric({ length: 0 }), /integer length/);
  });

  it('alphanumeric honours length and charset', () => {
    assert.match(runtimeData.alphanumeric({ length: 12 }), /^[A-Za-z0-9]{12}$/);
    assert.match(runtimeData.alphanumeric({ length: 12, charset: 'alpha' }), /^[A-Za-z]{12}$/);
  });

  it('pattern("TEST######") keeps the literal and adds six digits', () => {
    const values = new Set<string>();
    for (let i = 0; i < 20; i += 1) {
      const value = runtimeData.pattern('TEST######');
      assert.match(value, /^TEST\d{6}$/);
      values.add(value);
    }
    assert.ok(values.size > 1);
  });

  it('pattern("USR-???-####") produces three letters and four digits', () => {
    assert.match(runtimeData.pattern('USR-???-####'), /^USR-[A-Z]{3}-\d{4}$/);
    assert.match(runtimeData.pattern('usr-???', { letterCase: 'lower' }), /^usr-[a-z]{3}$/);
    assert.throws(() => runtimeData.pattern(''), /non-empty pattern/);
  });

  it('faker produces only the allowlisted semantic values', () => {
    assert.deepEqual([...FAKER_KINDS], ['firstName', 'lastName', 'fullName', 'email', 'username', 'phoneNumber']);
    assert.match(runtimeData.faker('firstName'), /^[A-Z][a-z]+$/);
    assert.match(runtimeData.faker('lastName'), /^[A-Z][a-z]+$/);
    assert.match(runtimeData.faker('fullName'), /^[A-Z][a-z]+ [A-Z][a-z]+$/);
    assert.match(runtimeData.faker('email'), /^[a-z]+\.[a-z]+\.[a-z0-9]{6}@example\.com$/);
    assert.match(runtimeData.faker('username'), /^[a-z]+\d{4}$/);
    assert.match(runtimeData.faker('phoneNumber'), /^555\d{7}$/);
    assert.throws(() => runtimeData.faker('address' as never), /does not support "address"/);
  });

  it('uniqueFromPattern keeps its legacy contract on top of runtimeData.pattern', () => {
    const before = Date.now();
    const value = uniqueFromPattern('TEST######');
    const after = Date.now();
    assert.match(value, /^TEST\d{6}$/);
    // Legacy behaviour: `#` takes the clock digits, last digit first.
    const reversed = value.slice(4).split('').reverse().join('');
    let fromClock = false;
    for (let ms = before; ms <= after && !fromClock; ms += 1) {
      fromClock = String(ms).endsWith(reversed);
    }
    assert.ok(fromClock);
    assert.match(uniqueFromPattern('ACC-??-##'), /^ACC-[A-Z]{2}-\d{2}$/);
    assert.throws(() => uniqueFromPattern(''), /uniqueFromPattern requires a non-empty pattern/);
  });

  it('every runner ships the identical runtimeData implementation', () => {
    const canonical = fs.readFileSync(path.join(__dirname, '..', 'support', 'runtimeData.ts'), 'utf8');
    for (const copy of COPIES) {
      assert.equal(fs.readFileSync(path.join(RUNNERS_ROOT, copy), 'utf8'), canonical, `${copy} differs`);
    }
    assert.equal(
      fs.readFileSync(path.join(RUNNERS_ROOT, 'test-assistant-mobile/support/uniqueValue.ts'), 'utf8'),
      fs.readFileSync(path.join(__dirname, '..', 'support', 'uniqueValue.ts'), 'utf8'),
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const api = require(path.join(RUNNERS_ROOT, COPIES[1])) as { runtimeData: typeof runtimeData };
    assert.deepEqual(Object.keys(api.runtimeData), Object.keys(runtimeData));
    assert.match(api.runtimeData.pattern('TEST######'), /^TEST\d{6}$/);
  });
});
