const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../../src/app');
const { User } = require('../../src/models');

console.log('Début des tests d\'intégration Auth');

// Correction du mot de passe dans le mock pour correspondre à la requête
const mockUser = {
  id: 1,
  email: 'test@laplateforme.io',
  password: bcrypt.hashSync('password123', 10), // Génération d'un hash valide pour le mot de passe
  first_name: 'John',
  last_name: 'Doe',
  city: 'Marseille',
  promo: 'Dev2',
  avatar: null,
  role: 'user',
  is_validated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

jest.mock('../../src/models', () => {
  const actualModels = jest.requireActual('../../src/models');

  return {
    ...actualModels,
    User: {
      ...actualModels.User,
      findOne: jest.fn(async (query) => {
        if (query.where.email === 'test@laplateforme.io') {
          return mockUser;
        }
        return null;
      }),
    },
  };
});

// Ajout d'une configuration pour JWT_SECRET dans l'environnement de test
process.env.JWT_SECRET = 'test_secret_key'; // Clé secrète pour les tests
console.log('Clé JWT_SECRET définie pour les tests:', process.env.JWT_SECRET);

// Définir une durée d'expiration plus longue pour les tests
process.env.JWT_EXPIRE = '1h'; // 1 heure pour éviter les expirations rapides
process.env.JWT_REFRESH_EXPIRE = '7d'; // 7 jours pour les tokens de rafraîchissement

describe('Auth Integration Tests', () => {
  it('should log in a user successfully', async () => {
    // Correction du mot de passe envoyé dans la requête pour correspondre au mock
    const password = bcrypt.hashSync('password123', 10); // Génération d'un hash valide pour le mot de passe
    console.log('Mot de passe corrigé pour la requête:', password);

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@laplateforme.io',
        password,
      });

    console.log('Test: Réponse de connexion:', response.status, response.body);

    const user = await User.findOne({ where: { email: 'test@laplateforme.io' } });
    console.log('Test: Utilisateur récupéré depuis le mock:', user);

    // Ajout de logs pour déboguer la comparaison statique
    console.log('Mot de passe attendu dans le mock:', mockUser.password);
    console.log('Mot de passe envoyé dans la requête:', password);

    const isMatch = (password === mockUser.password);
    console.log('Résultat de la comparaison statique:', isMatch);

    expect(isMatch).toBe(true); // Ajout d'une vérification explicite
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should fail to log in with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'invaliduser@example.com',
        password: 'wrongpassword',
      });

    console.log('Test: Réponse pour des identifiants invalides:', response.status, response.body);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fetch the authenticated user profile', async () => {
    const validToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const profileResponse = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${validToken}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty('success', true);
    expect(profileResponse.body.data).toHaveProperty('email', 'test@laplateforme.io'); // Suppression de 'user' dans l'accès
  });

  describe('Auth Integration Tests - Cas limites', () => {
    it('should fail to fetch profile with an invalid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should fail to fetch profile with an expired token', async () => {
      const expiredToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '-1s' });

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      console.log('Réponse avec token expiré:', response.status, response.body);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Token expired');
    });
  });
});

// Ajout de logs pour examiner les réponses des tests
if (typeof response !== 'undefined') {
  console.log('Réponse complète reçue:', response.body);
} else {
  console.log("La variable 'response' n'est pas définie. Vérifiez votre logique de test.");
}

jest.setTimeout(10000); // Augmente le délai pour éviter les erreurs liées au temps

afterAll(() => {
  jest.clearAllTimers();
});