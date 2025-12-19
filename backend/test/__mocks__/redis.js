// Mock Redis pour les tests
const mockRedisClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  quit: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
  exists: jest.fn().mockResolvedValue(0),
  expire: jest.fn().mockResolvedValue(1),
  ttl: jest.fn().mockResolvedValue(-1),
  flushAll: jest.fn().mockResolvedValue('OK'),
  isReady: true,
  isOpen: true
};

module.exports = {
  createClient: jest.fn(() => mockRedisClient),
  __mockClient: mockRedisClient
};