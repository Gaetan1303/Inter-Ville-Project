const bcrypt = require('bcrypt');

describe('Validation de bcrypt.compare', () => {
  it("devrait retourner 'true' pour un mot de passe valide et un hash correspondant", async () => {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10); // Génération dynamique du hash

    const isMatch = await bcrypt.compare(password, hash);

    expect(isMatch).toBe(true);
  });

  it("devrait retourner 'false' pour un mot de passe invalide", async () => {
    const password = 'wrongpassword';
    const hash = await bcrypt.hash('password123', 10); // Génération dynamique du hash pour un mot de passe différent

    const isMatch = await bcrypt.compare(password, hash);

    expect(isMatch).toBe(false);
  });

  it('devrait valider le mot de passe et le hash statiques', () => {
    const password = 'password123';
    const hash = bcrypt.hashSync(password, 10);

    const isMatch = bcrypt.compareSync(password, hash);
    console.log('Test unitaire: Résultat de bcrypt.compareSync:', isMatch);

    expect(isMatch).toBe(true);
  });
});