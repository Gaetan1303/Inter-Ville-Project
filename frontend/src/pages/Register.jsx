import React from "react";

export default function Register() {
  return (
    <div className="center container">
      <form className="card auth">
        <h2>Inscription</h2>
        <input value={""} placeholder="Prénom" required />
        <input value={""} placeholder="Nom" required />
        <input value={""} placeholder="email@laplateforme.io" required />
        <input type="password" value={""} placeholder="mot de passe" required />
        <input value={""} placeholder="Ville" required />
        <input value={""} placeholder="promo" />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
