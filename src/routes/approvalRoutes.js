const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

router.get(
  '/pending',
  authenticate,
  authorize('principal'),
  approvalController.getPendingContent
);

router.get(
  '/all',
  authenticate,
  authorize('principal'),
  approvalController.getAllContent
);

router.patch(
  '/:id/approve',
  authenticate,
  authorize('principal'),
  approvalController.approveContent
);

router.patch(
  '/:id/reject',
  authenticate,
  authorize('principal'),
  approvalController.rejectContent
);

module.exports = router;