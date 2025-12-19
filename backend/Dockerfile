# Utiliser une image Node.js officielle comme base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de production
RUN npm install --production

# Installer les dépendances spécifiques au backend
RUN npm install bcrypt bcryptjs compression cors dotenv express express-rate-limit express-validator helmet jsonwebtoken morgan multer mysql2 nodemailer sequelize socket.io swagger-jsdoc swagger-ui-express redis \
    ioredis cookie-parser express-session uuid joi pm2 nodemon

# Installer redis-tools, wget et mysql-client pour les tests et connexions
RUN apt-get update && apt-get install -y redis-tools wget default-mysql-client

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port de l'application
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["node", "src/server.js"]