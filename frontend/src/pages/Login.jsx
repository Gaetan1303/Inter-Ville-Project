import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToastContext } from "../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToastContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      showToast("Connexion réussie !", "success");
      navigate("/");
    } catch (err) {
      showToast(err.message || "Erreur connexion", "error");
    }
  };

  return (
    <div className="center container">
      <form onSubmit={submit} className="card auth">
        <h2>Connexion</h2>
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
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
