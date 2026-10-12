/**
 * backend/src/services/directoryCounter.service.js
 *
 * Member 2 — Directory Counting Module.
 *
 * Walks a repository's file tree and counts "active" directories:
 * real, readable folders that are
 *   - not in the shared exclusion list (scan.config.js),
 *   - not a path-traversal / symlink escape outside the repo root,
 *   - not part of a symlink cycle,
 *   - within the safety depth limit.
 *
 * Output: { totalDirectories, maxDepthReached, excludedCount }
 * totalDirectories is the integer the spec asks for.
 */

const fs = require('fs');
const path = require('path');
const { EXCLUDED_FOLDERS, MAX_SCAN_DEPTH } = require('../config/scan.config');

/**
 * @param {string} rootPath - path to the repository root to scan
 * @returns {{ totalDirectories: number, maxDepthReached: number, excludedCount: number }}
 */
function countActiveDirectories(rootPath) {
  const resolvedRoot = fs.realpathSync(rootPath);

  let totalDirectories = 0;
  let excludedCount = 0;
  let maxDepthReached = 0;
  const visitedRealPaths = new Set(); // guards against symlink cycles

  function walk(currentPath, depth) {
    if (depth > MAX_SCAN_DEPTH) {
      return; // structural depth guard
    }

    let entries;
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch (err) {
      return; // unreadable directory — skip rather than crash the scan
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      if (EXCLUDED_FOLDERS.includes(entry.name)) {
        excludedCount += 1;
        continue;
      }

      const childPath = path.join(currentPath, entry.name);

      let realChildPath;
      try {
        realChildPath = fs.realpathSync(childPath);
      } catch (err) {
        continue; // broken symlink or permission issue — skip
      }

      // Path integrity: the real path must stay inside the repo root.
      if (!realChildPath.startsWith(resolvedRoot)) {
        continue;
      }

      // Symlink-cycle guard.
      if (visitedRealPaths.has(realChildPath)) {
        continue;
      }
      visitedRealPaths.add(realChildPath);

      totalDirectories += 1;
      maxDepthReached = Math.max(maxDepthReached, depth);

      walk(childPath, depth + 1);
    }
  }

  walk(resolvedRoot, 1);

  return { totalDirectories, maxDepthReached, excludedCount };
}

module.exports = { countActiveDirectories };