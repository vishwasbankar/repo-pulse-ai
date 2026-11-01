
const assert = require("node:assert/strict");

const {
  analyzeMaintainability
} = require("./src/services/maintainability.service");

// Test 1: Normal repository
const normalResult = analyzeMaintainability({
  totalFiles: 100,
  totalLines: 10000
});

assert.equal(normalResult.score, 100);
assert.deepEqual(normalResult.issues, []);
console.log("Test 1 passed: Normal repository");

// Test 2: High average lines per file
const largeResult = analyzeMaintainability({
  totalFiles: 10,
  totalLines: 12000
});

assert.equal(largeResult.score, 80);
assert.equal(largeResult.issues.length, 2);
console.log("Test 2 passed: High average lines per file");

// Test 3: Empty repository
const emptyResult = analyzeMaintainability({
  totalFiles: 0,
  totalLines: 0
});

assert.equal(emptyResult.score, 0);
assert.equal(emptyResult.issues.length, 2);
console.log("Test 3 passed: Empty repository");

// Test 4: Invalid input
assert.throws(
  () => analyzeMaintainability({
    totalFiles: -1,
    totalLines: 100
  }),
  /totalFiles must be a non-negative integer/
);

console.log("Test 4 passed: Invalid input");

console.log("\nAll maintainability tests passed!");
