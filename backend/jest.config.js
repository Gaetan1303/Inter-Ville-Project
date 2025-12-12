module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'], // Correction pour inclure le répertoire test
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json'],
  transform: {},
};