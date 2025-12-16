const fs = require('fs');
const path = require('path');

/**
 * Sauvegarde un fichier uploadé (base64 ou buffer) dans le dossier cible.
 * @param {string} base64OrBuffer - Données du fichier (base64 ou Buffer)
 * @param {string} filename - Nom du fichier à sauvegarder
 * @param {string} folder - Dossier cible (relatif au dossier uploads)
 * @returns {string} Chemin relatif du fichier sauvegardé (pour la BDD)
 */

function saveUpload(base64OrBuffer, filename, folder) {
  try {
    let fileData = base64OrBuffer;
    if (typeof base64OrBuffer === 'string') {
      // Si c'est un dataURL, extraire la partie base64
      if (base64OrBuffer.startsWith('data:')) {
        fileData = base64OrBuffer.split(',')[1];
      }
      fileData = Buffer.from(fileData, 'base64');
    }
    const destDir = path.join(__dirname, '../../uploads', folder);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log(`[UPLOAD] Dossier créé : ${destDir}`);
    }
    const dest = path.join(destDir, filename);
    fs.writeFileSync(dest, fileData);
    console.log(`[UPLOAD] Fichier sauvegardé : ${dest}`);
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error('[UPLOAD] Erreur lors de la sauvegarde du fichier :', error.message);
    throw new Error('Erreur lors de l\'upload du fichier');
  }
}

module.exports = { saveUpload };
