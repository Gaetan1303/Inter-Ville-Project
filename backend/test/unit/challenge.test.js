const { describe, it, expect } = require('@jest/globals');
const Challenge = require('../../src/models/Challenge');

// Mock Sequelize
jest.mock('../../src/models/Challenge');

// Correcting the mock configuration for Challenge
const mockChallenge = jest.requireMock('../../src/models/Challenge');

mockChallenge.build = jest.fn((data) => {
  const mockObject = {
    dataValues: {
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      status: data.status,
      createdBy: data.createdBy, // Explicitly include createdBy in dataValues
    },
    save: jest.fn().mockResolvedValue({ ...data }),
  };
  console.log('Mock Challenge.build returned object:', mockObject);
  return mockObject;
});

mockChallenge.create = jest.fn((data) => {
  if (!data.title || !data.description || !data.category || !data.difficulty || !data.startDate || !data.endDate || !data.createdBy) {
    throw new Error('notNull Violation');
  }
  return Promise.resolve({ ...data });
});

describe('Challenge Model Unit Tests', () => {
  it('should create a challenge instance with valid data', () => {
    const challengeData = {
      title: 'Test Challenge',
      description: 'This is a test challenge.',
      category: 'Test Category',
      difficulty: 'easy',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(),
      created_by: 1, // Use created_by as defined in the model
    };

    const challenge = Challenge.build(challengeData);

    console.log('Challenge object returned by build:', challenge); // Log the challenge object

    expect(challenge.title).toBe(challengeData.title);
    expect(challenge.description).toBe(challengeData.description);
    expect(challenge.category).toBe(challengeData.category);
    expect(challenge.difficulty).toBe(challengeData.difficulty);
    expect(challenge.status).toBe(challengeData.status);
    expect(challenge.created_by).toBe(challengeData.created_by); // Use created_by here
  });

  it('should throw an error if required fields are missing', async () => {
    const challengeData = {
      title: null, // Missing required fields
      description: null,
      category: null,
      difficulty: null,
      startDate: null,
      endDate: null,
      createdBy: null,
    };

    try {
      await Challenge.create(challengeData);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toMatch(/notNull/); // Sequelize validation error
    }
  });
});