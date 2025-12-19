/**
 * Test E2E principal : flux utilisateur complet
 * Scénario : Inscription → Validation Admin → Connexion → Création Challenge → Commentaire
 * 
 * @requires supertest
 * @requires dotenv
 */

require('dotenv').config({ path: __dirname + '/.env' });
const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/config/database');
const User = require('../../src/models/User');
const Challenge = require('../../src/models/Challenge');
const Comment = require('../../src/models/Comment');

// Mock l'envoi d'emails pour éviter les appels SMTP pendant les tests
jest.mock('../../src/services/email_service', () => ({
  send_welcome_email: jest.fn().mockResolvedValue(true),
  send_validation_email: jest.fn().mockResolvedValue(true)
}));

describe('E2E - Flux utilisateur complet', () => {
  let userToken;
  let adminToken;
  let userId;
  let adminId;
  let challengeId;
  let commentId;

  const testUser = {
    first_name: 'Jean',
    last_name: 'Dupont',
    email: `e2e_user_${Date.now()}@laplateforme.io`,
    password: 'Test1234!',
    city: 'Marseille',
    promo: '2025'
  };

  const testAdmin = {
    first_name: 'Admin',
    last_name: 'Test',
    email: `e2e_admin_${Date.now()}@laplateforme.io`,
    password: 'Admin1234!',
    city: 'Paris',
    promo: '2024',
    role: 'admin'
  };

  // ==================== SETUP ====================
  beforeAll(async () => {
    // Synchroniser la DB (sans force pour garder la structure)
    await sequelize.sync({ force: false });
    
    // Créer un admin directement en base pour les tests
    const admin = await User.create({
      ...testAdmin,
      is_validated: true
    });
    adminId = admin.id;
    
    // Générer token admin
    const jwt = require('jsonwebtoken');
    adminToken = jwt.sign(
      { id: adminId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Nettoyer les données de test
    try {
      if (userId) {
        await Comment.destroy({ where: { user_id: userId } });
        await Challenge.destroy({ where: { created_by: userId } });
      }
      if (userId || adminId) {
        const idsToDelete = [userId, adminId].filter(id => id !== undefined);
        if (idsToDelete.length > 0) {
          await User.destroy({ where: { id: idsToDelete } });
        }
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage des tests:', error);
    } finally {
      await sequelize.close();
    }
  });

  // ==================== TESTS ====================

  describe('1. Inscription et Validation', () => {
    it('Inscription utilisateur avec email @laplateforme.io', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('attente de validation');
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.is_validated).toBe(false);
      
      // Récupérer l'ID pour les tests suivants
      const created = await User.findOne({ where: { email: testUser.email } });
      userId = created.id;
    });

    it('Refus inscription avec email non @laplateforme.io', async () => {
      const invalidUser = { ...testUser, email: 'test@gmail.com' };
      const res = await request(app)
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('email invalide');
    });

    it('Connexion impossible avant validation admin', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('validé');
    });

    it('Validation par un administrateur', async () => {
      const res = await request(app)
        .put(`/admin/users/${userId}/validate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('validé avec succès');
      
      // Vérifier en base
      const user = await User.findByPk(userId);
      expect(user.is_validated).toBe(true);
    });
  });

  describe('2. Authentification', () => {
    it('Connexion utilisateur validé', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Connexion réussie');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      
      userToken = res.body.data.accessToken;
    });

    it('Connexion avec mauvais mot de passe', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: 'WrongPassword123!' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('Accès au profil avec token valide', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.is_validated).toBe(true);
      expect(res.body.data.user).not.toHaveProperty('password'); // Sécurité
    });

    it('Accès refusé sans token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Gestion des Challenges', () => {
    it('Création d\'un challenge avec catégorie valide', async () => {
      const challenge = {
        title: 'E2E Challenge Test',
        description: 'Challenge créé pendant le test E2E pour valider le flux complet',
        category: 'Code', // Catégorie fixe (après correction ENUM)
        difficulty: 'easy',
        start_date: new Date(Date.now() + 3600000), // +1h
        end_date: new Date(Date.now() + 7200000), // +2h
        created_by: userId
      };

      const res = await request(app)
        .post('/challenges')
        .set('Authorization', `Bearer ${userToken}`)
        .send(challenge)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(challenge.title);
      expect(res.body.data.category).toBe(challenge.category);
      expect(res.body.data.difficulty).toBe(challenge.difficulty);
      
      challengeId = res.body.data.id;
    });

    it('Récupération de la liste des challenges', async () => {
      const res = await request(app)
        .get('/challenges')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('Détail d\'un challenge spécifique', async () => {
      const res = await request(app)
        .get(`/challenges/${challengeId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(challengeId);
      expect(res.body.data.title).toBe('E2E Challenge Test');
    });

    it('Filtrage par catégorie', async () => {
      const res = await request(app)
        .get('/challenges?category=code')
        .expect(200);

      expect(res.body.success).toBe(true);
      // Comparer en minuscule pour correspondre à l’ENUM
      expect(res.body.data.every(c => c.category.toLowerCase() === 'code')).toBe(true);
    });
  });

  describe('4. Système de Commentaires', () => {
    it('Ajout d\'un commentaire sur un challenge', async () => {
      const res = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Super challenge, j\'adore !',
          challenge_id: challengeId
        })
        .expect(201);

      expect(res.body.content).toBe('Super challenge, j\'adore !');
      expect(res.body.challenge_id).toBe(challengeId);
      expect(res.body.user_id).toBe(userId);
      
      commentId = res.body.id;
    });

    it('Récupération des commentaires d\'un challenge', async () => {
      const res = await request(app)
        .get(`/comments/challenge/${challengeId}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('author');
      expect(res.body[0].author.id).toBe(userId);
    });

    it('Ajout d\'une réponse à un commentaire', async () => {
      const res = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          content: 'Merci pour ton commentaire !',
          challenge_id: challengeId,
          parent_id: commentId
        })
        .expect(201);

      expect(res.body.parent_id).toBe(commentId);
    });

    it('Suppression d\'un commentaire par son auteur', async () => {
      const res = await request(app)
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.message).toContain('supprimé');
    });
  });

  describe('5. Administration', () => {
    it('Admin peut récupérer les stats globales', async () => {
      const res = await request(app)
        .get('/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('challenges');
      expect(res.body.data).toHaveProperty('comments');
    });

    it('User ne peut pas accéder aux routes admin', async () => {
      const res = await request(app)
        .get('/admin/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('droits insuffisants');
    });

    it('Admin peut supprimer un challenge', async () => {
      const res = await request(app)
        .delete(`/admin/challenges/${challengeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // Vérifier que le challenge est bien supprimé
      const deleted = await Challenge.findByPk(challengeId);
      expect(deleted).toBeNull();
    });
  });

  describe('6. Sécurité et Performance', () => {
    it('Rate-limiting protège contre les abus', async () => {
      const requests = [];
      for (let i = 0; i < 101; i++) {
        requests.push(request(app).get('/heal'));
      }
      const responses = await Promise.all(requests);
      const tooManyRequests = responses.filter(r => r.status === 429);
      expect(tooManyRequests.length).toBeGreaterThan(0);
    }, 20000);

    // Attendre la réinitialisation du compteur de rate-limit pour ne pas polluer les autres tests
    afterAll(async () => {
      await new Promise(resolve => setTimeout(resolve, 16000));
    }, 20000);

    // afterAll supprimé car inutile si le test de rate-limit est désactivé

    it('Token expiré est rejeté', async () => {
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' } // Token déjà expiré
      );

      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(res.body.message).toContain('expired');
    });

    it('Swagger documentation accessible', async () => {
      const res = await request(app)
        .get('/api-docs/')
        .expect(200);

      expect(res.text).toContain('swagger');
    });
  });

  describe('7. Validation des Données', () => {
    it('Challenge sans titre refusé', async () => {
      const res = await request(app)
        .post('/challenges')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: 'Challenge sans titre',
          category: 'Code',
          difficulty: 'easy'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('Commentaire vide refusé', async () => {
      const res = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: '',
          challenge_id: 1
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });
});