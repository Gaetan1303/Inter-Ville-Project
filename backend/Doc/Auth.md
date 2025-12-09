# Documentation des fonctionnalités d'authentification

## Introduction
Ce document décrit les fonctionnalités d'authentification implémentées dans le projet, conformément aux spécifications du cahier des charges. Il couvre les routes, les contrôleurs, les middlewares, les services et les variables d'environnement associées.

---

## Routes d'authentification

### 1. Création d'un compte utilisateur
- **Route** : `POST /auth/register`
- **Description** : Permet à un utilisateur de créer un compte.
- **Données requises** :
  ```json
  {
    "email": "string",
    "password": "string",
    "first_name": "string",
    "last_name": "string",
    "city": "string",
    "promo": "string"
  }
  ```
- **Réponse attendue** :
  - Statut HTTP : `201 Created`
  - Corps de la réponse :
    ```json
    {
      "success": true,
      "message": "Utilisateur créé avec succès"
    }
    ```

### 2. Connexion utilisateur
- **Route** : `POST /auth/login`
- **Description** : Permet à un utilisateur de se connecter et de recevoir des tokens JWT.
- **Données requises** :
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Réponse attendue** :
  - Statut HTTP : `200 OK`
  - Corps de la réponse :
    ```json
    {
      "success": true,
      "message": "Connexion réussie",
      "data": {
        "accessToken": "<JWT_TOKEN>",
        "refreshToken": "<JWT_REFRESH_TOKEN>"
      }
    }
    ```

### 3. Validation d'un utilisateur par un administrateur
- **Route** : `POST /auth/validate-user`
- **Description** : Permet à un administrateur de valider un utilisateur.
- **Données requises** :
  ```json
  {
    "userId": "number"
  }
  ```
- **Réponse attendue** :
  - Statut HTTP : `200 OK`
  - Corps de la réponse :
    ```json
    {
      "success": true,
      "message": "Utilisateur validé avec succès"
    }
    ```

---

## Contrôleurs

### Auth Controller
- **Fonctionnalités principales** :
  - `registerUser` : Gère la création de compte utilisateur.
  - `loginUser` : Gère la connexion et la génération de tokens JWT.
  - `validateUser` : Permet à un administrateur de valider un utilisateur.
- **Validation des données** :
  - Utilise des middlewares pour vérifier les champs requis et leur format.

---

## Middlewares

### Validation Middleware
- **Rôle** : Vérifie que les données envoyées dans les requêtes respectent les règles définies (ex. : email valide, mot de passe sécurisé).

### Auth Middleware
- **Rôle** :
  - Vérifie la présence et la validité du token JWT dans les requêtes protégées.
  - Attache les informations de l'utilisateur authentifié à `req.user`.

---

## Services

### Email Service
- **Rôle** :
  - Envoie un email de bienvenue après la création d'un compte.
  - Utilise les variables d'environnement pour configurer le serveur SMTP.

### Token Service
- **Rôle** :
  - Génère des tokens JWT (accessToken et refreshToken).
  - Vérifie et décode les tokens JWT.

---

## Variables d'environnement

- **JWT_SECRET** : Clé secrète utilisée pour signer les tokens JWT.
- **JWT_EXPIRE** : Durée de validité des tokens d'accès.
- **JWT_REFRESH_EXPIRE** : Durée de validité des tokens de rafraîchissement.
- **SMTP_HOST** : Hôte du serveur SMTP pour l'envoi d'emails.
- **SMTP_PORT** : Port du serveur SMTP.
- **EMAIL_FROM** : Adresse email utilisée comme expéditeur.

---

## Correspondance avec le cahier des charges

### 1. Création d'un compte utilisateur
- **Exigence du cahier des charges** :
  - Permettre aux utilisateurs de s'inscrire avec les champs suivants : email, mot de passe, prénom, nom, ville, promotion.
  - Valider les données avant l'enregistrement.
- **Implémentation** :
  - La route `POST /auth/register` respecte ces exigences en validant les données via le middleware de validation et en enregistrant les informations dans la base de données.
  - Un email de bienvenue est envoyé après la création du compte.

### 2. Connexion utilisateur
- **Exigence du cahier des charges** :
  - Permettre aux utilisateurs de se connecter avec leur email et mot de passe.
  - Générer un token JWT pour authentifier les requêtes futures.
- **Implémentation** :
  - La route `POST /auth/login` permet la connexion et génère deux tokens (accessToken et refreshToken).
  - Les tokens sont signés avec une clé secrète définie dans les variables d'environnement.

### 3. Validation d'un utilisateur par un administrateur
- **Exigence du cahier des charges** :
  - Permettre aux administrateurs de valider les comptes utilisateurs.
  - Assurer que seules les requêtes authentifiées avec un token d'administrateur valide puissent effectuer cette action.
- **Implémentation** :
  - La route `POST /auth/validate-user` est protégée par le middleware d'authentification.
  - Seuls les administrateurs peuvent valider un utilisateur grâce à un contrôle des rôles dans le middleware.

### 4. Sécurité
- **Exigence du cahier des charges** :
  - Protéger les routes sensibles avec une authentification basée sur des tokens JWT.
  - Assurer la sécurité des mots de passe.
- **Implémentation** :
  - Les mots de passe sont hachés avant d'être enregistrés dans la base de données.
  - Les tokens JWT sont vérifiés par le middleware d'authentification pour protéger les routes sensibles.

### 5. Gestion des erreurs
- **Exigence du cahier des charges** :
  - Fournir des messages d'erreur clairs en cas de validation échouée ou d'échec d'authentification.
- **Implémentation** :
  - Les contrôleurs renvoient des messages d'erreur explicites avec des statuts HTTP appropriés (ex. : `400 Bad Request`, `401 Unauthorized`).

### 6. Variables d'environnement
- **Exigence du cahier des charges** :
  - Utiliser des variables d'environnement pour les configurations sensibles (ex. : clés JWT, paramètres SMTP).
- **Implémentation** :
  - Les variables d'environnement définies dans le fichier `.env` sont utilisées pour configurer le serveur SMTP, les clés JWT et d'autres paramètres critiques.
env : # Configuration du serveur
NODE_ENV=development
PORT=5000

# Configuration de la base de données MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cdpi_network
DB_USER=cdpi_user
DB_PASSWORD=cdpi_password

# Configuration JWT
JWT_SECRET=909090909090909090909090909090909090909090909090909090909090
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Configuration CORS
FRONTEND_URL=http://localhost:3000

# Configuration Email (Mailhog pour le développement)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@laplateforme.io

# Configuration des uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg

# Configuration admin
ADMIN_EMAIL=admin@laplateforme.io

---

## Conclusion
El miminette a encore frappé ! 