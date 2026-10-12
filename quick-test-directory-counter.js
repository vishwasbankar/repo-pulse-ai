/**
 * quick-test-directory-counter.js
 * Run: node quick-test-directory-counter.js <path-to-repo>
 */

const { countActiveDirectories } = require('./backend/src/services/directoryCounter.service');

const target = process.argv[2] || '.';
const result = countActiveDirectories(target);

console.log('Scanned:', target);
console.log('totalDirectories:', result.totalDirectories);
console.log('maxDepthReached:', result.maxDepthReached);
console.log('excludedCount:', result.excludedCount);
