const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

beforeAll(async () => {
  // Synchroniser la base de données avant les tests
  await sequelize.sync({ force: true });
});

describe('Test d\'intégration Auth', () => {
  test('Création d\'un compte utilisateur', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@laplateforme.io',
        password: 'Password123!',
        first_name: 'John',
        last_name: 'Doe',
        city: 'Marseille',
        promo: 'Dev2'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Inscription réussie. Votre compte est en attente de validation par un administrateur.');
  });

  test('Connexion de l\'utilisateur non validé', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@laplateforme.io',
        password: 'Password123!'
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Votre compte doit être validé par un administrateur');
  });

  test('Connexion de l\'utilisateur validé', async () => {
    // Valider l'utilisateur manuellement dans la base de données
    await sequelize.models.User.update({ is_validated: true }, { where: { email: 'test@laplateforme.io' } });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@laplateforme.io',
        password: 'Password123!'
      });

    console.log('Réponse de connexion réussie:', response.status, response.body);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
  });

  test('Erreur lors de l\'inscription avec un email invalide', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'invalid@gmail.com',
        password: 'Password123!',
        first_name: 'John',
        last_name: 'Doe',
        city: 'Marseille',
        promo: 'Dev2'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Format d'email invalide");
  });

  test('Erreur lors de l\'inscription avec un mot de passe trop court', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@laplateforme.io',
        password: 'short',
        first_name: 'John',
        last_name: 'Doe',
        city: 'Marseille',
        promo: 'Dev2'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Le mot de passe doit contenir au moins 8 caractères');
  });

  test('Validation d\'un utilisateur par un administrateur', async () => {
    // Créer un utilisateur non validé
    const user = await sequelize.models.User.create({
      email: 'admin@laplateforme.io',
      password: 'Admin123!',
      first_name: 'Admin',
      last_name: 'User',
      city: 'Marseille',
      promo: 'Dev2',
      role: 'admin',
      is_validated: true
    });

    const adminLogin = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@laplateforme.io',
        password: 'Admin123!'
      });

    console.log('Réponse de connexion admin:', adminLogin.body); // Ajout d'un log pour déboguer

    const adminToken = adminLogin.body.data?.accessToken; // Ajout d'une vérification de sécurité
    expect(adminToken).toBeDefined(); // Vérifie que le token existe

    const response = await request(app)
      .post('/auth/validate-user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Utilisateur validé avec succès');
  });

  it('should log in a user successfully', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@laplateforme.io', password: 'Password123!' });

    console.log('Réponse de connexion réussie:', response.status, response.body);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
  });

  it('should fetch the authenticated user profile', async () => {
    const validToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const profileResponse = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${validToken}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty('success', true);
    expect(profileResponse.body.data.user).toHaveProperty('email', 'test@laplateforme.io'); // Mise à jour pour accéder à 'data.user.email'
  });
});

afterAll(async () => {
  // Fermer les connexions à la base de données
  await sequelize.close();

  // Nettoyer les timers actifs
  jest.clearAllTimers();
});