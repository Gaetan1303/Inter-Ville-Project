# Fiche Technique – Backend Inter-Ville-Project

## Présentation Générale
Le backend de l’application Inter-Ville-Project est une API REST Node.js/Express, connectée à une base de données MySQL via Sequelize. Il gère l’authentification, la gestion des challenges, la modération, les commentaires, et l’administration, avec une attention particulière à la sécurité et à la robustesse du code.

## Stack Technique
- **Node.js** (Express)
- **Sequelize** (ORM)
- **MySQL** (base de données)
- **JWT** (authentification)
- **bcrypt** (hash des mots de passe)
- **Jest** (tests unitaires, intégration, e2e)
- **Nodemailer** (envoi d’e-mails, mocké en test)

## Fonctionnalités Clés
- Authentification JWT (inscription, connexion, validation admin)
- Gestion des challenges (CRUD, upload, validation)
- Gestion des commentaires
- Administration (validation utilisateurs, suppression challenges/commentaires, statistiques)
- Sécurité : masquage des erreurs en production, validation des entrées, middleware d’authentification et de rôles
- WebSocket pour chat en temps réel (socket.io)

## Structure du Code
- `src/controllers/` : logique métier (admin, auth, challenge, etc.)
- `src/models/` : modèles Sequelize (User, Challenge, Comment, etc.)
- `src/services/` : services (e-mail, token, upload)
- `src/middlewares/` : middlewares Express (auth, rôles, validation)
- `src/routes/` : routes Express
- `test/` : tests unitaires, intégration, e2e

## Sécurité & Qualité
- Masquage des messages d’erreur sensibles en production
- Hashage des mots de passe avec bcrypt
- Validation stricte des entrées (middlewares)
- Tests automatisés couvrant les cas critiques
- Mocks pour les dépendances externes (e-mail, DB)

## Démonstration (scénario)
1. **Inscription & Connexion**
   - Un utilisateur s’inscrit, reçoit un e-mail de validation (mocké en test)
   - Connexion avec JWT sécurisé
2. **Création de Challenge**
   - Un utilisateur connecté crée un challenge (upload possible)
   - Le challenge apparaît dans la liste après validation admin
3. **Modération & Administration**
   - Un admin valide un utilisateur ou supprime un challenge/commentaire
   - Statistiques accessibles pour l’admin
4. **Commentaires & Chat**
   - Les utilisateurs commentent un challenge
   - Chat temps réel via WebSocket
5. **Sécurité**
   - Tentative d’accès non autorisé : message d’erreur générique en production
   - Les tests automatisés valident la robustesse du code

## Lancement & Tests
- `npm install` dans le dossier backend
- Configurer la base MySQL (voir `src/config/database.js`)
- `npm start` pour lancer le serveur
- `npm test` pour exécuter tous les tests (unitaires, intégration, e2e)

## Points Forts
- Code modulaire, maintenable, conforme aux standards Node.js
- Sécurité adaptée à la production
- Couverture de tests élevée
- Facile à déployer et à étendre

---

**Contact technique :** Mimine



---

## Plan : Présentation Orale du Backend Inter-Ville-Project

### 1. Introduction (1-2 minutes)
- **Objectif** : Présenter le backend de l'application Inter-Ville-Project.
- **Contexte** : API REST Node.js/Express pour gérer les challenges inter-villes.
- **Public cible** : Jury technique, développeurs, ou stakeholders.

### 2. Stack Technique (2 minutes)
- **Technologies principales** :
  - Node.js (Express) pour l'API REST.
  - Sequelize comme ORM pour MySQL.
  - JWT pour l'authentification sécurisée.
  - Jest pour les tests (unitaires, intégration, e2e).
  - Nodemailer pour l'envoi d'e-mails (mocké en test).
- **Commandes associées** :
  - Installation des dépendances : `npm install`
  - Lancement du serveur : `npm start`
  - Exécution des tests : `npm test`

### 3. Fonctionnalités Clés (3-4 minutes)
- **Authentification** :
  - Inscription, connexion, validation admin.
  - Hashage des mots de passe avec bcrypt.
- **Gestion des challenges** :
  - CRUD complet, validation des entrées, upload de fichiers.
- **Commentaires et Chat** :
  - Ajout de commentaires, réponses, chat en temps réel via WebSocket.
- **Administration** :
  - Validation des utilisateurs, suppression des challenges/commentaires, statistiques.
- **Sécurité** :
  - Masquage des erreurs sensibles, validation stricte des entrées.
- **Commandes associées** :
  - Tester les routes d'authentification : `curl -X POST http://localhost:3000/auth/register`
  - Tester les challenges : `curl -X GET http://localhost:3000/challenges`

### 4. Démonstration Technique (5-6 minutes)
- **Scénario utilisateur complet** :
  1. Inscription d’un utilisateur.
  2. Validation par un admin.
  3. Connexion et création d’un challenge.
  4. Ajout d’un commentaire.
  5. Suppression/modération par un admin.
- **Commandes associées** :
  - Lancer les tests E2E : `npm test -- test/e2e/final_e2e.test.js`
  - Vérifier les logs : `tail -f logs/backend.log`

### 5. Structure du Code (2 minutes)
- **Organisation** :
  - `src/controllers/` : Logique métier.
  - `src/models/` : Modèles Sequelize.
  - `src/services/` : Services (e-mail, token, upload).
  - `src/middlewares/` : Authentification, rôles, validation.
  - `test/` : Tests automatisés.
- **Commandes associées** :
  - Vérifier les migrations Sequelize : `npx sequelize-cli db:migrate`
  - Synchroniser la base : `npx sequelize-cli db:sync`

### 6. Sécurité et Qualité (2 minutes)
- **Mesures de sécurité** :
  - Hashage des mots de passe avec bcrypt.
  - Validation stricte des entrées.
  - Middleware d’authentification et de rôles.
- **Qualité** :
  - Tests automatisés couvrant les cas critiques.
  - Mocks pour les dépendances externes (e-mail, DB).
- **Commandes associées** :
  - Lancer les tests unitaires : `npm test -- test/unit/`
  - Vérifier la couverture des tests : `npm test -- --coverage`

### 7. Points Forts et Conclusion (1-2 minutes)
- **Points forts** :
  - Code modulaire et maintenable.
  - Sécurité adaptée à la production.
  - Couverture de tests élevée.
  - Facilité de déploiement et d’extension.
- **Conclusion** :
  - Le backend est prêt pour une utilisation en production.
  - Questions et réponses.

### Rappels Techniques
- **Configuration de la base MySQL** :
  - Vérifier `src/config/database.js` pour les paramètres.
  - Commande pour lancer MySQL : `mysql -u root -p`
- **Variables d’environnement** :
  - `.env` pour les secrets (JWT_SECRET, DB_PASSWORD, etc.).
  - Exemple : `JWT_SECRET=monsecret npm start`
- **Swagger** :
  - Documentation accessible à : `http://localhost:3000/api-docs/`
