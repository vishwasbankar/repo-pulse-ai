const axios = require('axios');

const getRepository = async (owner, repo) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    return response.data;
  } catch (error) {
    console.error('GitHub API request failed:', error.message);
    throw new Error('Failed to fetch GitHub repository');
  }
};

const getRepositoryInfo = async (owner, repo) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    const data = response.data;

    return {
      name: data.name,
      owner: data.owner.login,
      defaultBranch: data.default_branch,
      private: data.private,
      description: data.description || '',
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(
        `Repository ${owner}/${repo} not found or is inaccessible (private or deleted)`
      );
    }
    console.error('GitHub API request failed:', error.message);
    throw new Error('Failed to fetch repository information');
  }
};

module.exports = {
  getRepository,
  getRepositoryInfo
};