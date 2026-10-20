const { scanRepository } = require('./scanner.service');

function countFiles(repoPath) {
  const result = scanRepository(repoPath);
  return {
    totalFiles: result.files.length,
  };
}

module.exports = {
  countFiles,
};