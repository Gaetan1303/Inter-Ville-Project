-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS cdpi_network CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cdpi_network;




-- Suppression des tables existantes dans le bon ordre (dépendances foreign key)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS participations;
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

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

-- Table des challenges
CREATE TABLE challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('code', 'design', 'sport', 'autre') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    status ENUM('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    created_by INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_created_by (created_by),
    INDEX idx_status (status),
    INDEX idx_difficulty (difficulty),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des commentaires
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    parent_id INT DEFAULT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_challenge_id (challenge_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des participations
CREATE TABLE participations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    status ENUM('registered', 'in_progress', 'completed', 'abandoned') NOT NULL DEFAULT 'registered',
    score INT DEFAULT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_challenge (user_id, challenge_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_challenge_id (challenge_id),
    INDEX idx_status (status)
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
('chaoussi@laplateforme.io', '$2b$12$OQ2KVKvsONKkdeTd0jJsNuaAbGHt7NitQ8.c6oFxXKQtzlRvx3QD6', 'Chaoussi', 'Admin', 'Marseille', 'Staff', 'admin', TRUE),
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