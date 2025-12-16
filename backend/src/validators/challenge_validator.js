// backend/src/validators/challenge_validator.js

/**
 * Middleware de validation pour la création/modification d'un challenge
 * Vérifie la présence et la validité des champs principaux
 */
function validateChallenge(req, res, next) {
  const { title, description, start_date, end_date } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Le titre est requis (min. 3 caractères)');
  }
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('La description est requise (min. 10 caractères)');
  }
  if (!start_date || isNaN(Date.parse(start_date))) {
    errors.push('La date de début est invalide ou manquante');
  }
  if (!end_date || isNaN(Date.parse(end_date))) {
    errors.push('La date de fin est invalide ou manquante');
  }
  if (start_date && end_date && Date.parse(start_date) > Date.parse(end_date)) {
    errors.push('La date de début doit précéder la date de fin');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  next();
}

module.exports = { validateChallenge };
