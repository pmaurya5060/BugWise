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
      preventionTips: [{ type: String }],
      assumptions: { type: String, default: '' },
      alternativeSolutions: [
        {
          title: String,
          code: String,
          explanation: String,
          advantages: String,
          disadvantages: String,
          performance: String,
          useCase: String
        }
      ],
      securityScan: {
        hasIssues: { type: Boolean, default: false },
        issues: [
          {
            issue: String,
            severity: String,
            location: String,
            explanation: String,
            mitigation: String
          }
        ],
        disclaimer: {
          type: String,
          default: 'Automated AI security scanning cannot guarantee 100% security coverage.'
        }
      },
      performanceScan: {
        hasIssues: { type: Boolean, default: false },
        findings: [
          {
            problem: String,
            complexity: String,
            whyItMatters: String,
            improvement: String,
            optimizedCode: String
          }
        ]
      },
      regressionTest: {
        framework: { type: String, default: 'Jest' },
        testCode: { type: String, default: '' },
        verifies: { type: String, default: '' },
        edgeCases: [{ type: String }]
      },
      teachMe: {
        concept: { type: String, default: '' },
        simpleExplanation: { type: String, default: '' },
        whyCodeFailed: { type: String, default: '' },
        correctExample: { type: String, default: '' },
        commonMistakes: [{ type: String }],
        realWorldUsage: { type: String, default: '' },
        levels: {
          beginner: { type: String, default: '' },
          intermediate: { type: String, default: '' },
          advanced: { type: String, default: '' }
        }
      },
      interviewMode: {
        questions: [
          {
            question: String,
            keyPoints: [String],
            sampleAnswer: String
          }
        ]
      }
    },
    chatHistory: [
      {
        role: { type: String, enum: ['user', 'assistant'] },
        message: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ userId: 1, category: 1 });
analysisSchema.index({ userId: 1, severity: 1 });

module.exports = mongoose.model('Analysis', analysisSchema);
