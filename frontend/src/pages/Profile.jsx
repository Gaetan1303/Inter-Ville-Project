import React from "react";

export default function Profile() {
  const user = "test user";
  if (!user) return <p>Non connecté</p>;

  return (
    <div className="container">
      <div className="card">
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <p>Nom: Lucie</p>
        <p>Prenom: Dupont</p>
        <p>Ville: Marseille</p>
        <p>Promo: Einstein</p>
        <p>Validé: En attente</p>
        <button>Se déconnecter</button>
      </div>
    </div>
  );
}
