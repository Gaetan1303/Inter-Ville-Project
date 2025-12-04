const nodemailer = require('nodemailer');

/**
 * Configuration du transporteur d'emails avec Mailhog pour le développement
 * En production, il faudra utiliser un vrai service SMTP
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 1025,
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  } : undefined
});

/**
 * Envoie un email de bienvenue à un nouvel utilisateur inscrit
 * @param {string} email - Adresse email du destinataire
 * @param {string} first_name - Prénom de l'utilisateur
 * @returns {Promise<void>}
 */
const send_welcome_email = async (email, first_name) => {
  try {
    const mail_options = {
      from: process.env.EMAIL_FROM || 'noreply@laplateforme.io',
      to: email,
      subject: 'Bienvenue sur CDPI Network',
    };

    await transporter.sendMail(mail_options);
    console.log(` Email de bienvenue envoyé à ${email}`);
  } catch (error) {
    console.error(' Erreur lors de l\'envoi de l\'email de bienvenue:', error.message);
    // On ne bloque pas l'inscription si l'email échoue
  }
};

/**
 * Envoie un email de validation de compte à un utilisateur
 * @param {string} email - Adresse email du destinataire
 * @param {string} first_name - Prénom de l'utilisateur
 * @returns {Promise<void>}
 */
const send_validation_email = async (email, first_name) => {
  try {
    const mail_options = {
      from: process.env.EMAIL_FROM || 'noreply@laplateforme.io',
      to: email,
      subject: 'Votre compte CDPI Network a été validé ',
      html: `
       
      `
    };

    await transporter.sendMail(mail_options);
    console.log(` Email de validation envoyé à ${email}`);
  } catch (error) {
    console.error(' Erreur lors de l\'envoi de l\'email de validation:', error.message);
  }
};

module.exports = {
  send_welcome_email,
  send_validation_email
};
