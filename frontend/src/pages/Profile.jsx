import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return <p>Non connecté</p>;

  return (
    <div className="container">
      <div className="card">
        <h2>
          {user.first_name} {user.last_name}
        </h2>
        <p>Pseudo: {user.first_name}</p>
        <p>Ville: {user.city}</p>
        <p>Promo: {user.promo}</p>
        <p>Validé: {user.is_validated ? 'Oui' : 'En attente'}</p>
        <button>Se déconnecter</button>
      </div>
    </div>
  );
}
