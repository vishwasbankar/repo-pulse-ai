const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildScanContext } = require('./src/services/scanSupport.service');

function test(name, fn) {
  try {
    fn();
    console.log('PASS:', name);
  } catch (e) {
    console.log('FAIL:', name, '-', e.message);
  }
}

function check(condition, message) {
  if (!condition) throw new Error(message);
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-test-'));
fs.mkdirSync(path.join(dir, 'src'));
fs.mkdirSync(path.join(dir, 'node_modules'));
fs.writeFileSync(path.join(dir, 'src', 'app.js'), 'console.log(1);');
fs.writeFileSync(path.join(dir, 'README.md'), '# Hello');
fs.writeFileSync(path.join(dir, 'logo.png'), 'fake image');
fs.writeFileSync(path.join(dir, 'big.txt'), 'a'.repeat(1024 * 1024 + 10));
fs.writeFileSync(path.join(dir, 'node_modules', 'ignored.js'), 'x');

const ctx = buildScanContext(dir);
const find = (list, name) => list.find((f) => f.path.endsWith(name));

test('counts only valid files', () =>
  check(ctx.totals.totalFiles === 4, 'expected 4, got ' + ctx.totals.totalFiles));

test('ignores node_modules', () =>
  check(!ctx.files.some((f) => f.path.includes('node_modules')), 'node_modules leaked'));

test('marks image as binary', () =>
  check(find(ctx.skipped, 'logo.png')?.reason === 'binary', 'png not marked binary'));

test('marks big file as too_large', () =>
  check(find(ctx.skipped, 'big.txt')?.reason === 'too_large', 'big file not flagged'));

test('normal file is readable with size', () => {
  const f = find(ctx.files, 'app.js');
  check(f.isReadable && f.sizeBytes > 0, 'app.js should be readable');
});

test('missing path throws', () => {
  let threw = false;
  try { buildScanContext(path.join(dir, 'nope')); } catch (e) { threw = true; }
  check(threw, 'should have thrown');
});

test('empty path throws', () => {
  let threw = false;
  try { buildScanContext(''); } catch (e) { threw = true; }
  check(threw, 'should have thrown');
});

fs.rmSync(dir, { recursive: true, force: true });