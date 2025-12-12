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

  it('should fetch pending users', async () => {
    const response = await request(app)
      .get('/admin/users/pending')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should validate a user', async () => {
    const response = await request(app)
      .put('/admin/users/1/validate')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Utilisateur validé avec succès');
  });

  it('should delete a challenge', async () => {
    const response = await request(app)
      .delete('/admin/challenges/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Challenge supprimé avec succès');
  });
});