const express = require('express');
const router = express.Router();
const { getLiveContent } = require('../controllers/broadcastController');

// Public route - no authentication needed (students access this)
router.get('/live/:teacherId', getLiveContent);

module.exports = router;