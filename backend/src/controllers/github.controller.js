const { getRepository } = require('../services/github.service');

const getGitHubRepository = async (request, response) => {
  try {
    const { owner, repo } = request.params;

    if (!owner || !repo) {
      return response.status(400).json({
        success: false,
        message: 'Owner and repository name are required'
      });
    }

    const repository = await getRepository(owner, repo);

    return response.status(200).json({
      success: true,
      data: repository
    });
  } catch (error) {
    console.error('GitHub controller error:', error.message);

    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getGitHubRepository
};