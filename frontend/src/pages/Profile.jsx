import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChallenges } from '../contexts/ChallengeContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { challenges } = useChallenges();
  const userChallenges = challenges.filter((c) => c.created_by === user?.id);
  console.log('User Challenges:', userChallenges);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="admin-container">
      <h1>Mon Profil</h1>

      {/* Section Informations personnelles */}
      <section className="stats-section">
        <h2>Informations Personnelles</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Nom Complet</div>
            <div className="stat-value" style={{ fontSize: '1.5em' }}>
              {user.first_name} {user.last_name}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Ville</div>
            <div className="stat-value" style={{ fontSize: '1.5em' }}>
              {user.city}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Promo</div>
            <div className="stat-value" style={{ fontSize: '1.5em' }}>
              {user.promo}
            </div>
          </div>
          <div className={`stat-card ${user.is_validated ? '' : 'highlight'}`}>
            <div className="stat-label">Statut</div>
            <div className="stat-value" style={{ fontSize: '1.5em' }}>
              {user.is_validated ? 'Validé' : 'En attente'}
            </div>
          </div>
        </div>
      </section>

      {/* Section Mes Challenges */}
      <section className="challenges-section">
        <h2>Mes Challenges</h2>
        {userChallenges.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Difficulté</th>
                <th>Statut</th>
                <th>Date de création</th>
              </tr>
            </thead>
            <tbody>
              {userChallenges.map((challenge) => (
                <tr key={challenge.id}>
                  <td>{challenge.id}</td>
                  <td>{challenge.title}</td>
                  <td>{challenge.category}</td>
                  <td>
                    <span className={`difficulty difficulty-${challenge.difficulty}`}>
                      {challenge.difficulty}
                    </span>
                  </td>
                  <td>{challenge.status}</td>
                  <td>{new Date(challenge.created_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">Vous n'avez créé aucun challenge pour le moment.</p>
        )}
      </section>
    </div>
  );
}
