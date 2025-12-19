import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToastContext } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToastContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [promo, setPromo] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        city,
        promo,
      });
      showToast(
        "Inscription enregistrée. Vérifie ton e-mail. Compte en attente de validation.",
        "success"
      );
      navigate("/login");
    } catch (err) {
      showToast(err.message || "Erreur inscription", "error");
    }
  };

  return (
    <div className="center container">
      <form onSubmit={submit} className="card auth">
        <h2>Inscription</h2>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom"
          required
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Nom"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@laplateforme.io"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="mot de passe"
          required
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ville"
        />
        <input
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          placeholder="promo"
        />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
