const express = require('express');
const router = express.Router();
const {
  explainSelection,
  postChatFollowUp,
  postInterviewEvaluation,
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis
} = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.use(protect); // All analysis routes require authentication

router.route('/')
  .post(aiRateLimiter, createAnalysis)
  .get(getAnalyses);

router.post('/explain-selection', explainSelection);
router.post('/:id/chat', postChatFollowUp);
router.post('/:id/interview', postInterviewEvaluation);
router.route('/:id')
  .get(getAnalysisById)
  .delete(deleteAnalysis);

module.exports = router;
