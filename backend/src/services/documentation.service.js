function analyzeDocumentation(repoInfo) {
  const issues = [];
  let score = 0;

  if (repoInfo.hasReadme) {
    score += 50;

    if (repoInfo.readmeLines >= 100) {
      score += 30;
    } else {
      issues.push("README documentation is short.");
    }
  } else {
    issues.push("README file is missing.");
  }

  let summary;

  if (repoInfo.hasReadme) {
    summary = "Repository contains basic documentation.";
  } else {
    summary = "Repository lacks basic documentation.";
  }

  return {
    score: score,
    issues: issues,
    summary: summary
  };
}

module.exports = {
  analyzeDocumentation
};