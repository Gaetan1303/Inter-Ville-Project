// Fichier de setup global pour Jest
// Centralise les mocks, le nettoyage de la base, etc.

// Charger les variables d'environnement pour les tests
require('dotenv').config({ path: '.env.test' });

// S'assurer que JWT_SECRET est défini pour les tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_for_ci_cd';
process.env.NODE_ENV = 'test';

// Exemple : mock global de nodemailer (évite les vrais envois d'emails)
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: jest.fn().mockResolvedValue(true) }))
}));

// Mocks globaux des modèles pour éviter les connexions de base de données
jest.mock('../src/models', () => {
  const mockUser = {
    id: 1,
    email: 'test@laplateforme.io',
    first_name: 'Test',
    last_name: 'User',
    city: 'Marseille',
    promo: '2025',
    is_validated: true,
    role: 'user'
  };

  const mockChallenge = {
    id: 1,
    title: 'Défi test',
    description: 'Un super défi',
    category: 'Code',
    difficulty: 'easy',
    status: 'active',
    created_by: 1,
    start_date: new Date(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };

  const mockComments = [
    {
      id: 1,
      content: 'Excellent défi !',
      user_id: 1,
      challenge_id: 1,
      parent_id: null,
      created_at: new Date(),
      author: mockUser
    }
  ];

  return {
    sequelize: {
      sync: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true)
    },
    User: {
      create: jest.fn().mockResolvedValue(mockUser),
      findByPk: jest.fn().mockResolvedValue(mockUser),
      findOne: jest.fn().mockResolvedValue(mockUser)
    },
    Challenge: {
      create: jest.fn().mockResolvedValue(mockChallenge),
      findByPk: jest.fn().mockResolvedValue(mockChallenge)
    },
    Comment: {
      create: jest.fn().mockImplementation((data) => ({
        id: 1,
        ...data,
        created_at: new Date(),
        author: mockUser
      })),
      findAll: jest.fn().mockImplementation(() => {
        // Retourne le commentaire créé dynamiquement
        return Promise.resolve([{
          id: 1,
          content: 'Premier commentaire',
          user_id: 1,
          challenge_id: 1,
          parent_id: null,
          created_at: new Date(),
          author: mockUser
        }]);
      }),
      findByPk: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          id: 1,
          content: 'Premier commentaire', 
          user_id: 1,
          challenge_id: 1,
          parent_id: null,
          created_at: new Date(),
          author: mockUser,
          destroy: jest.fn().mockResolvedValue(1) // Ajouter la méthode destroy
        });
      }),
      destroy: jest.fn().mockResolvedValue(1)
    }
  };
});

// Nettoyage de la base ou reset des mocks avant chaque test (optionnel)
beforeEach(() => {
  jest.clearAllMocks();
});

// Vous pouvez ajouter ici d'autres initialisations globales pour les tests
