const User = require('../models/User');
const Analysis = require('../models/Analysis');

// @desc    Get profile details & analysis statistics
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const totalAnalyses = await Analysis.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        totalAnalyses,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile name
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid name'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = name.trim();
    await user.save();

    const totalAnalyses = await Analysis.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        totalAnalyses,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => { try { const Analysis = require('../models/Analysis'); const analyses = await Analysis.find({ userId: req.user._id }); const totalAnalyses = analyses.length; const categoryCounts = {}; const languageCounts = {}; let securityRisksFound = 0; analyses.forEach(a => { const cat = a.result?.category || 'Other'; categoryCounts[cat] = (categoryCounts[cat] || 0) + 1; const lang = a.language || 'Unknown'; languageCounts[lang] = (languageCounts[lang] || 0) + 1; if (a.result?.securityScan?.vulnerabilities?.length > 0) securityRisksFound += a.result.securityScan.vulnerabilities.length; }); res.json({ success: true, data: { totalAnalyses, categoryCounts, languageCounts, securityRisksFound } }); } catch (error) { next(error); } };
module.exports = {
  getAnalytics,
  getProfile,
  updateProfile
};
