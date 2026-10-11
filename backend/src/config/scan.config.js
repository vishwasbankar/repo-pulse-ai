/**
 * backend/src/config/scan.config.js
 *
 * Shared repository-scan settings used by BOTH the File Counting
 * module (Member 1) and the Directory Counting module (Member 2).
 * Importing from one shared file — instead of each member keeping
 * their own copy — is what guarantees the "identical folder-exclusion
 * filters" requirement actually stays identical over time.
 *
 * Matches Member 1's confirmed spec exactly: bypass items inside
 * .git, node_modules, dist, and build. Nothing else is excluded —
 * don't add more entries here without updating Member 1's spec too,
 * or the two counts will drift apart.
 */

const EXCLUDED_FOLDERS = [
  '.git',
  'node_modules',
  'dist',
  'build',
];

// Safety ceiling so a symlink loop or pathological nesting can't hang
// the scan or overflow the call stack.
const MAX_SCAN_DEPTH = 50;

module.exports = { EXCLUDED_FOLDERS, MAX_SCAN_DEPTH };