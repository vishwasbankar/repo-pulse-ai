const analyzeRepository = (request, response) => {
  const { repositoryUrl } = request.body;

  if (!repositoryUrl) {
    return response.status(400).json({
      success: false,
      message: 'repositoryUrl is required'
    });
  }

  return response.status(501).json({
    success: false,
    message: 'Repository analysis is not implemented yet'
  });
};

module.exports = { analyzeRepository };
