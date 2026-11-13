const fs = require('fs');
const path = require('path');
const { validateGithubUrl, getRepositoryInfo } = require('./github.service');
const { downloadRepository } = require('./repository.service');
const { scanRepository } = require('./scanner.service');

const MAX_TEXT_FILE_BYTES = 1024 * 1024; // 1 MB

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.pdf',
  '.zip', '.gz', '.tar', '.7z', '.exe', '.dll', '.so',
  '.woff', '.woff2', '.ttf', '.eot', '.mp3', '.mp4', '.mov',
]);

function describeFile(rootPath, relativePath) {
  const extension = path.extname(relativePath).toLowerCase();
  const info = {
    path: relativePath,
    extension,
    sizeBytes: null,
    isReadable: true,
    skipReason: null,
  };

  try {
    info.sizeBytes = fs.statSync(path.join(rootPath, relativePath)).size;
  } catch (error) {
    info.isReadable = false;
    info.skipReason = 'unreadable';
    return info;
  }

  if (BINARY_EXTENSIONS.has(extension)) {
    info.isReadable = false;
    info.skipReason = 'binary';
  } else if (info.sizeBytes > MAX_TEXT_FILE_BYTES) {
    info.isReadable = false;
    info.skipReason = 'too_large';
  }
  return info;
}

function buildScanContext(repoPath) {
  const scan = scanRepository(repoPath);
  const files = scan.files.map((p) => describeFile(scan.rootPath, p));
  const skipped = files
    .filter((f) => !f.isReadable)
    .map((f) => ({ path: f.path, reason: f.skipReason }));

  return {
    rootPath: scan.rootPath,
    files,
    directories: scan.folders,
    extensions: scan.extensions,
    totals: {
      totalFiles: files.length,
      totalDirectories: scan.folders.length,
      readableFiles: files.length - skipped.length,
      skippedFiles: skipped.length,
    },
    skipped,
  };
}

async function prepareRepositoryForAnalysis(repoUrl) {
  let step = 'validation';
  try {
    const { owner, repo } = validateGithubUrl(repoUrl);

    step = 'metadata';
    const info = await getRepositoryInfo(owner, repo);

    step = 'download';
    const { localPath } = await downloadRepository(owner, repo, info.defaultBranch);

    step = 'scan';
    const scan = buildScanContext(localPath);

    return { repository: { ...info, localPath }, scan };
  } catch (error) {
    const wrapped = new Error(error.message);
    wrapped.step = step;
    throw wrapped;
  }
}

module.exports = { buildScanContext, prepareRepositoryForAnalysis };