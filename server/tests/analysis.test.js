const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Analysis = require('../models/Analysis');

let mongoServer;
let userAToken;
let userBToken;
let userAId;
let userBId;
let userAAnalysisId;

describe('Analysis Endpoints & Authorization', () => {
  jest.setTimeout(30000);

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Analysis.deleteMany({});

    // Register User A
    const resA = await request(app)
      .post('/api/auth/register')
      .send({ name: 'User A', email: 'usera@example.com', password: 'password123' });
    userAToken = resA.body.data.token;
    userAId = resA.body.data._id;

    // Register User B
    const resB = await request(app)
      .post('/api/auth/register')
      .send({ name: 'User B', email: 'userb@example.com', password: 'password123' });
    userBToken = resB.body.data.token;
    userBId = resB.body.data._id;

    // Create Analysis for User A
    const resAnalysis = await request(app)
      .post('/api/analyses')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        language: 'JavaScript',
        errorInput: 'Uncaught TypeError: Cannot read property name of undefined at index.js:12'
      });
    userAAnalysisId = resAnalysis.body.data._id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test('POST /api/analyses should analyze bug and save to database for user', async () => {
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
    expect(res.body.data.result).toHaveProperty('rootCause');
  });

  test('GET /api/analyses should return only the logged-in user analyses', async () => {
    const res = await request(app)
      .get('/api/analyses')
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id.toString()).toBe(userAAnalysisId.toString());

    // User B should see 0 analyses
    const resB = await request(app)
      .get('/api/analyses')
      .set('Authorization', `Bearer ${userBToken}`);

    expect(resB.statusCode).toBe(200);
    expect(resB.body.data.length).toBe(0);
  });

  test('User B should NOT be authorized to view User A analysis by ID', async () => {
    const res = await request(app)
      .get(`/api/analyses/${userAAnalysisId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('User B should NOT be authorized to delete User A analysis', async () => {
    const res = await request(app)
      .delete(`/api/analyses/${userAAnalysisId}`)
      .set('Authorization', `Bearer ${userBToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);

    // Verify still exists in DB
    const checkDb = await Analysis.findById(userAAnalysisId);
    expect(checkDb).not.toBeNull();
  });

  test('User A can successfully delete their own analysis', async () => {
    const res = await request(app)
      .delete(`/api/analyses/${userAAnalysisId}`)
      .set('Authorization', `Bearer ${userAToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const checkDb = await Analysis.findById(userAAnalysisId);
    expect(checkDb).toBeNull();
  });
});
