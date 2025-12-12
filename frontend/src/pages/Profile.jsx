import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

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
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
