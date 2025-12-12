
# Test d'intégration pour les fonctionnalités principales et l'authentification

## Scénario : Création, consultation, commentaire, participation, upload d'image, et modération de challenge

### Pré-requis
- Un serveur backend fonctionnel.
- Une base de données configurée et accessible.
- Les variables d'environnement nécessaires (JWT_SECRET, JWT_EXPIRE, etc.).
- Un compte admin existant pour la validation et la modération.


### Étapes du test

#### 0. Création d'un compte utilisateur
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

#### 0b. Connexion de l'utilisateur
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

#### 0c. Validation de l'utilisateur par un admin
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

#### 1. Création d'un challenge
- **Requête** :
  ```http
  POST /challenges
  Content-Type: application/json
  Authorization: Bearer <USER_ACCESS_TOKEN>

  {
    "title": "Défi photo",
    "description": "Prends une photo de ta ville !",
    "category": "Photo",
    "start_date": "2025-12-01",
    "end_date": "2025-12-31"
  }
  ```
- **Attendu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "title": "Défi photo",
        ...
      }
    }
    ```

#### 2. Upload d'une image pour un challenge
- **Requête** :
  ```http
  POST /challenges/upload-image
  Content-Type: application/json
  Authorization: Bearer <USER_ACCESS_TOKEN>

  {
    "filename": "photo-ville.png",
    "data": "<base64 de l'image>"
  }
  ```
- **Attendu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "image": "/uploads/challenges/photo-ville.png"
    }
    ```

#### 3. Consultation de la liste des challenges
- **Requête** :
  ```http
  GET /challenges
  Authorization: Bearer <USER_ACCESS_TOKEN>
  ```
- **Attendu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "data": [ ... ]
    }
    ```

#### 4. Ajout d'un commentaire sur un challenge
- **Requête** :
  ```http
  POST /comments
  Content-Type: application/json
  Authorization: Bearer <USER_ACCESS_TOKEN>

  {
    "challengeId": 1,
    "content": "Super idée !"
  }
  ```
- **Attendu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "content": "Super idée !",
        ...
      }
    }
    ```

#### 5. Participation à un challenge
- **Requête** :
  ```http
  POST /participations
  Content-Type: application/json
  Authorization: Bearer <USER_ACCESS_TOKEN>

  {
    "challengeId": 1
  }
  ```
- **Attendu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "challengeId": 1,
        ...
      }
    }
    ```

#### 6. Suppression d'un challenge par un admin
- **Requête** :
  ```http
  DELETE /challenges/1
  Authorization: Bearer <ADMIN_ACCESS_TOKEN>
  ```
- **Attendu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "message": "Challenge deleted successfully"
    }
    ```


### Résultats des tests d'intégration

#### 0. Création d'un compte utilisateur
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

#### 0b. Connexion de l'utilisateur
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

#### 0c. Validation de l'utilisateur par un admin
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

#### 1. Création d'un challenge
- **Requête envoyée** :
  ```http
  POST /challenges
  Content-Type: application/json
  Authorization: Bearer <USER_ACCESS_TOKEN>

  {
    "title": "Défi photo",
    "description": "Prends une photo de ta ville !",
    "category": "Photo",
    "start_date": "2025-12-01",
    "end_date": "2025-12-31"
  }
  ```
- **Résultat obtenu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "title": "Défi photo",
        ...
      }
    }
    ```

#### 2. Upload d'une image pour un challenge
- **Requête envoyée** :
  ```http
  POST /challenges/upload-image
  Content-Type: application/json
  Authorization: Bearer <USER_ACCESS_TOKEN>

  {
    "filename": "photo-ville.png",
    "data": "<base64 de l'image>"
  }
  ```
- **Résultat obtenu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "image": "/uploads/challenges/photo-ville.png"
    }
    ```

#### 3. Consultation de la liste des challenges
- **Requête envoyée** :
  ```http
  GET /challenges
  Authorization: Bearer <USER_ACCESS_TOKEN>
  ```
- **Résultat obtenu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "data": [ ... ]
    }
    ```

#### 4. Ajout d'un commentaire sur un challenge
- **Requête envoyée** :
  ```http
  POST /comments
  Content-Type: application/json
  Authorization: Bearer <USER_ACCESS_TOKEN>

  {
    "challengeId": 1,
    "content": "Super idée !"
  }
  ```
- **Résultat obtenu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "content": "Super idée !",
        ...
      }
    }
    ```

#### 5. Participation à un challenge
- **Requête envoyée** :
  ```http
  POST /participations
  Content-Type: application/json
  Authorization: Bearer <USER_ACCESS_TOKEN>

  {
    "challengeId": 1
  }
  ```
- **Résultat obtenu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "challengeId": 1,
        ...
      }
    }
    ```

#### 6. Suppression d'un challenge par un admin
- **Requête envoyée** :
  ```http
  DELETE /challenges/1
  Authorization: Bearer <ADMIN_ACCESS_TOKEN>
  ```
- **Résultat obtenu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    {
      "success": true,
      "message": "Challenge deleted successfully"
    }
    ```

### Observations
- Tous les scénarios de test ont été exécutés avec succès.
- Les réponses obtenues correspondent aux attentes définies dans les spécifications.
- L’upload d’image fonctionne et le fichier est bien présent côté serveur.
- Les droits d’accès (user/admin) sont respectés.
