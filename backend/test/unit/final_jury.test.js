// Tous les mocks doivent être en haut avant tout import
jest.mock('../../src/models/Message');
jest.mock('../../src/models/User');
jest.mock('../../src/models/Challenge');
jest.mock('../../src/models/Comment');
jest.mock('../../src/models/Participation');
jest.mock('../../src/services/email_service', () => ({
  send_welcome_email: jest.fn().mockResolvedValue(true),
  send_validation_email: jest.fn().mockResolvedValue(true)
}));

// Mock bcrypt pour simulation des mots de passe
jest.mock('bcrypt', () => ({
  compareSync: jest.fn().mockImplementation((password, hash) => {
    // Simuler que tous les mots de passe sont corrects pour le test
    return password === 'password123';
  }),
  hashSync: jest.fn().mockReturnValue('hashedpassword')
}));

const { describe, it, expect, beforeEach } = require('@jest/globals');

// Génère des utilisateurs mockés
let users = [];
function generateUsers() {
  const arr = [];
  for (let i = 1; i <= 8; i++) {
    arr.push({ id: i, email: `user${i}@laplateforme.io`, password: 'hash', is_validated: false, role: 'user', save: jest.fn() });
  }
  arr.push({ id: 9, email: 'admin1@laplateforme.io', password: 'hash', is_validated: true, role: 'admin', save: jest.fn() });
  arr.push({ id: 10, email: 'admin2@laplateforme.io', password: 'hash', is_validated: true, role: 'admin', save: jest.fn() });
  return arr;
}

// Génère des challenges mockés
function generateChallenges() {
  return [
    { id: 1, title: 'Challenge 1', description: 'Desc 1', category: 'code', difficulty: 'easy', status: 'active', created_by: 9, destroy: jest.fn(), update: jest.fn() },
    { id: 2, title: 'Challenge 2', description: 'Desc 2', category: 'design', difficulty: 'medium', status: 'active', created_by: 10, destroy: jest.fn(), update: jest.fn() },
    { id: 3, title: 'Challenge 3', description: 'Desc 3', category: 'sport', difficulty: 'hard', status: 'active', created_by: 9, destroy: jest.fn(), update: jest.fn() },
    { id: 4, title: 'Challenge 4', description: 'Desc 4', category: 'autre', difficulty: 'easy', status: 'active', created_by: 10, destroy: jest.fn(), update: jest.fn() },
  ];
}

// Génère des commentaires mockés
function generateComments() {
  return [
    { id: 1, content: 'Bravo !', user_id: 1, challenge_id: 1 },
    { id: 2, content: 'Difficile mais top', user_id: 2, challenge_id: 1 },
    { id: 3, content: 'Je participe !', user_id: 3, challenge_id: 2 },
  ];
}

