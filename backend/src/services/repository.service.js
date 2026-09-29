const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

const downloadRepository = async (owner, repo, defaultBranch) => {
  const repoUrl = `https://github.com/${owner}/${repo}.git`;
  const localPath = path.join(__dirname, '..', '..', 'temp', `${owner}-${repo}`);

  try {
    if (fs.existsSync(localPath)) {
      fs.rmSync(localPath, { recursive: true, force: true });
    }

    const git = simpleGit();
    await git.clone(repoUrl, localPath, ['--branch', defaultBranch, '--single-branch', '--depth', '1']);

    return { localPath };
  } catch (error) {
    console.error('Repository clone failed:', error.message);
    throw new Error(`Failed to download repository ${owner}/${repo}`);
  }
};

module.exports = { downloadRepository };