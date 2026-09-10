const express = require('express');
const { getGitHubRepository } = require('../controllers/github.controller');

const router = express.Router();

router.get('/:owner/:repo', getGitHubRepository);

module.exports = router;