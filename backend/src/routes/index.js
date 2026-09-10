const express = require('express');
const analysisRoutes = require('./analysis.routes');
const healthRoutes = require('./health.routes');
const githubRoutes = require('./github.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/analysis', analysisRoutes);
router.use('/github', githubRoutes);

module.exports = router;