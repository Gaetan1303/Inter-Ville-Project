const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../src/app');

describe('Upload image challenge', () => {
  const testFile = path.join(__dirname, 'test-image.png');
  const uploadsDir = path.join(__dirname, '../../uploads/challenges');
  const filename = 'test-image-upload.png';

  beforeAll(() => {
    // Crée un petit fichier image factice
    fs.writeFileSync(testFile, Buffer.from([137,80,78,71,13,10,26,10])); // PNG header
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  });

  afterAll(() => {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    const uploaded = path.join(uploadsDir, filename);
    if (fs.existsSync(uploaded)) fs.unlinkSync(uploaded);
  });

  it('doit uploader une image en base64', async () => {
    const data = fs.readFileSync(testFile).toString('base64');
    const res = await request(app)
      .post('/challenges/upload-image')
      .send({ filename, data })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.image).toContain(filename);
    // Vérifie que le fichier a bien été créé
    expect(fs.existsSync(path.join(uploadsDir, filename))).toBe(true);
  });
});
