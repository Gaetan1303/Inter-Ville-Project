const Participation = require('../models/Participation');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Supprimer une participation
exports.deleteParticipation = async (req, res) => {
  try {
    const { participationId } = req.params;
    const user_id = req.user.id;
    const participation = await Participation.findByPk(participationId);
    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation introuvable' });
    }
    // Optionnel : vérifier que l'utilisateur est bien le propriétaire ou admin
    if (participation.user_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Non autorisé à supprimer cette participation' });
    }
    await participation.destroy();
    res.status(200).json({ success: true, message: 'Participation supprimée avec succès' });
  } catch (err) {
    console.error('[Participation] Erreur serveur (deleteParticipation):', err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message
    });
  }
};

// Participer à un challenge
exports.createParticipation = async (req, res) => {
  try {
    console.log('[Participation] Données reçues:', req.body); // Ajout du log
    const { challenge_id } = req.body;
    const user_id = req.user.id;

    if (!challenge_id) {
      console.log('[Participation] Erreur: Challenge requis'); // Log pour déboguer
      return res.status(400).json({ success: false, message: 'Challenge requis' });
    }
    // Vérifier que le challenge existe
    const challenge = await Challenge.findByPk(challenge_id);
    if (!challenge) {
      // Log supprimé pour la production
      return res.status(404).json({ success: false, message: 'Challenge introuvable' });
    }
    // Vérifier l'unicité de la participation
    const existing = await Participation.findOne({ where: { user_id, challenge_id } });
    if (existing) {
      // Log supprimé pour la production
      return res.status(409).json({ success: false, message: 'Déjà inscrit à ce challenge' });
    }
    const participation = await Participation.create({ user_id, challenge_id });
    // Log supprimé pour la production
    res.status(201).json({ success: true, message: 'Participation enregistrée avec succès', data: participation });
  } catch (err) {
    console.error('[Participation] Erreur serveur (createParticipation):', err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message
    });
  }
};

// Participations d'un utilisateur
exports.getParticipationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Log supprimé pour la production
    const participations = await Participation.findAll({
      where: { user_id: userId },
      include: [{ model: Challenge, as: 'challenge' }]
    });
    res.status(200).json({ success: true, data: participations });
  } catch (err) {
    console.error('[Participation] Erreur serveur (getParticipationsByUser):', err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message
    });
  }
};

// Participations à un challenge
exports.getParticipationsByChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    // Log supprimé pour la production
    const participations = await Participation.findAll({
      where: { challenge_id: id },
      include: [{ model: User, attributes: { exclude: ['password'] } }]
    });
    res.status(200).json({ success: true, data: participations });
  } catch (err) {
    console.error('[Participation] Erreur serveur (getParticipationsByChallenge):', err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message
    });
  }
};
