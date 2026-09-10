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

module.exports = {
  getRepository
};