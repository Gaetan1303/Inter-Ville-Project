// Mock complet de nodemailer avant toute importation
const sendMailMock = jest.fn().mockResolvedValue({
  messageId: 'test-message-id'
});

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: sendMailMock
  }))
}));

// Importer APRÈS le mock
const { send_welcome_email, send_validation_email } = require('../../src/services/email_service');

describe('Tests unitaires des services email', () => {
  beforeEach(() => {
    sendMailMock.mockClear();
  });

  describe('Envoi de mail de bienvenue', () => {
    it('envoie un email de bienvenue à l\'inscription', async () => {
      await send_welcome_email('test@laplateforme.io', 'Test');
      
      // Vérifier que sendMail a été appelé
      expect(sendMailMock).toHaveBeenCalledTimes(1);
      
      // Vérifier les paramètres de l'email
      const callArgs = sendMailMock.mock.calls[0][0];
      expect(callArgs.to).toBe('test@laplateforme.io');
      expect(callArgs.subject).toContain('Bienvenue');
      expect(callArgs.text).toContain('Test');
    });
  });

  describe('Envoi de mail de validation', () => {
    it('envoie un email de validation après validation admin', async () => {
      await send_validation_email('test@laplateforme.io', 'Test');
      
      // Vérifier que sendMail a été appelé
      expect(sendMailMock).toHaveBeenCalledTimes(1);
      
      // Vérifier les paramètres de l'email
      const callArgs = sendMailMock.mock.calls[0][0];
      expect(callArgs.to).toBe('test@laplateforme.io');
      expect(callArgs.subject).toContain('validé');
      expect(callArgs.html).toContain('Test');
    });
  });
});
