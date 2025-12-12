# Démo : Envoi d'un mail avec Mailhog (SMTP)

## Objectif
Envoyer un mail de test via Mailhog pour vérifier la configuration SMTP du projet.

## Prérequis
- Mailhog doit être lancé sur la machine (SMTP sur `localhost:1025`, interface web sur `http://localhost:8025`).
- `curl` doit être installer.
- `golang` doit être installer.

## Commande à exécuter
```bash
curl --url 'smtp://localhost:1025' \
  --mail-from 'noreply@laplateforme.io' \
  --mail-rcpt 'destinataire@exemple.com' \
  --upload-file - <<EOF
From: noreply@laplateforme.io
To: destinataire@exemple.com
Subject: Bienvenu à vous, humain

Je veux des croquettes pour Noël !
EOF
```

- Remplace `destinataire@exemple.com` par l'adresse de destination souhaitée.
- Le mail apparaîtra dans l'interface web de Mailhog.

## Résultat attendu
- Un mail avec le sujet "Bienvenu à vous, humain" et le corps "Je veux des croquettes pour Noël !" s'affiche dans Mailhog.


## Test 
```bash
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
```