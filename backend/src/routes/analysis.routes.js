const express = require('express');

const { analyzeRepository } = require('../controllers/analysis.controller');

const router = express.Router();

router.post('/', analyzeRepository);

module.exports = router;
