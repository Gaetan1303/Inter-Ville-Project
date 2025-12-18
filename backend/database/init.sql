-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS cdpi_network CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cdpi_network;

-- Suppression des tables existantes (pour un démarrage propre)
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS users;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    promo VARCHAR(50) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_validated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_validated (is_validated)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des tokens de rafraîchissement
CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table pour la réinitialisation de mot de passe
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des administrateurs
-- Mot de passe : password123 (hashé avec bcrypt cost 12)
INSERT INTO users (email, password, first_name, last_name, city, promo, role, is_validated) VALUES
('chaoussi@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'Chaoussi', 'Admin', 'Marseille', 'Staff', 'admin', TRUE),
('atif@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'Atif', 'Admin', 'Marseille', 'Staff', 'admin', TRUE);

-- Insertion des utilisateurs validés
-- Mot de passe : password123 (hashé avec bcrypt cost 12)
INSERT INTO users (email, password, first_name, last_name, city, promo, role, is_validated) VALUES
('john.doe@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'John', 'Doe', 'Marseille', 'Dev2', 'user', TRUE),
('marie.martin@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'Marie', 'Martin', 'Paris', 'Dev3', 'user', TRUE),
('pierre.dupont@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'Pierre', 'Dupont', 'Lyon', 'Dev2', 'user', TRUE),
('sophie.bernard@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'Sophie', 'Bernard', 'Toulouse', 'Dev1', 'user', TRUE);

-- Insertion des utilisateurs non validés
-- Mot de passe : password123 (hashé avec bcrypt cost 12)
INSERT INTO users (email, password, first_name, last_name, city, promo, role, is_validated) VALUES
('lucas.petit@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'Lucas', 'Petit', 'Nice', 'Dev2', 'user', FALSE),
('emma.rousseau@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'Emma', 'Rousseau', 'Bordeaux', 'Dev3', 'user', FALSE),
('hugo.leroy@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'Hugo', 'Leroy', 'Nantes', 'Dev1', 'user', FALSE),
('lea.moreau@laplateforme.io', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU8nP0BQfYxm', 'Léa', 'Moreau', 'Lille', 'Dev2', 'user', FALSE);

-- Afficher un résumé des données insérées
SELECT 'Base de données initialisée avec succès!' AS message;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS admins FROM users WHERE role = 'admin';
SELECT COUNT(*) AS validated_users FROM users WHERE is_validated = TRUE AND role = 'user';
SELECT COUNT(*) AS pending_users FROM users WHERE is_validated = FALSE;