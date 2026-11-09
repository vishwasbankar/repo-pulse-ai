/**
 * quick-test-documentation-analysis.js
 * Run: node quick-test-documentation-analysis.js <path-to-repo>
 */

const { analyzeDocumentation } = require('./backend/src/services/documentationAnalysis.service');

const target = process.argv[2] || '.';
const result = analyzeDocumentation(target);

console.log('Scanned:', target);
console.log(JSON.stringify(result, null, 2));