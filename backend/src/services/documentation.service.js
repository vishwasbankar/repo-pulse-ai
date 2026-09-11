
function analyzeDocumentation(repoInfo) {
  const issues = [];
  let score = 0;

  if (repoInfo.hasReadme) {
    score += 50;
  } else {
    issues.push("README file is missing.");
  }

  if (repoInfo.readmeLines >= 100) {
    score += 30;
  } else {
    issues.push("README documentation is short.");
  }

  return {
    score: score,
    issues: issues,
    summary: "Repository documentation analysis completed."
  };
}

module.exports = {
  analyzeDocumentation
};