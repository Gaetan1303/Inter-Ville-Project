const nodemailer = require('nodemailer');
// Mock nodemailer AVANT d'importer le service
const sendMailMock = jest.fn().mockResolvedValue(true);
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: sendMailMock }))
}));

const { send_welcome_email, send_validation_email } = require('../../src/services/email_service');

describe('Unitaire : Envoi de mail de bienvenue', () => {
  beforeEach(() => sendMailMock.mockClear());
  it('envoie un email de bienvenue à l\'inscription', async () => {
    await send_welcome_email('test@laplateforme.io', 'Test');
    expect(sendMailMock).toHaveBeenCalled();
    expect(sendMailMock.mock.calls[0][0].to).toBe('test@laplateforme.io');
    expect(sendMailMock.mock.calls[0][0].subject).toMatch(/bienvenue/i);
  });
});

describe('Unitaire : Envoi de mail de validation', () => {
  beforeEach(() => sendMailMock.mockClear());
  it('envoie un email de validation après validation admin', async () => {
    await send_validation_email('test@laplateforme.io', 'Test');
    expect(sendMailMock).toHaveBeenCalled();
    expect(sendMailMock.mock.calls[0][0].to).toBe('test@laplateforme.io');
    expect(sendMailMock.mock.calls[0][0].subject).toMatch(/validé/i);
  });
});
