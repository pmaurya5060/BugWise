const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      default: 'Bug Analysis'
    },
    language: {
      type: String,
      required: [true, 'Programming language is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Syntax', 'Runtime', 'Logic', 'Type', 'API', 'Database', 'Authentication', 'Performance', 'Security', 'Configuration', 'Other'],
      default: 'Runtime'
    },
    severity: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium'
    },
    errorInput: {
      type: String,
      required: [true, 'Error or code input is required'],
      trim: true
    },
    stackTraceInput: {
      type: String,
      default: ''
    },
    parsedStackTrace: {
      errorType: { type: String, default: '' },
      message: { type: String, default: '' },
      file: { type: String, default: '' },
      functionName: { type: String, default: '' },
      line: { type: Number, default: 0 },
      column: { type: Number, default: 0 },
      frames: [
        {
          file: String,
          functionName: String,
          line: Number,
          column: Number,
          raw: String
        }
      ]
    },
    context: {
      goal: { type: String, default: '' },
      expected: { type: String, default: '' },
      actual: { type: String, default: '' },
      relevantCode: { type: String, default: '' }
    },
    problematicLine: {
      lineNumber: { type: Number, default: 0 },
      snippet: { type: String, default: '' }
    },
    rootCauseChain: [{ type: String }],
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
