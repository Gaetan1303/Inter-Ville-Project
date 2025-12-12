# Test d'intégration pour l'authentification

## Scénario : Création de compte, connexion et validation admin

### Pré-requis
- Un serveur backend fonctionnel.
- Une base de données configurée et accessible.
- Les variables d'environnement nécessaires (JWT_SECRET, JWT_EXPIRE, etc.).

### Étapes du test

#### 1. Création d'un compte utilisateur
- **Requête** :
  ```http
  POST /auth/register
  Content-Type: application/json

  {
    "email": "test@laplateforme.io",
    "password": "Password123!",
    "first_name": "John",
    "last_name": "Doe",
    "city": "Marseille",
    "promo": "Dev2"
  }
  ```
- **Attendu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "message": "Utilisateur créé avec succès"
    }
    ```

#### 2. Connexion de l'utilisateur
- **Requête** :
  ```http
  POST /auth/login
  Content-Type: application/json

  {
    "email": "test@laplateforme.io",
    "password": "Password123!"
  }
  ```
- **Attendu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
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

#### 3. Validation de l'utilisateur par un admin
- **Requête** :
  ```http
  POST /auth/validate-user
  Content-Type: application/json
  Authorization: Bearer <ADMIN_ACCESS_TOKEN>

  {
    "userId": 1
  }
  ```
- **Attendu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "message": "Utilisateur validé avec succès"
    }
    ```

### Résultats des tests d'intégration

#### 1. Création d'un compte utilisateur
- **Requête envoyée** :
  ```http
  POST /auth/register
  Content-Type: application/json

  {
    "email": "test@laplateforme.io",
    "password": "Password123!",
    "first_name": "John",
    "last_name": "Doe",
    "city": "Marseille",
    "promo": "Dev2"
  }
  ```
- **Résultat obtenu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "message": "Utilisateur créé avec succès"
    }
    ```

#### 2. Connexion de l'utilisateur
- **Requête envoyée** :
  ```http
  POST /auth/login
  Content-Type: application/json

  {
    "email": "test@laplateforme.io",
    "password": "Password123!"
  }
  ```
- **Résultat obtenu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
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

#### 3. Validation de l'utilisateur par un admin
- **Requête envoyée** :
  ```http
  POST /auth/validate-user
  Content-Type: application/json
  Authorization: Bearer <ADMIN_ACCESS_TOKEN>

  {
    "userId": 1
  }
  ```
- **Résultat obtenu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "message": "Utilisateur validé avec succès"
    }
    ```

### Observations
- Tous les scénarios de test ont été exécutés avec succès.
- Les réponses obtenues correspondent aux attentes définies dans les spécifications.
- Une erreur de connexion au serveur SMTP a été détectée lors de l'envoi de l'email de bienvenue, mais cela n'a pas bloqué les tests.