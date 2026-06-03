const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// Public routes
router.get('/active', pollController.getActivePolls);
router.post('/:id/vote', pollController.vote);

// Teacher only routes
router.post('/', authenticate, authorize('teacher'), pollController.createPoll);
router.get('/my-polls', authenticate, authorize('teacher'), pollController.getMyPolls);
router.patch('/:id/toggle', authenticate, authorize('teacher'), pollController.togglePoll);
router.delete('/:id', authenticate, authorize('teacher'), pollController.deletePoll);

module.exports = router;