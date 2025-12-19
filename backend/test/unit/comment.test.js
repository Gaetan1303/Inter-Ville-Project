const request = require('supertest');
const app = require('../../src/app');

let user, token, challenge, comment;

describe('Commentaires - CRUD', () => {
  beforeAll(async () => {
    // Données mockées
    user = {
      id: 1,
      email: 'test@laplateforme.io',
      first_name: 'Test',
      last_name: 'User',
      city: 'Marseille',
      promo: '2025',
      is_validated: true,
      role: 'user'
    };

    const jwt = require('jsonwebtoken');
    token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1h' });
    
    challenge = {
      id: 1,
      title: 'Défi test',
      description: 'Un super défi',
      category: 'Code',
      difficulty: 'easy',
      status: 'active',
      created_by: user.id,
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 jours
    };
  });

  it('Ajoute un commentaire', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Premier commentaire',
        challenge_id: challenge.id
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe('Premier commentaire');
    comment = res.body;
  });

  it('Récupère les commentaires du challenge', async () => {
    const res = await request(app)
      .get(`/api/comments/challenge/${challenge.id}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].content).toBe('Premier commentaire');
  });

  it('Supprime le commentaire', async () => {
    const res = await request(app)
      .delete(`/api/comments/${comment.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/supprimé/i);
  });
    // ...
});
