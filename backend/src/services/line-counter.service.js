
const fs = require("fs");
const path = require("path");

const IGNORED_FOLDERS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
]);

const SOURCE_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".c",
  ".cpp",
  ".h",
  ".hpp",
  ".cs",
  ".go",
  ".rs",
  ".php",
  ".rb",
  ".html",
  ".css",
  ".scss",
  ".json",
  ".sql",
]);

function isMinifiedFile(filePath) {
  return /\.(min|bundle)\.[^.]+$/i.test(path.basename(filePath));
}

function countFileLines(filePath) {
  try {
    if (isMinifiedFile(filePath)) {
      return 0;
    }

    const content = fs.readFileSync(filePath);

    // Skip files containing null bytes, which commonly indicate binary data.
    if (content.includes(0)) {
      return 0;
    }

    const text = content.toString("utf8");

    // Skip files that are not valid UTF-8 text.
    if (text.includes("\uFFFD")) {
      return 0;
    }

    if (text.length === 0) {
      return 0;
    }

    // Count lines without adding an extra line for a final newline.
    const lines = text.split(/\r\n|\n|\r/);

    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    return lines.length;
  } catch (error) {
    // Unreadable files are skipped safely.
    return 0;
  }
}

function countRepositoryLines(repoPath) {
  if (!repoPath || typeof repoPath !== "string") {
    throw new Error("A valid repository path is required.");
  }

  const rootPath = path.resolve(repoPath);

  if (!fs.existsSync(rootPath)) {
    throw new Error("Repository path does not exist.");
  }

  if (!fs.statSync(rootPath).isDirectory()) {
    throw new Error("Repository path must be a directory.");
  }

  let totalLines = 0;

  function scanDirectory(currentPath) {
    let entries;

    try {
      entries = fs.readdirSync(currentPath, {
        withFileTypes: true,
      });
    } catch (error) {
      // Skip directories that cannot be read.
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (IGNORED_FOLDERS.has(entry.name)) {
          continue;
        }

        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        const extension = path.extname(entry.name).toLowerCase();

        if (!SOURCE_EXTENSIONS.has(extension)) {
          continue;
        }

        totalLines += countFileLines(fullPath);
      }
    }
  }

  scanDirectory(rootPath);

  return {
    totalLines,
  };
}

module.exports = {
  countRepositoryLines,
  countFileLines,
};
