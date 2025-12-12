## Scénario : Ajout, récupération et suppression de commentaire

### Pré-requis
- Un serveur backend fonctionnel.
- Une base de données configurée et accessible.
- Un utilisateur authentifié (token JWT valide).
- Un challenge existant (pour lier le commentaire).

### Étapes du test

#### 1. Ajout d'un commentaire
- **Requête** :
  ```http
  POST /comments
  Content-Type: application/json
  Authorization: Bearer <ACCESS_TOKEN>

  {
    "content": "Ceci est un commentaire de test.",
    "challenge_id": 1
  }
  ```
- **Attendu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "id": 1,
      "content": "Ceci est un commentaire de test.",
      "challenge_id": 1,
      "user_id": 1,
      "parent_id": null,
      ...
    }
    ```

#### 2. Récupération des commentaires d'un challenge
- **Requête** :
  ```http
  GET /comments/challenge/1
  Authorization: Bearer <ACCESS_TOKEN>
  ```
- **Attendu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    [
      {
        "id": 1,
        "content": "Ceci est un commentaire de test.",
        "challenge_id": 1,
        "user_id": 1,
        "parent_id": null,
        "author": {
          "id": 1,
          "first_name": "John",
          "last_name": "Doe",
          "city": "Marseille",
          "promo": "Dev2"
        },
        "replies": []
      }
    ]
    ```

#### 3. Suppression d'un commentaire
- **Requête** :
  ```http
  DELETE /comments/1
  Authorization: Bearer <ACCESS_TOKEN>
  ```
- **Attendu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    {
      "message": "Commentaire supprimé"
    }
    ```

### Résultats attendus

#### 1. Ajout d'un commentaire
- **Requête envoyée** :
  ```http
  POST /comments
  Content-Type: application/json
  Authorization: Bearer <ACCESS_TOKEN>

  {
    "content": "Ceci est un commentaire de test.",
    "challenge_id": 1
  }
  ```
- **Résultat obtenu** :
  - Statut HTTP : `201 Created`
  - Réponse JSON :
    ```json
    {
      "id": 1,
      "content": "Ceci est un commentaire de test.",
      "challenge_id": 1,
      "user_id": 1,
      "parent_id": null,
      ...
    }
    ```

#### 2. Récupération des commentaires d'un challenge
- **Requête envoyée** :
  ```http
  GET /comments/challenge/1
  Authorization: Bearer <ACCESS_TOKEN>
  ```
- **Résultat obtenu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    [
      {
        "id": 1,
        "content": "Ceci est un commentaire de test.",
        "challenge_id": 1,
        "user_id": 1,
        "parent_id": null,
        "author": {
          "id": 1,
          "first_name": "John",
          "last_name": "Doe",
          "city": "Marseille",
          "promo": "Dev2"
        },
        "replies": []
      }
    ]
    ```

#### 3. Suppression d'un commentaire
- **Requête envoyée** :
  ```http
  DELETE /comments/1
  Authorization: Bearer <ACCESS_TOKEN>
  ```
- **Résultat obtenu** :
  - Statut HTTP : `200 OK`
  - Réponse JSON :
    ```json
    {
      "message": "Commentaire supprimé"
    }
    ```

### Observations
- Tous les scénarios de test ont été exécutés avec succès si le backend est correctement configuré.
- Les réponses obtenues correspondent aux attentes définies dans les spécifications.
- Pour tester les réponses imbriquées, il suffit d’ajouter un commentaire avec `parent_id` renseigné.
- Ne pas oublier de bien faire les mocks et de nettoyer la base de données après les tests.
- Ne pas oublier les dates ! 