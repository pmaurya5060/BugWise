const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');
const Analysis = require('../models/Analysis');

jest.mock('../models/User');
jest.mock('../models/Analysis');
jest.mock('../services/aiService', () => ({
  analyzeBug: jest.fn().mockResolvedValue({
    summary: 'Mocked Analysis Summary',
    whatWentWrong: 'Mocked Error',
    rootCause: 'Mocked Cause',
    likelyCauses: ['Cause 1'],
    debuggingSteps: ['Step 1'],
    suggestedFix: 'Fix it',
    correctedCode: 'console.log("fixed");',
    whyItWorks: 'Works because of fix',
    preventionTips: ['Tip 1']
  })
}));

const generateTestToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_12345',
    { expiresIn: '1h' }
  );
};

describe('Analysis Endpoints & Authorization', () => {
  const userAId = '60d5ecb8b3b3b3b3b3b3b3a1';
  const userBId = '60d5ecb8b3b3b3b3b3b3b3b2';
  const userAToken = generateTestToken(userAId);
  const userBToken = generateTestToken(userBId);
  const userAAnalysisId = '60d5ecb8b3b3b3b3b3b3b3c3';

  beforeEach(() => {
    jest.clearAllMocks();

    User.findById.mockImplementation((id) => ({
      select: jest.fn().mockResolvedValue({
        _id: id,
        name: id === userAId ? 'User A' : 'User B',
        email: id === userAId ? 'usera@example.com' : 'userb@example.com'
      })
    }));
  });

  test('POST /api/analyses should analyze bug and save to database for user', async () => {
    Analysis.create.mockResolvedValue({
      _id: 'new_analysis_id',
      userId: userAId,
      language: 'Python',
      errorInput: 'AttributeError: object has no attribute execute',
      result: {
        summary: 'Mocked Analysis Summary',
        rootCause: 'Mocked Cause'
      }
    });

    const res = await request(app)
      .post('/api/analyses')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        language: 'Python',
        errorInput: 'AttributeError: object has no attribute execute'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('result');
  });

  test('GET /api/analyses should return only the logged-in user analyses', async () => {
    Analysis.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        {
          _id: userAAnalysisId,
          userId: userAId,
          language: 'JavaScript',
          errorInput: 'Uncaught TypeError'
        }
      ])
    });

    const res = await request(app)
      .get('/api/analyses')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id.toString()).toBe(userAAnalysisId.toString());
  });

  test('User B should NOT be authorized to view User A analysis by ID', async () => {
    Analysis.findById.mockResolvedValue({
      _id: userAAnalysisId,
      userId: userAId, // Belongs to User A
      language: 'JavaScript'
    });

    const res = await request(app)
      .get(`/api/analyses/${userAAnalysisId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('User B should NOT be authorized to delete User A analysis', async () => {
    Analysis.findById.mockResolvedValue({
      _id: userAAnalysisId,
      userId: userAId, // Belongs to User A
      deleteOne: jest.fn()
    });

    const res = await request(app)
      .delete(`/api/analyses/${userAAnalysisId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('User A can successfully delete their own analysis', async () => {
    const mockDeleteOne = jest.fn().mockResolvedValue(true);
    Analysis.findById.mockResolvedValue({
      _id: userAAnalysisId,
      userId: userAId, // Belongs to User A
      deleteOne: mockDeleteOne
    });

    const res = await request(app)
      .delete(`/api/analyses/${userAAnalysisId}`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockDeleteOne).toHaveBeenCalled();
  });
});
