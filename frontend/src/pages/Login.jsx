import React from "react";

export default function Login() {
  return (
    <div className="center container">
      <form className="card auth">
        <h2>Connexion</h2>
        <input value={""} placeholder="email@laplateforme.io" required />
        <input type="password" value={""} placeholder="mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
