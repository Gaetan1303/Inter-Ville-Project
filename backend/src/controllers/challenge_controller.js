// Upload d'une image de challenge
const { saveUpload } = require('../services/upload_service');
exports.uploadChallengeImage = (req, res) => {
  try {
    const { filename, data } = req.body;
    if (!filename || !data) {
      return res.status(400).json({ success: false, message: 'Paramètres manquants' });
    }
    const imagePath = saveUpload(data, filename, 'challenges');
    res.status(201).json({ success: true, image: imagePath });
  } catch (err) {
    res.status(500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message });
  }
};
const Challenge = require('../models/Challenge');
const Comment = require('../models/Comment');
const Participation = require('../models/Participation');

// Liste des challenges avec filtres
exports.getChallenges = async (req, res) => {
  try {
    const filters = req.query; // Récupère les filtres depuis les paramètres de requête
    const challenges = await Challenge.findAll({ where: filters });
    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message });
  }
};

// Détail d'un challenge
exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge introuvable' });
    }
    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message });
  }
};

// Création d'un challenge
exports.createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    res.status(400).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Erreur de validation' : error.message });
  }
};

// Modification d'un challenge
exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge introuvable' });
    }
    await challenge.update(req.body);
    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(400).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Erreur de validation' : error.message });
  }
};

// Suppression d'un challenge
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge introuvable' });
    }
    await challenge.destroy();
    res.status(200).json({ success: true, message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message });
  }
};

// Détail d'un challenge avec commentaires et participations
exports.getChallengeDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer le challenge avec ses commentaires et participations
    const challenge = await Challenge.findByPk(id, {
      include: [
        {
          model: Comment,
          as: 'comments',
        },
        {
          model: Participation,
          as: 'participations',
        },
      ],
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du détail du challenge :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
    });
  }
};