# Inter‑Ville Project • Frontend (React + Vite)

Ce frontend React pilote l’application Inter‑Ville (défis, commentaires, profil, admin). Il utilise Vite, un proxy de dev pour éviter le CORS, et une architecture Context API pour l’auth, les défis et l’admin.

## Prérequis
- Node 18+ recommandé
- Backend démarré sur `http://localhost:5000`

## Installation
```bash
cd frontend
npm install
```

## Démarrage en développement
```bash
npm run dev
```
Ouvre ensuite l’UI sur `http://localhost:5173`.

### Proxy Vite (anti‑CORS)
Le fichier `vite.config.js` redirige les appels `\u002Fapi` vers `http://localhost:5000`.
- Frontend appelle `\u002Fapi\u002F...`
- Vite proxy -> Backend `http://localhost:5000`

L’instance Axios pointe par défaut sur `\u002Fapi` (voir `src/api/axiosInstance.js`). En production, définissez `VITE_API_BASE_URL` pour bypasser le proxy et cibler l’API réelle.

```bash
# Exemple build prod (avec URL API distante)
VITE_API_BASE_URL=https://api.example.com npm run build
```

## Architecture
```
src/
	api/axiosInstance.js      # Axios + header Authorization + baseURL /api
	components/
		CommentList.jsx         # Liste + réponses imbriquées, post + rechargement
		ChallengeCard.jsx, header.jsx
	contexts/
		AuthContext.jsx         # Auth, user, tokens
		ChallengeContext.jsx    # CRUD défis + commentaires
		AdminContext.jsx        # Admin (stats, validation, suppression)
	pages/
		Home.jsx                # Accueil
		Challenges.jsx          # Liste des défis
		ChallengeDetail.jsx     # Détail avec barre de progression (dates)
		CreateChallenge.jsx     # Création de défi
		EditChallenge.jsx       # Édition d’un défi (prérempli)
		Profile.jsx             # Profil + mes défis + actions Edit/Suppr
		Login.jsx, Register.jsx, Admin.jsx
	App.jsx                   # Routes et ProtectedAdminRoute
	index.css                 # Thème néon/dark global
```

## Fonctionnalités clés (étapes réalisées)
- Auth persistante (tokens) et header `Authorization` injecté automatiquement.
- Protection admin via `ProtectedAdminRoute`.
- Défis: création, édition (préremplie), suppression depuis le Profil.
- Détail défi: barre de progression moderne (début/fin) et statut (À venir/En cours/Terminé).
- Commentaires: affichage hiérarchique (réponses) et rechargement après post pour avoir l’`author.first_name` immédiatement.
- Proxy Vite: appels `\u002Fapi` sans CORS en dev.

## Routes UI
- `/` Accueil
- `/Challenges` Liste des défis
- `/Challenge/:id` Détail d’un défi
- `/create` Créer un défi
- `/challenges/:id/edit` Éditer un défi
- `/profile` Mon profil (mes défis + actions)
- `/admin` Admin (protégé, rôle admin)

## Flux Défis (ChallengeContext)
- `fetchChallenges()` charge la liste initiale.
- `createChallenge(payload)` crée et préprend le défi.
- `fetchChallengeById(id)` retourne un défi.
- `updateChallenge(id, payload)` met à jour localement après PUT.
- `deleteChallenge(id)` supprime localement après DELETE.
- `fetchComments(challengeId)` récupère les commentaires.
- `postComment({ challengeId, content, parent_id, user_id })` publie et on recharge pour afficher l’auteur.

## Conseils production
- Définir `VITE_API_BASE_URL` vers l’API de prod.
- Ajuster le CORS côté backend pour votre domaine de prod.
- Désactiver ou protéger la doc Swagger côté backend en prod.

## Dépannage rapide
- CORS en dev: vérifier que vous appelez `\u002Fapi` et que Vite est lancé.
- 404 API: s’assurer que le backend écoute sur `http://localhost:5000`.
- Auth: vérifier que le token est présent dans `localStorage` et que les routes nécessitant auth renvoient 401 si non connecté.

---
Inter‑Ville Project • Frontend
