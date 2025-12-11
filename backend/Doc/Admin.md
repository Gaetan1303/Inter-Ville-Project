# Documentation des fonctionnalités Admin

## Introduction
Ce document décrit les fonctionnalités liées aux administrateurs, et la validation des utilisateurs.

---

## Routes Admin

### 1. Validation d'un utilisateur
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
- **Conditions** :
  - L'utilisateur doit être authentifié en tant qu'administrateur.
  - Si l'utilisateur n'existe pas :
    ```json
    {
      "success": false,
      "message": "Utilisateur non trouvé"
    }
    ```
  - Si l'utilisateur n'a pas les droits d'administrateur :
    ```json
    {
      "success": false,
      "message": "Accès refusé : droits insuffisants"
    }
    ```

---

## Notes
- Cette fonctionnalité est réservée aux administrateurs.
- Les tokens JWT sont utilisés pour l'authentification et doivent être inclus dans l'en-tête `Authorization` sous la forme `Bearer <token>`.
