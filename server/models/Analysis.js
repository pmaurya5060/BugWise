const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    language: {
      type: String,
      required: [true, 'Programming language is required'],
      trim: true
    },
    errorInput: {
      type: String,
      required: [true, 'Error or code input is required'],
      trim: true
    },
    context: {
      goal: { type: String, default: '' },
      expected: { type: String, default: '' },
      actual: { type: String, default: '' },
      relevantCode: { type: String, default: '' }
    },
    result: {
      summary: { type: String, required: true },
      whatWentWrong: { type: String, required: true },
      rootCause: { type: String, required: true },
      likelyCauses: [{ type: String }],
      debuggingSteps: [{ type: String }],
      suggestedFix: { type: String, required: true },
      correctedCode: { type: String, default: '' },
      whyItWorks: { type: String, required: true },
      preventionTips: [{ type: String }]
    }
  },
  {
    timestamps: true
  }
);

analysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
