# Présentation du Projet - CDPI Network

##  Vue d'ensemble

**CDPI Network** est une plateforme web interactive permettant aux étudiants de La Plateforme_ des différentes villes de créer, participer et interagir autour de défis inter-villes.

###  Objectifs
- Créer une communauté active entre les campus
- Encourager la collaboration et la compétition saine
- Faciliter les échanges entre étudiants de différentes villes
- Offrir une plateforme d'expression et de partage

###  Public cible
Étudiants de La Plateforme_ avec une adresse email **@laplateforme.io**

---

##  Architecture Technique

### Stack Technologique

**Backend:**
- Node.js + Express.js (API REST)
- MySQL 8.0 avec Sequelize ORM
- Socket.IO (Communication temps réel)
- JWT (Authentification sécurisée)
- Mailhog (Serveur email de développement)

**Frontend:**
- React 18 (UI Library)
- React Router 6 (Navigation)
- Axios (Client HTTP)
- Socket.IO Client (WebSocket)
- CSS3 (Styling)


##  Structure du Projet

### FRONTEND (React - Pattern Component)

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       └── images/
│
├── src/
│   ├── index.js
│   ├── App.js
│   ├── App.css
│   │
│   ├── components/
│   │   ├── common/              # Composants réutilisables
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Navbar/
│   │   │   ├── Button/
│   │   │   └── Modal/
│   │   │
│   │   ├── auth/                # Authentification
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   └── ProtectedRoute/
│   │   │
│   │   ├── profile/             # Profil utilisateur
│   │   │   ├── ProfileCard/
│   │   │   ├── ProfileForm/
│   │   │   └── Avatar/
│   │   │
│   │   ├── challenges/          # Défis
│   │   │   ├── ChallengeCard/
│   │   │   ├── ChallengeList/
│   │   │   ├── ChallengeDetail/
│   │   │   ├── ChallengeForm/
│   │   │   ├── ChallengeParticipation/
│   │   │   └── ChallengeFilters/
│   │   │
│   │   ├── comments/            # Commentaires
│   │   │   ├── CommentList/
│   │   │   ├── CommentForm/
│   │   │   └── CommentCard/
│   │   │
│   │   └── chat/                # Chat temps réel
│   │       ├── ChatBox/
│   │       ├── MessageList/
│   │       ├── MessageInput/
│   │       └── UsersList/
│   │
│   ├── pages/                   # Pages de l'application
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Dashboard/
│   │   ├── Profile/
│   │   ├── Challenges/
│   │   ├── ChallengeDetails/
│   │   ├── CreateChallenge/
│   │   ├── Chat/
│   │   └── Admin/
│   │
│   ├── services/                # Services API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── challengeService.js
│   │   ├── userService.js
│   │   ├── commentService.js
│   │   └── socketService.js
│   │
│   ├── context/                 # Context API (état global)
│   │   ├── AuthContext.jsx
│   │   ├── SocketContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/                   # Custom Hooks
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   └── useDebounce.js
│   │
│   ├── utils/                   # Utilitaires
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   └── styles/                  # Styles globaux
│       ├── global.css
│       └── variables.css
│
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

### BACKEND (Express - MVC Pattern)

```
backend/
├── src/
│   ├── server.js                # Point d'entrée
│   ├── app.js                   # Configuration Express
│   │
│   ├── config/                  # Configurations
│   │   ├── database.js          # Sequelize + MySQL
│   │   ├── email.js             # Nodemailer + Mailhog
│   │   ├── env.js               # Variables d'environnement
│   │   └── socket.js            # Socket.IO
│   │
│   ├── controllers/             # Logique métier
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── challengeController.js
│   │   ├── commentController.js
│   │   ├── participationController.js
│   │   ├── chatController.js
│   │   └── adminController.js
│   │
│   ├── models/                  # Modèles Sequelize
│   │   ├── User.js
│   │   ├── Challenge.js
│   │   ├── Comment.js
│   │   ├── Participation.js
│   │   ├── Message.js
│   │   └── index.js             # Relations entre modèles
│   │
│   ├── routes/                  # Routes API
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── challengeRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── participationRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middlewares/             # Middlewares
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── validationMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── validators/              # Validation des données
│   │   ├── authValidator.js
│   │   ├── userValidator.js
│   │   ├── challengeValidator.js
│   │   └── commentValidator.js
│   │
│   ├── services/                # Services
│   │   ├── emailService.js
│   │   ├── tokenService.js
│   │   └── uploadService.js
│   │
│   ├── utils/                   # Utilitaires
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── errorTypes.js
│   │
│   └── socket/                  # Handlers Socket.IO
│       ├── socketHandler.js
│       ├── chatHandler.js
│       └── notificationHandler.js
│
├── database/
│   └── init.sql                 # Schéma MySQL
│
├── uploads/                     # Fichiers uploadés
│   ├── avatars/
│   └── challenges/
│
├── tests/                       # Tests
│   ├── unit/
│   └── integration/
│
├── package.json
├── .env
├── .gitignore
├── .dockerignore
└── README.md
```

---

##  Base de Données MySQL

### Schéma des Tables

**users**
- id (PK)
- email (unique, @laplateforme.io)
- password (hashed)
- firstName, lastName
- city
- avatar
- role (user/admin)
- isValidated (boolean)
- timestamps
- promo : string 

**challenges**
- id (PK)
- title
- description
- category
- difficulty (easy/medium/hard)
- status (active/completed/cancelled)
- startDate, endDate
- image
- createdBy (FK → users)
- timestamps

