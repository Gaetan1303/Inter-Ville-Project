# Documentation des fonctionnalités Challenges

## Introduction
Ce document décrit les fonctionnalités liées aux challenges implémentées dans le projet.

---

### 1. Création d'une instance de challenge valide
**Description** : Vérifie qu'une instance de challenge est correctement créée avec des données valides.

**Données utilisées** :

```json
{
  "title": "Test Challenge",
  "description": "This is a test challenge.",
  "category": "Test Category",
  "difficulty": "easy",
  "status": "active",
  "startDate": "2025-12-10T00:00:00.000Z",
  "endDate": "2025-12-15T00:00:00.000Z",
  "created_by": 1
}
```

**Résultat attendu** :
- Les propriétés de l'instance correspondent aux données fournies.
- Statut : Succès.

### 2. Gestion des champs obligatoires manquants
**Description** : Vérifie qu'une erreur est levée si des champs obligatoires sont manquants.

**Données utilisées** :

```json
{
  "title": null,
  "description": null,
  "category": null,
  "difficulty": null,
  "startDate": null,
  "endDate": null,
  "created_by": null
}
```

**Résultat attendu** :
- Une erreur `notNull Violation` est levée.
- Statut : Échec.

---

### 3. Création d'un challenge via l'API
**Route** : POST /challenges

**Description** : Permet de créer un challenge via l'API.

**Données requises** :

```json
{
  "title": "Integration Test Challenge",
  "description": "This is an integration test challenge.",
  "category": "Integration",
  "difficulty": "medium",
  "status": "active",
  "startDate": "2025-12-10T00:00:00.000Z",
  "endDate": "2025-12-20T00:00:00.000Z",
  "created_by": 2
}
```

**Réponse attendue** :
- Statut HTTP : 201 Created
- Corps de la réponse :

```json
{
  "success": true,
  "message": "Challenge créé avec succès",
  "data": {
    "id": 1,
    "title": "Integration Test Challenge",
    "description": "This is an integration test challenge.",
    "category": "Integration",
    "difficulty": "medium",
    "status": "active",
    "startDate": "2025-12-10T00:00:00.000Z",
    "endDate": "2025-12-20T00:00:00.000Z",
    "created_by": 2
  }
}
```

### 4. Récupération des challenges
**Route** : GET /challenges

**Description** : Permet de récupérer la liste des challenges.

**Réponse attendue** :
- Statut HTTP : 200 OK
- Corps de la réponse :

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Integration Test Challenge",
      "description": "This is an integration test challenge.",
      "category": "Integration",
      "difficulty": "medium",
      "status": "active",
      "startDate": "2025-12-10T00:00:00.000Z",
      "endDate": "2025-12-20T00:00:00.000Z",
      "created_by": 2
    }
  ]
}
```

---

### 5. Mise à jour d'un challenge
**Route** : PUT /challenges/:id

**Description** : Permet de mettre à jour les informations d'un challenge existant.

**Données requises** :

```json
{
  "title": "Updated Challenge Title",
  "description": "Updated description.",
  "category": "Updated Category",
  "difficulty": "hard",
  "status": "inactive",
  "startDate": "2025-12-15T00:00:00.000Z",
  "endDate": "2025-12-25T00:00:00.000Z"
}
```

**Réponse attendue** :
- Statut HTTP : 200 OK
- Corps de la réponse :

```json
{
  "success": true,
  "message": "Challenge mis à jour avec succès",
  "data": {
    "id": 1,
    "title": "Updated Challenge Title",
    "description": "Updated description.",
    "category": "Updated Category",
    "difficulty": "hard",
    "status": "inactive",
    "startDate": "2025-12-15T00:00:00.000Z",
    "endDate": "2025-12-25T00:00:00.000Z",
    "created_by": 1
  }
}
```

---

### 6. Suppression d'un challenge
**Route** : DELETE /challenges/:id

**Description** : Permet de supprimer un challenge existant.

**Réponse attendue** :
- Statut HTTP : 200 OK
- Corps de la réponse :

```json
{
  "success": true,
  "message": "Challenge supprimé avec succès"
}
```

---

## Correspondance avec le cahier des charges

### 1. Création d'un challenge
**Exigence du cahier des charges** :
- Permettre aux utilisateurs de créer des challenges avec des champs obligatoires.
- Valider les données avant l'enregistrement.

**Implémentation** :
- La route POST /challenges respecte ces exigences en validant les données via le middleware de validation et en enregistrant les informations dans la base de données.

### 2. Récupération des challenges
**Exigence du cahier des charges** :
- Permettre aux utilisateurs de consulter la liste des challenges.

**Implémentation** :
- La route GET /challenges retourne tous les challenges enregistrés dans la base de données.

### 3. Mise à jour d'un challenge
**Exigence du cahier des charges** :
- Permettre aux utilisateurs de modifier les informations des challenges existants.

**Implémentation** :
- La route PUT /challenges/:id permet de mettre à jour les informations d'un challenge après validation des données.

### 4. Suppression d'un challenge
**Exigence du cahier des charges** :
- Permettre aux utilisateurs de supprimer des challenges existants.

**Implémentation** :
- La route DELETE /challenges/:id permet de supprimer un challenge existant.

---

## Conclusion
Les fonctionnalités liées aux challenges respectent les exigences du cahier des charges et permettent une gestion complète des challenges.