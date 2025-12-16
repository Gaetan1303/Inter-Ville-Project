// Fichier de setup global pour Jest
// Centralise les mocks, le nettoyage de la base, etc.

// Exemple : mock global de nodemailer (évite les vrais envois d'emails)
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: jest.fn().mockResolvedValue(true) }))
}));

// Nettoyage de la base ou reset des mocks avant chaque test (optionnel)
beforeEach(() => {
  jest.clearAllMocks();
});

// Vous pouvez ajouter ici d'autres initialisations globales pour les tests
