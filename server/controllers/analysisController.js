const Analysis = require('../models/Analysis');
const { analyzeBug } = require('../services/aiService');

// @desc    Analyze bug & save analysis
// @route   POST /api/analyses
// @access  Private
const createAnalysis = async (req, res, next) => {
  try {
    const { language, errorInput, context } = req.body;

    if (!language || !errorInput || !errorInput.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both programming language and error/code input'
      });
    }

    // Call AI Service
    const aiResult = await analyzeBug({
      language,
      errorInput,
      context: context || {}
    });

    // Save to Database
    const analysis = await Analysis.create({
      userId: req.user._id,
      language,
      errorInput,
      context: {
        goal: context?.goal || '',
        expected: context?.expected || '',
        actual: context?.actual || '',
        relevantCode: context?.relevantCode || ''
      },
      result: aiResult
    });

    res.status(201).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's analysis history
// @route   GET /api/analyses
// @access  Private
const getAnalyses = async (req, res, next) => {
  try {
    const { search, language } = req.query;

    let query = { userId: req.user._id };

    if (language && language.toLowerCase() !== 'all') {
      query.language = new RegExp(`^${language}$`, 'i');
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { errorInput: searchRegex },
        { 'result.summary': searchRegex },
        { 'result.whatWentWrong': searchRegex },
        { 'result.rootCause': searchRegex }
      ];
    }

    const analyses = await Analysis.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single analysis by ID
// @route   GET /api/analyses/:id
// @access  Private
const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    // Enforce Ownership check
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this analysis'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single analysis
// @route   DELETE /api/analyses/:id
// @access  Private
const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    // Enforce Ownership check
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this analysis'
      });
    }

    await analysis.deleteOne();

    res.json({
      success: true,
      message: 'Analysis removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

const explainSelection = async (req, res, next) => { try { const { fullCode, selectedCode, language } = req.body; const { explainCodeSelection } = require('../services/aiService'); const explanation = await explainCodeSelection({ fullCode, selectedCode, language }); res.json({ success: true, explanation }); } catch (error) { next(error); } };
const postChatFollowUp = async (req, res, next) => { try { const { userMessage } = req.body; const analysis = await Analysis.findById(req.params.id); if (!analysis) return res.status(404).json({ success: false, message: 'Analysis not found' }); if (analysis.userId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' }); const { chatFollowUp } = require('../services/aiService'); const reply = await chatFollowUp({ code: analysis.errorInput, originalAnalysis: analysis.result, chatHistory: analysis.chatHistory || [], userMessage }); analysis.chatHistory = analysis.chatHistory || []; analysis.chatHistory.push({ role: 'user', message: userMessage }); analysis.chatHistory.push({ role: 'assistant', message: reply }); await analysis.save(); res.json({ success: true, data: analysis.chatHistory }); } catch (error) { next(error); } };
const postInterviewEvaluation = async (req, res, next) => { try { const { questionIndex, userResponse } = req.body; const analysis = await Analysis.findById(req.params.id); if (!analysis) return res.status(404).json({ success: false, message: 'Analysis not found' }); if (analysis.userId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' }); const item = analysis.result?.interviewMode?.[questionIndex]; if (!item) return res.status(400).json({ success: false, message: 'Invalid question index' }); const { evaluateInterviewAnswer } = require('../services/aiService'); const evalResult = await evaluateInterviewAnswer({ question: item.question, hint: item.hint, sampleAnswer: item.sampleAnswer, userResponse }); res.json({ success: true, evaluation: evalResult }); } catch (error) { next(error); } };
module.exports = {
  explainSelection,
  postChatFollowUp,
  postInterviewEvaluation,
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis
};
