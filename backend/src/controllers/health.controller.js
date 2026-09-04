const getHealth = (request, response) => {
  response.status(200).json({
    success: true,
    status: 'ok',
    service: 'repopulse-ai-backend',
    timestamp: new Date().toISOString()
  });
};

module.exports = { getHealth };
