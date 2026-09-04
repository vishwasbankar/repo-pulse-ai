const express = require('express');

const analysisRoutes = require('./analysis.routes');
const healthRoutes = require('./health.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/analysis', analysisRoutes);

module.exports = router;
