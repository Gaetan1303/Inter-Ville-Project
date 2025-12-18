# Utiliser une image Node.js officielle comme base
FROM node:20.19

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

	# Copier les fichiers package.json et package-lock.json du frontend
	COPY package*.json ./

# Installer toutes les dépendances (production + dev)
RUN npm install

	# Copier le reste des fichiers de l'application frontend
	COPY . .

# Construire l'application pour la production
RUN npm run build

# Exposer le port de l'application
EXPOSE 3000

# Démarrer l'application avec Vite
CMD ["npm", "run", "preview"]