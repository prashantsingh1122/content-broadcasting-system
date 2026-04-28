const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');
const upload = require('../config/s3');

router.post(
  '/upload',
  authenticate,
  authorize('teacher'),
  upload.single('file'),
  contentController.uploadContent
);

router.get(
  '/my-content',
  authenticate,
  authorize('teacher'),
  contentController.getMyContent
);

module.exports = router;