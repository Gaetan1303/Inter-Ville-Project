const { body } = require("express-validator");

/**
 * Validateur pour l'inscription d'un nouvel utilisateur
 * Vérifie tous les champs requis et applique les règles de validation
 */
const register_validator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Format d'email invalide")
    .normalizeEmail()
    .custom((value) => {
      // Vérifie que l'email se termine par @laplateforme.io
      if (!value.endsWith("@laplateforme.io")) {
        throw new Error("L'email doit être un email @laplateforme.io");
      }
      return true;
    }),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),

  body("confirm_password").custom((value, { req }) => {
    // Vérifie que les deux mots de passe correspondent
    if (value !== req.body.password) {
      throw new Error("Les mots de passe ne correspondent pas");
    }
    return true;
  }),

  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("Le prénom est requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le prénom doit contenir entre 2 et 100 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
    .withMessage("Le prénom ne doit contenir que des lettres"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
    .withMessage("Le nom ne doit contenir que des lettres"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("La ville est requise")
    .isIn(["Marseille", "Paris", "Lyon", "Bordeaux", "Toulouse"])
    .withMessage(
      "Ville invalide. Villes acceptées: Marseille, Paris, Lyon, Bordeaux, Toulouse"
    ),

  body("promo")
    .trim()
    .notEmpty()
    .withMessage("La promotion est requise")
    .isLength({ min: 2, max: 100 })
    .withMessage("La promotion doit contenir entre 2 et 100 caractères"),
];

/**
 * Validateur pour la connexion
 * Vérifie l'email et le mot de passe
 */
const login_validator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Format d'email invalide")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Le mot de passe est requis"),
];

module.exports = {
  register_validator,
  login_validator,
};
