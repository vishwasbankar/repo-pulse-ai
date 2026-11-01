

function analyzeMaintainability(repoStats) {
  // Step 1: Validate the input.
  if (
    !repoStats ||
    typeof repoStats !== "object" ||
    Array.isArray(repoStats)
  ) {
    throw new Error("Repository statistics must be an object.");
  }

  const { totalFiles, totalLines } = repoStats;

  if (!Number.isInteger(totalFiles) || totalFiles < 0) {
    throw new Error("totalFiles must be a non-negative integer.");
  }

  if (!Number.isInteger(totalLines) || totalLines < 0) {
    throw new Error("totalLines must be a non-negative integer.");
  }

  // Step 2: Start with a score of 100.
  let score = 100;
  const issues = [];

  // Step 3: Check for an empty repository.
  if (totalFiles === 0) {
    issues.push("Repository contains no files.");
  }

  if (totalLines === 0) {
    issues.push("Repository contains no lines of code.");
  }

  if (issues.length > 0) {
    score = 0;
  } else {
    // Step 4: Calculate average lines per file.
    const averageLinesPerFile = totalLines / totalFiles;

    if (averageLinesPerFile > 500) {
      score -= 10;
      issues.push("High average number of lines per file.");
    }

    if (averageLinesPerFile > 1000) {
      score -= 10;
      issues.push("Very high average number of lines per file.");
    }
  }

  // Step 5: Keep the existing output structure.
  return {
    score: Math.max(0, score),
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
