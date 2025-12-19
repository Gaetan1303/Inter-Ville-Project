// Setup spécifique pour les tests d'intégration
// Mocks pour éviter les connexions de base de données réelles

// Mock des modèles pour les tests d'intégration
jest.mock('../../src/models', () => {
  const mockUser = {
    id: 1,
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    city: 'Test',
    promo: '2025',
    is_validated: true,
    role: 'admin',
    password: '$2b$10$hashedpassword' // Password hashé simulé
  };

  const mockUsers = [
    {
      id: 2,
      email: 'pending@example.com',
      first_name: 'Pending',
      last_name: 'User',
      is_validated: false,
      role: 'user'
    }
  ];

  const mockChallenge = {
    id: 1,
    title: 'Challenge Test Admin',
    description: 'Description du challenge de test',
    category: 'Test',
    difficulty: 'easy',
    status: 'active',
    created_by: 1,
    destroy: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true)
  };

  return {
    sequelize: {
      sync: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true)
    },
    User: {
      findOne: jest.fn().mockImplementation((options) => {
        if (options.where.email === 'admin@example.com') {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      }),
      findAll: jest.fn().mockResolvedValue(mockUsers),
      findByPk: jest.fn().mockImplementation((id) => {
        if (id === 1 || id === '1') return Promise.resolve(mockUser);
        if (id === 2 || id === '2') return Promise.resolve(mockUsers[0]);
        return Promise.resolve(null);
      }),
      create: jest.fn().mockResolvedValue(mockUser)
    },
    Challenge: {
      create: jest.fn().mockResolvedValue(mockChallenge),
      findByPk: jest.fn().mockImplementation((id) => {
        if (id === 1 || id === '1') return Promise.resolve(mockChallenge);
        return Promise.resolve(null);
      }),
      findAll: jest.fn().mockResolvedValue([mockChallenge])
    },
    Comment: {
      create: jest.fn().mockResolvedValue({ id: 1, content: 'Test comment' }),
      findAll: jest.fn().mockResolvedValue([]),
      findByPk: jest.fn().mockResolvedValue(null)
    }
  };
});

// Mock bcrypt pour l'authentification
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword')
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_jwt_token'),
  verify: jest.fn().mockReturnValue({ id: 1, role: 'admin' })
}));