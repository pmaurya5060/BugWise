const express = require('express');
const router = express.Router();
const {
  getAnalytics, getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/analytics', getAnalytics);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

module.exports = router;
