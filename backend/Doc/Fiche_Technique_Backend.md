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
