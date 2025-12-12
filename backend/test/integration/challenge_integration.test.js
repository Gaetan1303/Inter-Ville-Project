const request = require('supertest');
const app = require('../../src/app');
const Challenge = require('../../src/models/Challenge');

// Mock Sequelize
jest.mock('../../src/models/Challenge');

describe('Challenge Integration Tests', () => {
  let userToken;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@example.com',
        password: 'userpassword',
      });

    userToken = loginResponse.body.token;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all challenges with filters', async () => {
    const challenge = Challenge.build({
        id: 1,
        title: 'Challenge 1',
        description: 'Description 1',
        category: 'Category 1',
        difficulty: 'easy',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(),
        createdBy: 1,
      });
    Challenge.findAll = jest.fn().mockResolvedValue([
      challenge
    ]);

    const response = await request(app).get('/challenges?difficulty=easy&status=active');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].difficulty).toBe('easy');
    expect(response.body.data[0].status).toBe('active');
  });

  it('should fetch all challenges', async () => {
    const response = await request(app)
      .get('/challenges')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should fetch a challenge by ID', async () => {
    Challenge.findByPk = jest.fn().mockResolvedValue({
      id: 1,
      title: 'Challenge 1',
      description: 'Description 1',
      category: 'Category 1',
      difficulty: 'easy',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(),
      createdBy: 1,
    });

    const response = await request(app).get('/challenges/1');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Challenge 1');
  });

  it('should create a new challenge with valid data', async () => {
    const challengeData = {
      title: 'New Challenge',
      description: 'New Description',
      category: 'New Category',
      difficulty: 'medium',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(),
      createdBy: 1,
    };

    Challenge.create = jest.fn().mockResolvedValue(challengeData);

    const response = await request(app).post('/challenges').send(challengeData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('New Challenge');
  });

  it('should return 404 if challenge not found', async () => {
    Challenge.findByPk = jest.fn().mockResolvedValue(null);

    const response = await request(app).get('/challenges/999');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Challenge not found');
  });

  it('should create a new challenge', async () => {
    const response = await request(app)
      .post('/challenges')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'New Challenge',
        description: 'Challenge description',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Challenge créé avec succès');
  });
});