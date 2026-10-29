const { analyzeSecurity } = require("./src/services/security.service");

// Test 1: No security issues
const result1 = analyzeSecurity([
  {
    name: "app.js",
    content: "const message = 'Hello World';"
  }
]);

console.log("Test 1 - No issues:");
console.log(result1);

// Test 2: Hardcoded secret
const result2 = analyzeSecurity([
  {
    name: "config.js",
    content: 'const api_key = "example-secret-value";'
  }
]);

console.log("\nTest 2 - Hardcoded secret:");
console.log(result2);

// Test 3: Dangerous eval
const result3 = analyzeSecurity([
  {
    name: "app.js",
    content: "eval(userInput);"
  }
]);

console.log("\nTest 3 - eval usage:");
console.log(result3);