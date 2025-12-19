module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json'],
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  // Force exit to prevent hanging tests
  forceExit: true,
  // Detect open handles that might prevent Jest from exiting
  detectOpenHandles: false,
  // Clear mocks between tests
  clearMocks: true,
  // Timeout for tests
  testTimeout: 30000,
  // Mock modules that cause connection issues during tests
  moduleNameMapper: {
    '^redis$': '<rootDir>/test/__mocks__/redis.js'
  }
};