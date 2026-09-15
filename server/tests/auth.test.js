const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

jest.mock('../models/User');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/register should create a new user & return JWT token', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'user_123',
      name: 'Test Developer',
      email: 'test@example.com'
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Developer',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.email).toBe('test@example.com');
  });

  test('POST /api/auth/register should fail on duplicate email', async () => {
    User.findOne.mockResolvedValue({
      _id: 'existing_user',
      email: 'test@example.com'
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  test('POST /api/auth/login should authenticate valid credentials', async () => {
    const mockUser = {
      _id: 'user_123',
      name: 'Test Dev',
      email: 'login@example.com',
      matchPassword: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  test('GET /api/auth/me should reject request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