**participations**
- id (PK)
- userId (FK → users)
- challengeId (FK → challenges)
- status (registered/in_progress/completed/abandoned)
- score
- timestamps

**comments**
- id (PK)
- content
- userId (FK → users)
- challengeId (FK → challenges)
- parentId (FK → comments, pour les réponses)
- timestamps

**messages**
- id (PK)
- content
- senderId (FK → users)
- receiverId (FK → users)
- roomId
- isRead (boolean)
- createdAt

---

##  Fonctionnalités

### MVP (Minimum Viable Product)

####  Authentification
- Inscription avec email @laplateforme.io
- Connexion sécurisée (JWT)
- Validation du compte par admin obligatoire
- Déconnexion

####  Gestion des Challenges
- Créer un challenge (titre, description, ville, catégorie, difficulté, dates)
- Liste des challenges avec filtres (ville, catégorie, difficulté, status)
- Détail d'un challenge avec toutes les informations
- Participation à un challenge
- Modifier/Supprimer son challenge (créateur uniquement)

####  Système de Commentaires
- Ajouter un commentaire sur un challenge
- Répondre à un commentaire
- Supprimer son commentaire
- Affichage hiérarchique des réponses

####  Profil Utilisateur
- Afficher son profil (infos, avatar, ville)
- Modifier son profil
- Upload d'avatar
- Liste de ses challenges créés
- Liste de ses participations

####  Chat Temps Réel (Socket.IO)
- Salon de discussion général
- Envoi/réception de messages instantanés
- Liste des utilisateurs connectés
- Notification de nouveaux messages

####  Administration
- Dashboard admin
- Liste des comptes en attente de validation
- Valider/Refuser un compte
- Modérer les contenus (challenges, commentaires)
- Statistiques globales

---

##  Sécurité

### Mesures Implémentées

1. **Authentification**
   - JWT (JSON Web Token)
   - Refresh tokens
   - Expiration des sessions

2. **Autorisation**
   - Middleware de vérification des rôles
   - Routes protégées
   - Validation côté serveur

3. **Protection des données**
   - Hash des mots de passe (bcrypt)
   - Validation stricte des emails (@laplateforme.io)
   - Sanitization des entrées utilisateur
   - Helmet.js pour les headers HTTP

4. **Rate Limiting**
   - Limitation des requêtes par IP
   - Protection contre les attaques par force brute

5. **Uploads**
   - Validation des types de fichiers
   - Limitation de la taille des fichiers
   - Stockage sécurisé

---

##  Rôles et Permissions

### User (Utilisateur)
- Créer des challenges
- Participer aux challenges
- Commenter
- Utiliser le chat
- Gérer son profil

### Admin (Administrateur)
- Toutes les permissions User
- Valider les comptes
- Modérer les contenus
- Supprimer challenges/commentaires
- Accès aux statistiques

---

##  API REST Endpoints

### Authentification
```
POST   /auth/register       # Inscription
POST   /auth/login          # Connexion
POST   /auth/logout         # Déconnexion
GET    /auth/me             # Utilisateur connecté
```

### Utilisateurs
```
GET    /users/profile       # Profil
PUT    /users/profile       # Mise à jour profil
POST   /users/avatar        # Upload avatar
```

### Challenges
```
GET    /challenges          # Liste (avec filtres)
GET    /challenges/:id      # Détail
POST   /challenges          # Créer
PUT    /challenges/:id      # Modifier
DELETE /challenges/:id      # Supprimer
```

### Participations
```
POST   /participations      # Participer
GET    /participations/user/:userId    # Par utilisateur
GET    /participations/challenge/:id   # Par challenge
```

### Commentaires
```
GET    /comments/challenge/:id  # Par challenge
POST   /comments                # Ajouter
DELETE /comments/:id            # Supprimer
```

### Admin
```
GET    /admin/users/pending     # Comptes en attente
PUT    /admin/users/:id/validate # Valider compte
DELETE /admin/challenges/:id    # Supprimer challenge
DELETE /admin/comments/:id      # Supprimer commentaire
GET    /admin/stats             # Statistiques
```

---

##  WebSocket (Socket.IO)

### Événements

**Client → Serveur**
```javascript
socket.emit('chat:message', { content, roomId });
socket.emit('chat:typing', { userId, roomId });
socket.emit('chat:join', { roomId });
socket.emit('chat:leave', { roomId });
```

**Serveur → Client**
```javascript
socket.on('chat:message', (message) => { ... });
socket.on('chat:typing', (data) => { ... });
socket.on('notification', (data) => { ... });
socket.on('user:connected', (user) => { ... });
socket.on('user:disconnected', (userId) => { ... });
```

---

## Démarrage du Projet =)

### Avec Docker (Recommandé)

```bash
# Cloner le dépôt
git clone https://github.com/Gaetan1303/Inter-Ville-Project.git
cd Inter-Ville-Project

# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm install
cp .env
npm start
```

### Services Disponibles
- Frontend : http://localhost:3000
- Backend : http://localhost:5000
- phpMyAdmin : http://localhost:8080
- Mailhog : http://localhost:8025


## Date de Rendu

**Jeudi 18 décembre 2025**


##  Notes Importantes

### Contraintes
- Email @laplateforme.io **obligatoire**
- Validation admin **requise** avant utilisation
- Responsive design souhaité
- Performance optimisée

### Bonnes Pratiques
- Code commenté
- Git : commits réguliers et descriptifs
- Gestion d'erreurs robuste
- Sécurité en priorité
- Tests pour les fonctionnalités critiques

---

## Licence

Ce projet est sous licence de El Miminette !
