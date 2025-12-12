// Upload d'une image de challenge
exports.uploadChallengeImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Aucun fichier envoyé' });
  }
  // Retourne le chemin relatif à stocker dans la BDD
  const imagePath = `/uploads/challenges/${req.file.filename}`;
  res.status(201).json({ success: true, image: imagePath });
};
const Challenge = require('../models/Challenge');

// Liste des challenges avec filtres
exports.getChallenges = async (req, res) => {
  try {
    const filters = req.query; // Récupère les filtres depuis les paramètres de requête
    const challenges = await Challenge.findAll({ where: filters });
    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Détail d'un challenge
exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Création d'un challenge
exports.createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Modification d'un challenge
exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    await challenge.update(req.body);
    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Suppression d'un challenge
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    await challenge.destroy();
    res.status(200).json({ success: true, message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};