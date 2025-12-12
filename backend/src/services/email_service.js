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
    // Email de bienvenue envoyé (log supprimé pour sécurité)
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
        <div style="font-family: Arial, sans-serif; line-height:1.4; color:#333;">
          <h2>Bonjour ${first_name || ''},</h2>
          <p>Votre compte sur <strong>CDPI Network</strong> a été validé par un administrateur.</p>
          <p>Vous pouvez désormais vous connecter et profiter de toutes les fonctionnalités : proposer des challenges, commenter et participer.</p>
          <p>Bonne découverte 👋</p>
          <hr />
          <small>Si vous n'avez pas créé de compte, ignorez cet email ou contactez l'administrateur.</small>
        </div>
      `
    };

    await transporter.sendMail(mail_options);
    // Email de validation envoyé (log supprimé pour sécurité)
  } catch (error) {
    console.error(' Erreur lors de l\'envoi de l\'email de validation:', error.message);
  }
};

module.exports = {
  send_welcome_email,
  send_validation_email
};
