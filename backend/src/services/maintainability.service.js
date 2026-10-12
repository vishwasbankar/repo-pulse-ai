function analyzeMaintainability(repoStats) {
  const { totalFiles, totalLines } = repoStats;

  let score = 80;
  const issues = [];

  if (totalFiles <= 0) {
    issues.push("Repository contains no files.");
    score = 0;
  }

  if (totalLines <= 0) {
    issues.push("Repository contains no lines of code.");
    score = 0;
  }

  return {
    score,
    issues,
    summary:
      issues.length === 0
        ? "Repository has a reasonable maintainability baseline."
        : "Repository needs maintainability review."
  };
}

module.exports = {
  analyzeMaintainability
};