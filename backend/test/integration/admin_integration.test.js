const request = require('supertest');
const app = require('../../src/app');

describe('Admin Integration Tests', () => {
  let adminToken;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpassword',
      });

    adminToken = loginResponse.body.token;
  });

  it('doit récupérer les utilisateurs en attente', async () => {
    const response = await request(app)
      .get('/admin/users/pending')
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('Réponse utilisateurs en attente:', response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('doit valider un utilisateur', async () => {
    const response = await request(app)
      .put('/admin/users/1/validate')
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('Réponse validation utilisateur:', response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Utilisateur validé avec succès');
  });

  it('doit supprimer un challenge', async () => {
    const response = await request(app)
      .delete('/admin/challenges/1')
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('Réponse suppression challenge:', response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Challenge supprimé avec succès');
  });
});