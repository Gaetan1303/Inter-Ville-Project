const { describe, it, expect } = require('@jest/globals');
const { get_pending_users, validate_user, delete_challenge, delete_comment, get_stats } = require('../../src/controllers/admin_controller');
const { generate_admin_token } = require('../../src/services/token_service');
const User = require('../../src/models/User');
const Challenge = require('../../src/models/Challenge');
const Comment = require('../../src/models/Comment');
const jwt = require('jsonwebtoken');

// Add this at the top of the file to mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRE = '1h';

// Ensure User.findByPk is mocked correctly
jest.mock('../../src/models/User', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  const UserMock = dbMock.define('User', {
    id: 1,
    is_validated: false,
  });

  UserMock.findByPk = jest.fn((id) => {
    if (id === 1) {
      return Promise.resolve(UserMock.build({ id: 1, is_validated: false }));
    }
    return Promise.resolve(null);
  });

  return UserMock;
});

// Define mockResponse to simulate Express response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Admin Controller Unit Tests', () => {
  describe('get_pending_users', () => {
    it('should return a list of pending users', async () => {
      const mockUsers = [{ id: 1, email: 'test@example.com', is_validated: false }];
      User.findAll = jest.fn(() => Promise.resolve(mockUsers));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await get_pending_users(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUsers });
    });

    it('should handle errors', async () => {
      User.findAll = jest.fn(() => Promise.reject(new Error('Database error')));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await get_pending_users(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Erreur serveur' });
    });
  });

  describe('validate_user', () => {
    it('should validate a user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', is_validated: false, save: jest.fn() };
      User.findByPk = jest.fn(() => Promise.resolve(mockUser));

      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await validate_user(req, res);

      expect(mockUser.is_validated).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Utilisateur validé avec succès',
        data: { id: mockUser.id, email: mockUser.email, is_validated: true },
      });
    });

    it('should handle user not found', async () => {
      User.findByPk = jest.fn(() => Promise.resolve(null));

      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await validate_user(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Utilisateur non trouvé' });
    });

    // Correction et amélioration des tests unitaires

    // Ajout d'un test pour vérifier le comportement lorsque l'ID utilisateur est invalide
    it('should handle invalid user ID for validate_user', async () => {
      User.findByPk = jest.fn(() => Promise.resolve(null));

      const req = { params: { id: 'invalid' } }; // ID utilisateur invalide
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await validate_user(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Utilisateur non trouvé' });
    });

    // Ajout d'un test pour vérifier les erreurs inattendues dans validate_user
    it('should handle unexpected errors in validate_user', async () => {
      User.findByPk = jest.fn(() => Promise.reject(new Error('Unexpected error')));

      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await validate_user(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Erreur serveur' });
    });
  });

  describe('delete_challenge', () => {
    it('should delete a challenge', async () => {
      const mockChallenge = { id: 1, destroy: jest.fn() };
      Challenge.findByPk = jest.fn(() => Promise.resolve(mockChallenge));

      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await delete_challenge(req, res);

      expect(mockChallenge.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Challenge supprimé avec succès' });
    });

    it('should handle challenge not found', async () => {
      Challenge.findByPk = jest.fn(() => Promise.resolve(null));

      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await delete_challenge(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Challenge non trouvé' });
    });
  });

  describe('delete_comment', () => {
    it('should delete a comment', async () => {
      const mockComment = { id: 1, destroy: jest.fn() };
      Comment.findByPk = jest.fn(() => Promise.resolve(mockComment));

      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await delete_comment(req, res);

      expect(mockComment.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Commentaire supprimé avec succès' });
    });

    it('should handle comment not found', async () => {
      Comment.findByPk = jest.fn(() => Promise.resolve(null));

      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await delete_comment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Commentaire non trouvé' });
    });
  });

  describe('get_stats', () => {
    it('should return global statistics', async () => {
      User.count = jest.fn(() => Promise.resolve(10));
      Challenge.count = jest.fn(() => Promise.resolve(5));
      Comment.count = jest.fn(() => Promise.resolve(20));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await get_stats(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { users: 10, challenges: 5, comments: 20 },
      });
    });

    it('should handle errors', async () => {
      User.count = jest.fn(() => Promise.reject(new Error('Database error')));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await get_stats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Erreur serveur' });
    });
  });

  describe('Admin Token Generation', () => {
    it('should generate a valid admin token', () => {
      const adminId = 1;
      const token = generate_admin_token(adminId);

      expect(token).toBeDefined();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded).toMatchObject({ id: adminId, role: 'admin' });
    });
  });

  describe('User Validation', () => {
    // Ensure req.params is properly defined in the tests
    const req = {
      params: { id: 1 },
    };

    it('should validate a user by admin', async () => {
      const res = mockResponse();
      const mockUser = {
        id: 1,
        is_validated: false,
        save: jest.fn().mockResolvedValue(true),
      };

      User.findByPk.mockResolvedValue(mockUser);

      await validate_user(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.is_validated).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Utilisateur validé avec succès',
        data: {
          id: 1,
          email: undefined, // Assuming email is not mocked
          is_validated: true,
        },
      });
    });

    it('should return 404 if user not found', async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();

      // Mock User.findByPk to return null
      User.findByPk.mockResolvedValue(null);

      await validate_user(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    });
  });
});