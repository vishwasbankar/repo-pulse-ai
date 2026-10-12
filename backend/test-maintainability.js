const {
  analyzeMaintainability
} = require("./src/services/maintainability.service");

const repoStats = {
  totalFiles: 100,
  totalLines: 10000
};
const result = analyzeMaintainability(repoStats);

console.log(result);