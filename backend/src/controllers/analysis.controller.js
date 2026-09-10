const Analysis = require('../models/analysis.model');

const analyzeRepository = async (request, response) => {
  try {
    const { repositoryUrl } = request.body;

    if (!repositoryUrl) {
      return response.status(400).json({
        success: false,
        message: 'repositoryUrl is required'
      });
    }

    const repositoryName = repositoryUrl
      .split('/')
      .filter(Boolean)
      .pop();

    const analysis = await Analysis.create({
      repositoryUrl,
      repositoryName,
      status: 'pending'
    });

    return response.status(201).json({
      success: true,
      message: 'Analysis request created',
      data: analysis
    });
  } catch (error) {
    console.error('Analysis controller error:', error.message);

    return response.status(500).json({
      success: false,
      message: 'Failed to create analysis request'
    });
  }
};

module.exports = { analyzeRepository };