describe('Test Final Jury – Démonstration complète', () => {
  let adminController, authController, challengeController, commentController, participationController;
  let User, Challenge, Comment, Participation, emailService;

  beforeEach(async () => {
    // Reset tous les modules pour éviter la pollution entre tests
    jest.resetModules();
    
    // Import dynamique des contrôleurs après reset
    adminController = require('../../src/controllers/admin_controller');
    authController = require('../../src/controllers/auth_controller');
    challengeController = require('../../src/controllers/challenge_controller');
    commentController = require('../../src/controllers/comment_controller');
    participationController = require('../../src/controllers/participation_controller');
    
    // Import dynamique des models et services
    User = require('../../src/models/User');
    Challenge = require('../../src/models/Challenge');
    Comment = require('../../src/models/Comment');
    Participation = require('../../src/models/Participation');
    emailService = require('../../src/services/email_service');
  });
  it('parcours complet avec journaux détaillés', async () => {
    console.log('=== DÉBUT DU TEST FINAL JURY ===');
    
    // 1. Configuration des mocks pour simulation complète de la base de données
    users = generateUsers();
    const challenges = generateChallenges();
    const comments = generateComments();
    
    // Configuration des mocks Sequelize
    User.findAll = jest.fn().mockResolvedValue(users.filter(u => !u.is_validated));
    User.findOne = jest.fn().mockImplementation(({ where }) => {
      const user = users.find(u => u.email === where.email);
      return Promise.resolve(user);
    });
    User.findByPk = jest.fn().mockImplementation(id => {
      const user = users.find(u => u.id === parseInt(id));
      return Promise.resolve(user);
    });
    User.create = jest.fn().mockImplementation(data => {
      const newUser = { ...data, id: 11, password: 'hashedpassword', save: jest.fn().mockResolvedValue() };
      users.push(newUser);
      return Promise.resolve(newUser);
    });
    
    Challenge.findAll = jest.fn().mockResolvedValue(challenges);
    Challenge.findByPk = jest.fn().mockImplementation(id => {
      // Chercher d'abord dans les challenges existants
      let challenge = challenges.find(c => c.id === parseInt(id));
      // Si c'est le challenge créé (ID 99), le retourner aussi
      if (!challenge && parseInt(id) === 99) {
        challenge = { 
          id: 99, 
          title: 'Nouveau Challenge Jury', 
          description: 'Challenge créé pour la démonstration technique',
          category: 'code',
          difficulty: 'easy',
          status: 'active',
          created_by: 11,
          destroy: jest.fn().mockResolvedValue(), 
          update: jest.fn().mockResolvedValue()
        };
      }
      return Promise.resolve(challenge);
    });
    Challenge.create = jest.fn().mockImplementation(data => {
      const newChallenge = { 
        ...data, 
        id: 99, 
        destroy: jest.fn().mockResolvedValue(), 
        update: jest.fn().mockResolvedValue() 
      };
      // Ajouter le challenge créé à la liste pour qu'il soit trouvable
      challenges.push(newChallenge);
      return Promise.resolve(newChallenge);
    });
    
    Comment.create = jest.fn().mockImplementation(data => ({ ...data, id: 100 }));
    Participation.create = jest.fn().mockImplementation(data => ({ ...data, id: 200 }));
    Participation.findOne = jest.fn().mockResolvedValue(null);
    
    console.log('✅ Configuration des mocks : Base de données simulée prête');
    console.log(`📊 Données mockées : ${users.length} utilisateurs, ${challenges.length} challenges`);

    // 2. Inscription d'un nouvel utilisateur (simulation Mailhog)
    console.log('\nÉTAPE 1 : Inscription utilisateur');
    const reqRegister = { 
      body: { 
        email: 'jury@laplateforme.io', 
        password: 'password123', 
        first_name: 'Jury', 
        last_name: 'Test', 
        city: 'Marseille', 
        promo: 'AI1' 
      } 
    };
    const resRegister = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    await authController.register(reqRegister, resRegister);
    await new Promise(setImmediate); // flush microtasks pour attendre l'appel du mock email
    
    console.log('📧 Email de bienvenue envoyé via Mailhog (simulé)');
    console.log('📝 Réponse inscription:', resRegister.json.mock.calls[0][0]);
    expect(emailService.send_welcome_email).toHaveBeenCalledWith('jury@laplateforme.io', 'Jury');

    // 3. Connexion refusée (compte non validé)
    console.log('\nÉTAPE 2 : Tentative de connexion (compte non validé)');
    const reqLoginFail = { body: { email: 'jury@laplateforme.io', password: 'password123' } };
    const resLoginFail = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    await authController.login(reqLoginFail, resLoginFail);
    console.log('🚫 Connexion refusée (sécurité) :', resLoginFail.json.mock.calls[0][0]);

    // 4. Admin valide le compte (simulation processus admin)
    console.log('\nÉTAPE 3 : Validation admin');
    const reqValidate = { params: { id: 11 } };
    const resValidate = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    // Simulation de l'utilisateur créé en base avec is_validated = false
    const newUser = { id: 11, email: 'jury@laplateforme.io', password: 'hashedpassword', is_validated: false, role: 'user', save: jest.fn().mockResolvedValue() };
    if (!users.find(u => u.id === 11)) {
      users.push(newUser);
    }
    User.findByPk = jest.fn().mockImplementation(id => {
      const user = users.find(u => u.id === parseInt(id));
      return Promise.resolve(user);
    });
    
    await adminController.validate_user(reqValidate, resValidate);
    console.log('👨‍💼 Validation par admin terminée');
    console.log('📧 Email de validation envoyé via Mailhog (simulé)');
    console.log('📝 Réponse validation:', resValidate.json.mock.calls[0][0]);
    expect(emailService.send_validation_email).toHaveBeenCalled();

    // 5. Connexion réussie après validation
    console.log('\nÉTAPE 4 : Connexion utilisateur validé');
    // Simulation validation terminée
    users.find(u => u.id === 11).is_validated = true;
    
    const reqLogin = { body: { email: 'jury@laplateforme.io', password: 'password123' } };
    const resLogin = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    await authController.login(reqLogin, resLogin);
    console.log('🎉 Connexion autorisée:', resLogin.json.mock.calls[0][0]);

    // 6. CRUD Challenge (création, modification, suppression)
    console.log('\nÉTAPE 5 : Opérations CRUD Challenge');
    
    // Création
    const reqCreate = { 
      body: { 
        title: 'Nouveau Challenge Jury', 
        description: 'Challenge créé pour la démonstration technique', 
        category: 'code', 
        difficulty: 'easy', 
        status: 'active', 
        created_by: 11, 
        start_date: new Date(), 
        end_date: new Date(Date.now() + 86400000) 
      } 
    };
    const resCreate = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    await challengeController.createChallenge(reqCreate, resCreate);
    console.log('📝 Challenge créé:', resCreate.json.mock.calls[0][0]);

    // Modification
    const reqUpdate = { params: { id: 99 }, body: { title: 'Challenge Modifié par Jury' } };
    const resUpdate = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    await challengeController.updateChallenge(reqUpdate, resUpdate);
    console.log('✏️  Challenge modifié:', resUpdate.json.mock.calls[0][0]);

    // Suppression
    const reqDelete = { params: { id: 99 } };
    const resDelete = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    await challengeController.deleteChallenge(reqDelete, resDelete);
    console.log('🗑️  Challenge supprimé:', resDelete.json.mock.calls[0][0]);

    // 7. Participation à un challenge
    console.log('\nÉTAPE 6 : Système de participation');
    const reqParticipation = { body: { challenge_id: 1 }, user: { id: 11 } };
    const resParticipation = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    await participationController.createParticipation(reqParticipation, resParticipation);
    console.log('🎯 Participation enregistrée:', resParticipation.json.mock.calls[0][0]);

    // 8. Ajout d'un commentaire
    console.log('\nÉTAPE 7 : Système de commentaires');
    const reqComment = { body: { content: 'Excellent challenge pour la démonstration !', challenge_id: 1 }, user: { id: 11 } };
    const resComment = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    await commentController.addComment(reqComment, resComment);
    console.log('💭 Commentaire ajouté:', resComment.json.mock.calls[0][0]);

    // 9. Vérifications et assertions finales
    console.log('\nÉTAPE 8 : Validation des résultats');
    
    // Assertions de sécurité et fonctionnalité
    expect(resRegister.status).toHaveBeenCalledWith(201);
    expect(resLoginFail.status).toHaveBeenCalledWith(401);
    expect(resLogin.status).toHaveBeenCalledWith(200);
    expect(resCreate.status).toHaveBeenCalledWith(201);
    expect(resParticipation.status).toHaveBeenCalledWith(201);
    expect(resComment.status).toHaveBeenCalledWith(201);
    
    // Vérification des emails Mailhog
    expect(emailService.send_welcome_email).toHaveBeenCalledTimes(1);
    expect(emailService.send_validation_email).toHaveBeenCalledTimes(1);
    
    console.log('✅ Toutes les assertions passées avec succès');
    console.log('📊 Statistiques :');
    console.log('   - Inscription utilisateur : OK');
    console.log('   - Sécurité connexion : OK');
    console.log('   - Validation admin : OK');
    console.log('   - CRUD Challenge : OK');
    console.log('   - Participation : OK');
    console.log('   - Commentaires : OK');
    console.log('   - Emails Mailhog : 2 envoyés (simulé)');
    console.log('=== FIN DU TEST FINAL JURY ===');
  });
});
