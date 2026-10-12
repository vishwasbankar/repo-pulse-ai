
const fs = require("fs");
const path = require("path");

const IGNORED_FOLDERS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
]);

function scanRepository(repoPath) {
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

  const files = [];
  const folders = [];
  const extensions = new Set();

  function scanDirectory(currentPath, relativePath = "") {
    const entries = fs.readdirSync(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const entryRelativePath = path.join(
        relativePath,
        entry.name
      );

      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (IGNORED_FOLDERS.has(entry.name)) {
          continue;
        }

        folders.push(entryRelativePath);

        scanDirectory(fullPath, entryRelativePath);
      } else if (entry.isFile()) {
        files.push(entryRelativePath);

        const extension = path.extname(entry.name).toLowerCase();

        if (extension) {
          extensions.add(extension);
        }
      }
    }
  }

  scanDirectory(rootPath);

  return {
    rootPath,
    files,
    folders,
    extensions: [...extensions].sort(),
    structure: {
      files,
      folders,
    },
  };
}

module.exports = {
  scanRepository,
};
