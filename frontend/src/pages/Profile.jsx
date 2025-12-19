import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChallenges } from '../contexts/ChallengeContext';
import { useToastContext } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../styles/Admin.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { challenges, deleteChallenge } = useChallenges();
  const { showToast } = useToastContext();
  const [badges, setBadges] = useState([]);
  const userChallenges = challenges.filter((c) => c.created_by === user?.id);
  // Log supprimé pour la production

  // Fonction pour supprimer un challenge avec confirmation
  const handleDelete = async (id, title) => {
    if (window.confirm(`Etes-vous sur de vouloir supprimer le challenge "${title}" ?`)) {
      try {
        await deleteChallenge(id);
        showToast('Challenge supprimé avec succès !', 'success');
      } catch (err) {
        showToast('Erreur lors de la suppression du challenge.', 'error');
      }
    }
  };

  // Fonction pour rediriger vers la page de modification
  const handleEdit = (id) => {
    navigate(`/challenges/${id}/edit`);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Suppression de la récupération des badges pour les utilisateurs
    setBadges([]);
  }, [user]);

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate]);


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
              {user.is_validated ? 'Valide' : 'En attente'}
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
                <th>Categorie</th>
                <th>Difficulte</th>
                <th>Statut</th>
                <th>Date de creation</th>
                <th>Actions</th>
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
                  <td>{new Date(challenge.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(challenge.id)}
                        title="Modifier"
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(challenge.id, challenge.title)}
                        title="Supprimer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">Vous n'avez cree aucun challenge pour le moment.</p>
        )}
      </section>

      {/* Section Mes Badges */}
      <section className="badges-section">
        <h2>Mes Badges</h2>
        {badges.length > 0 ? (
          <ul>
            {badges.map((badge, idx) => (
              <li key={idx} className="badge-pill">{badge}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">Aucun badge pour le moment.</p>
        )}
      </section>

      {/* Section Avatar */}
      <section className="avatar-section">
        <h2>Mon Avatar</h2>
        <div className="avatar-container">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt="Avatar utilisateur"
            className="avatar-image"
          />
          <input
            type="file"
            accept="image/*"
            id="avatar-upload"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const formData = new FormData();
                formData.append('avatar', file);
                try {
                  const res = await axiosInstance.post('/users/avatar', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  });
                  showToast('Avatar mis à jour avec succès !', 'success');
                  // Mettre à jour l'avatar de l'utilisateur
                  user.avatar = res.data.avatar;
                } catch (err) {
                  showToast('Erreur lors de la mise à jour de l\'avatar.', 'error');
                }
              }
            }}
          />
          <button
            className="action-btn upload-btn"
            onClick={() => document.getElementById('avatar-upload').click()}
          >
            Upload Avatar
          </button>
        </div>
      </section>
    </div>
  );
}
